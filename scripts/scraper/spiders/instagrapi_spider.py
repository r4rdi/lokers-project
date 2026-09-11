import os
import logging
from instagrapi import Client
from db_utils import save_jobs

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("InstagramSpider")

def get_instagram_client():
    """
    Instantiate instagrapi Client, loading settings from local JSON if available
    to prevent repetitive logins and block challenges.
    """
    username = os.environ.get("INSTAGRAM_USERNAME")
    password = os.environ.get("INSTAGRAM_PASSWORD")

    if not username or not password:
        logger.warning(
            "INSTAGRAM_USERNAME or INSTAGRAM_PASSWORD missing in environment. "
            "Please configure burner credentials in .env to use Instagram scraping. "
            "Skipping instagrapi client creation."
        )
        return None

    cl = Client()
    session_file = "instagram_session.json"

    try:
        if os.path.exists(session_file):
            logger.info("Loading cached Instagram session settings...")
            cl.load_settings(session_file)
            cl.login(username, password)
            logger.info("Instagram login successful using cached session settings.")
        else:
            logger.info("Logging in to Instagram with credentials...")
            cl.login(username, password)
            cl.dump_settings(session_file)
            logger.info("Instagram login successful. Cached session settings saved.")
        return cl
    except Exception as e:
        logger.error(f"Failed to log in to Instagram: {e}", exc_info=True)
        # If cached session was corrupt, try clearing it and logging in again
        if os.path.exists(session_file):
            try:
                os.remove(session_file)
                logger.info("Corrupted session file removed. Attempting fresh login...")
                cl = Client()
                cl.login(username, password)
                cl.dump_settings(session_file)
                return cl
            except Exception as re_err:
                logger.error(f"Fresh Instagram login attempt also failed: {re_err}")
        return None

def run_instagrapi(hashtags=None, amount_per_hashtag=5):
    """
    Search and scrape Instagram posts using hashtags related to jobs/loker.
    """
    if hashtags is None:
        hashtags = ["lokerjakarta", "lowongankerja", "lokersurabaya"]

    cl = get_instagram_client()
    if not cl:
        logger.warning("No active Instagram client session. Aborting Instagram scraper.")
        return []

    all_jobs = []

    logger.info(f"Starting Instagram scraping for hashtags: {hashtags}")

    for tag in hashtags:
        logger.info(f"Fetching posts for hashtag #{tag}...")
        try:
            # Fetch recent media for the hashtag
            medias = cl.hashtag_medias_recent(tag, amount=amount_per_hashtag)
            logger.info(f"Retrieved {len(medias)} posts for #{tag}.")

            for media in medias:
                # Format post URL
                post_url = f"https://www.instagram.com/p/{media.code}/"

                # Standardize captions
                caption = media.caption_text or ""
                if not caption.strip():
                    continue

                # Extract first line for title
                caption_lines = [line.strip() for line in caption.split("\n") if line.strip()]
                title = caption_lines[0] if caption_lines else "Lowongan Kerja Instagram"
                if len(title) > 60:
                    title = title[:57] + "..."

                # Extract username of publisher
                owner_username = media.user.username if media.user else "Instagram Recruiter"

                job_data = {
                    "source_platform": "Instagram",
                    "source_url": post_url,
                    "company_name": f"Publisher: @{owner_username}",
                    "job_title": f"[Instagram] {title}",
                    "location": "Indonesia",  # Usually local, but requires text parsing for detail
                    "salary_range": "TBD",
                    "raw_description": caption
                }

                # Deduplicate
                if not any(j["source_url"] == job_data["source_url"] for j in all_jobs):
                    all_jobs.append(job_data)

        except Exception as e:
            logger.error(f"Error scraping hashtag #{tag} from Instagram: {e}", exc_info=True)

    logger.info(f"Scraped a total of {len(all_jobs)} unique Instagram job postings.")
    
    # Save the scraped jobs using database utility
    save_jobs(all_jobs, "instagram")
    return all_jobs

if __name__ == "__main__":
    run_instagrapi()
