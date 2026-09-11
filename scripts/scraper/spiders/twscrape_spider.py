import os
import asyncio
import logging
from twscrape import API, AccountsPool
from db_utils import save_jobs

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("TwitterSpider")

async def setup_accounts(api: API):
    """
    Configure and login Twitter burner account if variables are present in environment.
    """
    username = os.environ.get("TWITTER_USERNAME")
    password = os.environ.get("TWITTER_PASSWORD")
    email = os.environ.get("TWITTER_EMAIL")
    totp_secret = os.environ.get("TWITTER_2FA_SECRET", "")

    if not username or not password or not email:
        logger.warning(
            "TWITTER_USERNAME, TWITTER_PASSWORD, or TWITTER_EMAIL missing in environment. "
            "Please configure burner accounts in .env to use Twitter scraping. "
            "Skipping twscrape account initialization."
        )
        return False

    try:
        # Check if account is already added to twscrape.db pool
        pool = AccountsPool()
        accounts = await pool.get_all()
        is_added = any(acc.username == username for acc in accounts)

        if not is_added:
            logger.info(f"Adding burner account '{username}' to twscrape accounts pool...")
            await pool.add_account(username, password, email, totp_secret)
            logger.info(f"Account '{username}' added. Logging in...")
            
            # Login and save session cookie
            await pool.login_all()
            logger.info("Login process completed for twscrape pool.")
        else:
            logger.info(f"Burner account '{username}' is already in twscrape accounts pool.")
            
        return True
    except Exception as e:
        logger.error(f"Error during twscrape account setup: {e}", exc_info=True)
        return False

async def scrape_tweets(queries=None, limit_per_query=10):
    """
    Perform search on Twitter and scrape tweets matching keywords.
    """
    if queries is None:
        queries = ["loker developer", "lowongan backend", "hiring frontend", "loker designer"]

    api = API()
    
    # Try setup account before proceeding
    has_account = await setup_accounts(api)
    if not has_account:
        logger.warning("No active Twitter account session. Scraping will likely fail. Aborting scraper.")
        return []

    all_jobs = []
    
    logger.info(f"Starting Twitter scraping with queries: {queries}")

    for q in queries:
        logger.info(f"Searching tweets for query: '{q}'...")
        try:
            count = 0
            async for tweet in api.search(q, limit=limit_per_query):
                count += 1
                # Format tweet URL
                tweet_url = f"https://x.com/{tweet.user.username}/status/{tweet.id}"

                # Extract a cleaner title
                text_lines = [line.strip() for line in tweet.rawContent.split("\n") if line.strip()]
                title = text_lines[0] if text_lines else "Lowongan Kerja Twitter"
                if len(title) > 60:
                    title = title[:57] + "..."

                job_data = {
                    "source_platform": "Twitter",
                    "source_url": tweet_url,
                    "company_name": tweet.user.displayname or tweet.user.username or "Twitter Recruiter",
                    "job_title": f"[X/Twitter] {title}",
                    "location": tweet.user.location or "Indonesia (Remote / Onsite)",
                    "salary_range": "TBD",  # Text parsing would be needed to extract salary
                    "raw_description": tweet.rawContent
                }

                # Deduplicate
                if not any(j["source_url"] == job_data["source_url"] for j in all_jobs):
                    all_jobs.append(job_data)

            logger.info(f"Retrieved {count} tweets for query '{q}'.")

        except Exception as e:
            logger.error(f"Error scraping query '{q}' from Twitter: {e}", exc_info=True)

    logger.info(f"Scraped a total of {len(all_jobs)} unique job-related tweets.")
    
    # Save jobs
    save_jobs(all_jobs, "twitter")
    return all_jobs

def run_twscrape(queries=None, limit_per_query=5):
    """
    Sync wrapper to run async scraper.
    """
    return asyncio.run(scrape_tweets(queries, limit_per_query))

if __name__ == "__main__":
    run_twscrape()
