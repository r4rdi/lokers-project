import os
import logging
from facebook_scraper import get_posts, set_cookies
from db_utils import save_jobs

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("FacebookSpider")

def configure_facebook_session():
    """
    Look for facebook_cookies.txt in the current directory to enable
    authenticated scraping, reducing risk of blocks and captcha walls.
    """
    cookie_path = "facebook_cookies.txt"
    if os.path.exists(cookie_path):
        logger.info(f"Loading Facebook session cookies from {cookie_path}...")
        try:
            set_cookies(cookie_path)
            logger.info("Facebook cookies configured successfully.")
            return True
        except Exception as e:
            logger.error(f"Failed to set Facebook cookies: {e}")
    else:
        logger.info(
            "No 'facebook_cookies.txt' found in current directory. "
            "Scraping will proceed as an anonymous guest (may be rate-limited or blocked)."
        )
    return False

def run_facebook(sources=None, pages_to_scrape=2):
    """
    Scrape recent job posts from public Facebook pages or groups.
    """
    if sources is None:
        sources = ["lowongankerja.id", "lokerjakarta.official", "LokerNasional"]

    configure_facebook_session()
    all_jobs = []

    logger.info(f"Starting Facebook scraping for sources: {sources}")

    for source in sources:
        logger.info(f"Fetching posts from Facebook source: '{source}'...")
        try:
            post_count = 0
            # Scrape public page posts
            for post in get_posts(source, pages=pages_to_scrape):
                post_count += 1
                post_url = post.get("post_url")
                post_id = post.get("post_id")

                if not post_url and post_id:
                    post_url = f"https://www.facebook.com/{post_id}"
                
                if not post_url:
                    continue

                text = post.get("text") or ""
                if not text.strip():
                    continue

                # Extract first line for title
                text_lines = [line.strip() for line in text.split("\n") if line.strip()]
                title = text_lines[0] if text_lines else "Lowongan Kerja Facebook"
                if len(title) > 60:
                    title = title[:57] + "..."

                # Try to extract company name or default to the page name
                company_name = f"FB Page: {source}"

                job_data = {
                    "source_platform": "Facebook",
                    "source_url": post_url,
                    "company_name": company_name,
                    "job_title": f"[Facebook] {title}",
                    "location": "Indonesia",  # Standard default, parseable from description
                    "salary_range": "TBD",
                    "raw_description": text
                }

                # Deduplicate
                if not any(j["source_url"] == job_data["source_url"] for j in all_jobs):
                    all_jobs.append(job_data)

            logger.info(f"Scraped {post_count} posts from '{source}'.")

        except Exception as e:
            logger.error(f"Error scraping Facebook page '{source}': {e}", exc_info=True)

    logger.info(f"Scraped a total of {len(all_jobs)} unique Facebook posts.")
    
    # Save the scraped jobs using database utility
    save_jobs(all_jobs, "facebook")
    return all_jobs

if __name__ == "__main__":
    run_facebook()
