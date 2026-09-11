import logging
import pandas as pd
from jobspy import scrape_jobs
from db_utils import save_jobs

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("JobSpySpider")

def construct_salary_range(row):
    """
    Safely construct a human-readable salary range string from pandas row data.
    """
    min_amt = row.get("min_amount")
    max_amt = row.get("max_amount")
    currency = row.get("currency", "IDR")
    interval = row.get("interval", "monthly")

    # pandas NaN check
    if pd.isna(min_amt) and pd.isna(max_amt):
        return "TBD"

    # Normalize interval name
    interval_str = "bulan" if interval == "monthly" else "tahun" if interval == "yearly" else interval

    if not pd.isna(min_amt) and not pd.isna(max_amt):
        return f"{currency} {int(min_amt):,} - {int(max_amt):,} per {interval_str}"
    elif not pd.isna(min_amt):
        return f"Mulai dari {currency} {int(min_amt):,} per {interval_str}"
    elif not pd.isna(max_amt):
        return f"Hingga {currency} {int(max_amt):,} per {interval_str}"
    return "TBD"

def run_jobspy(search_keywords=None, results_per_keyword=5):
    """
    Scrape jobs using python-jobspy across multiple sites.
    """
    if search_keywords is None:
        search_keywords = ["backend developer", "frontend developer", "data analyst", "devops"]

    sites = ["linkedin", "indeed", "glassdoor", "zip_recruiter"]
    all_jobs = []

    logger.info(f"Starting JobSpy crawler for sites: {sites}")

    for keyword in search_keywords:
        logger.info(f"Searching jobs for keyword: '{keyword}'...")
        for site in sites:
            logger.info(f"Scraping '{site}' for keyword '{keyword}'...")
            try:
                # Scrape jobs using python-jobspy for the single site
                jobs_df = scrape_jobs(
                    site_name=[site],
                    search_term=keyword,
                    location="Jakarta, Indonesia",
                    results_wanted=results_per_keyword,
                    hours_old=72,              # Check last 3 days
                    country_indeed='indonesia'
                )

                if jobs_df.empty:
                    logger.info(f"No jobs found on '{site}' for keyword '{keyword}' in the last 72 hours.")
                    continue

                logger.info(f"Found {len(jobs_df)} raw results on '{site}' for keyword '{keyword}'. Parsing...")

                for _, row in jobs_df.iterrows():
                    # Avoid inserting incomplete records
                    job_url = str(row.get("job_url", "")).strip()
                    if not job_url or job_url == "nan":
                        continue

                    job_data = {
                        "source_platform": str(row.get("site", site)).capitalize(),
                        "source_url": job_url,
                        "company_name": str(row.get("company", "Perusahaan Rahasia")).strip(),
                        "job_title": str(row.get("title", "Spesialis IT")).strip(),
                        "location": str(row.get("location", "Jakarta, Indonesia")).strip(),
                        "salary_range": construct_salary_range(row),
                        "raw_description": str(row.get("description", "")).strip(),
                    }

                    # Deduplicate within our scraped batch list
                    if not any(j["source_url"] == job_data["source_url"] for j in all_jobs):
                        all_jobs.append(job_data)

            except Exception as e:
                logger.warning(f"Failed to scrape '{site}' for keyword '{keyword}': {e}")

    logger.info(f"Scraped a total of {len(all_jobs)} unique jobs using JobSpy.")
    
    # Save the scraped jobs using database utility
    save_jobs(all_jobs, "jobspy")
    return all_jobs

if __name__ == "__main__":
    # Test scrape
    run_jobspy(search_keywords=["backend developer"], results_per_keyword=3)
