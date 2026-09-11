import logging
from playwright.sync_api import sync_playwright
from playwright_stealth import stealth_sync
from db_utils import save_jobs

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("PlaywrightFallback")

def run_playwright_scraper(search_query="developer", max_jobs=5):
    """
    Automate browser interaction with Glints (or similar dynamic website)
    using Playwright + Stealth plugin to bypass bot detection.
    """
    logger.info(f"Launching Playwright browser for query: '{search_query}'...")
    
    scraped_jobs = []
    
    with sync_playwright() as p:
        # Launch browser with custom arguments
        browser = p.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled"]
        )
        
        # Create a new browser context with a real user agent
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        
        page = context.new_page()
        
        # Apply stealth scripts to hide playwright attributes
        stealth_sync(page)
        
        # URL for searching jobs on Glints Indonesia
        search_url = f"https://glints.com/id/en/opportunities/jobs?keyword={search_query}"
        logger.info(f"Navigating to {search_url}...")
        
        try:
            page.goto(search_url, wait_until="domcontentloaded", timeout=30000)
            
            # Wait for any job card container to be rendered
            # Glints job cards usually have class containing 'JobCard' or reside in list containers
            # We wait for common elements or links matching the pattern '/opportunities/jobs/'
            page.wait_for_timeout(5000)  # Wait for dynamic JS content to hydrate
            
            # Find all job links
            # Detail links format: /id/en/opportunities/jobs/some-title-slug/uuid-or-hash
            anchors = page.query_selector_all("a")
            job_links = []
            
            for anchor in anchors:
                href = anchor.get_attribute("href") or ""
                if "/opportunities/jobs/" in href:
                    full_url = href if href.startswith("http") else f"https://glints.com{href}"
                    if full_url not in job_links:
                        job_links.append(full_url)
                        
            logger.info(f"Found {len(job_links)} potential job detail links on the page.")
            
            # Take the top N links
            job_links = job_links[:max_jobs]
            
            for index, detail_url in enumerate(job_links):
                logger.info(f"Processing job {index + 1}/{len(job_links)}: {detail_url}")
                try:
                    # Navigate to detail page
                    detail_page = context.new_page()
                    stealth_sync(detail_page)
                    
                    detail_page.goto(detail_url, wait_until="domcontentloaded", timeout=20000)
                    detail_page.wait_for_timeout(2000)  # wait for hydration
                    
                    # Extract page title as job title / company name
                    page_title = detail_page.title()
                    
                    # Try to extract structured title & company from meta tags or header elements
                    job_title = "IT Specialist"
                    company_name = "Perusahaan Dynamic"
                    
                    h1 = detail_page.query_selector("h1")
                    if h1:
                        job_title = h1.inner_text().strip()
                        
                    # Common selectors for company name
                    company_selector = detail_page.query_selector("[class*='Company'], [class*='company'], a[href*='companies']")
                    if company_selector:
                        company_name = company_selector.inner_text().strip()
                    elif " at " in page_title:
                        # Fallback parsing from page title: "Job Title at Company | Glints"
                        parts = page_title.split(" at ")
                        if len(parts) > 1:
                            company_name = parts[1].split("|")[0].strip()
                            
                    # Extract job description text
                    description_div = detail_page.query_selector("[class*='Description'], [class*='description'], [class*='JobDetail'], [class*='jobDetail'], article")
                    raw_description = ""
                    if description_div:
                        raw_description = description_div.inner_text().strip()
                    else:
                        # Fallback: grab body text
                        body = detail_page.query_selector("body")
                        if body:
                            raw_description = body.inner_text().strip()
                            
                    # Extract salary/location info if available
                    location = "Jakarta, Indonesia"
                    location_div = detail_page.query_selector("[class*='Location'], [class*='location'], [class*='Map']")
                    if location_div:
                        location = location_div.inner_text().strip()
                        
                    salary_range = "TBD"
                    salary_div = detail_page.query_selector("[class*='Salary'], [class*='salary'], [class*='Money']")
                    if salary_div:
                        salary_range = salary_div.inner_text().strip()
                        
                    job_data = {
                        "source_platform": "Glints (Playwright)",
                        "source_url": detail_url,
                        "company_name": company_name,
                        "job_title": job_title,
                        "location": location,
                        "salary_range": salary_range,
                        "raw_description": raw_description
                    }
                    
                    scraped_jobs.append(job_data)
                    detail_page.close()
                    
                except Exception as detail_err:
                    logger.error(f"Error scraping detail page {detail_url}: {detail_err}")
                    
        except Exception as e:
            logger.error(f"Error navigating search page: {e}", exc_info=True)
            
        browser.close()
        
    logger.info(f"Playwright crawling finished. Scraped {len(scraped_jobs)} jobs.")
    
    # Save the scraped jobs using database utility
    save_jobs(scraped_jobs, "playwright_glints")
    return scraped_jobs

if __name__ == "__main__":
    run_playwright_scraper(search_query="backend developer", max_jobs=2)
