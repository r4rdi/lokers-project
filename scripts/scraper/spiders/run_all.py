import argparse
import sys
import logging
from db_utils import load_env

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] (%(name)s) %(message)s"
)
logger = logging.getLogger("ScraperRunner")

def run_jobspy_scraper(args):
    logger.info("=======================================")
    logger.info("Initializing JobSpy scraper...")
    from jobspy_spider import run_jobspy
    keywords = args.keywords.split(",") if args.keywords else None
    run_jobspy(search_keywords=keywords, results_per_keyword=args.limit)

def run_twitter_scraper(args):
    logger.info("=======================================")
    logger.info("Initializing Twitter (twscrape) scraper...")
    from twscrape_spider import run_twscrape
    queries = args.queries.split(",") if args.queries else None
    run_twscrape(queries=queries, limit_per_query=args.limit)

def run_instagram_scraper(args):
    logger.info("=======================================")
    logger.info("Initializing Instagram (instagrapi) scraper...")
    from instagrapi_spider import run_instagrapi
    hashtags = args.hashtags.split(",") if args.hashtags else None
    run_instagrapi(hashtags=hashtags, amount_per_hashtag=args.limit)

def run_facebook_scraper(args):
    logger.info("=======================================")
    logger.info("Initializing Facebook scraper...")
    from facebook_spider import run_facebook
    sources = args.sources.split(",") if args.sources else None
    run_facebook(sources=sources, pages_to_scrape=args.limit)

def run_playwright_scraper(args):
    logger.info("=======================================")
    logger.info("Initializing Playwright fallback scraper...")
    from playwright_fallback import run_playwright_scraper as run_pw
    query = args.keywords.split(",")[0] if args.keywords else "developer"
    run_pw(search_query=query, max_jobs=args.limit)

def main():
    # Load env variables at start
    load_env()

    parser = argparse.ArgumentParser(description="OneApply AI - Scraper Engine Runner")
    parser.add_argument(
        "--scraper", 
        choices=["jobspy", "twitter", "instagram", "facebook", "playwright", "all"],
        default="jobspy",
        help="Select which scraper spider to run (default: jobspy)"
    )
    parser.add_argument(
        "--limit", 
        type=int, 
        default=5, 
        help="Limit number of results per keyword/source (default: 5)"
    )
    parser.add_argument(
        "--keywords", 
        type=str, 
        help="Comma-separated search keywords for jobspy/playwright (e.g. 'backend,frontend')"
    )
    parser.add_argument(
        "--queries", 
        type=str, 
        help="Comma-separated search queries for Twitter (e.g. 'loker backend,lowongan frontend')"
    )
    parser.add_argument(
        "--hashtags", 
        type=str, 
        help="Comma-separated hashtags for Instagram (e.g. 'lokerjakarta,lowongankerja')"
    )
    parser.add_argument(
        "--sources", 
        type=str, 
        help="Comma-separated public page IDs/groups for Facebook"
    )

    args = parser.parse_args()

    scrapers_to_run = []
    if args.scraper == "all":
        scrapers_to_run = ["jobspy", "twitter", "instagram", "facebook", "playwright"]
    else:
        scrapers_to_run = [args.scraper]

    logger.info(f"Starting execution for scraper(s): {scrapers_to_run}")

    for scraper in scrapers_to_run:
        try:
            if scraper == "jobspy":
                run_jobspy_scraper(args)
            elif scraper == "twitter":
                run_twitter_scraper(args)
            elif scraper == "instagram":
                run_instagram_scraper(args)
            elif scraper == "facebook":
                run_facebook_scraper(args)
            elif scraper == "playwright":
                run_playwright_scraper(args)
        except Exception as e:
            logger.error(f"Scraper '{scraper}' failed during execution: {e}", exc_info=True)

    logger.info("=======================================")
    logger.info("All scrapers finished execution.")

if __name__ == "__main__":
    main()
