import os
import json
import logging
from datetime import datetime
import requests

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("ScraperDB")

def load_env():
    """Manually load environment variables from the root .env file if it exists."""
    # Check current directory, then parent directory, then grandparent directory (root of workspace)
    possible_paths = [".env", "../.env", "../../.env", "../../../.env"]
    for path in possible_paths:
        if os.path.exists(path):
            logger.info(f"Loading environment variables from {os.path.abspath(path)}")
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        try:
                            key, val = line.split("=", 1)
                            # Strip quotes
                            val = val.strip().strip('"').strip("'")
                            os.environ[key.strip()] = val
                        except Exception as e:
                            logger.warning(f"Failed to parse line in .env: {line}. Error: {e}")
            break

# Load environment variables on import
load_env()

def save_to_supabase(jobs):
    """
    Upsert job listings into Supabase using PostgREST API.
    jobs: List of dictionaries matching the scraped_jobs table schema.
    """
    supabase_url = os.environ.get("SUPABASE_URL")
    service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not service_role_key:
        logger.warning("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in environment. Skipping Supabase upload.")
        return False

    # Standardize URL
    supabase_url = supabase_url.rstrip("/")
    endpoint = f"{supabase_url}/rest/v1/scraped_jobs"

    headers = {
        "apikey": service_role_key,
        "Authorization": f"Bearer {service_role_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"  # Upsert behavior (requires unique constraint e.g. source_url)
    }

    try:
        # Supabase expects json array for batch insert/upsert
        response = requests.post(endpoint, json=jobs, headers=headers, timeout=15)
        if response.status_code in [200, 201]:
            logger.info(f"Successfully upserted {len(jobs)} jobs to Supabase.")
            return True
        else:
            logger.error(f"Failed to upsert jobs to Supabase. Status: {response.status_code}. Response: {response.text}")
            return False
    except Exception as e:
        logger.error(f"Error connecting to Supabase: {e}")
        return False

def save_to_json(jobs, platform):
    """
    Save job listings locally in a JSON file for local debugging.
    """
    os.makedirs("data", exist_ok=True)
    filename = f"data/scraped_jobs_{platform}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(jobs, f, indent=2, ensure_ascii=False)
        logger.info(f"Successfully saved {len(jobs)} jobs to local file: {filename}")
        return filename
    except Exception as e:
        logger.error(f"Failed to save jobs to local file: {e}")
        return None

import re

# Tech skills to match (imported/ported from TS skills.extractor.ts)
TECH_SKILLS = [
    'React', 'Next.js', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS',
    'Node.js', 'Express', 'NestJS', 'Python', 'Django', 'FastAPI', 'Go', 'PHP', 'Laravel',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Git',
    'REST API', 'GraphQL', 'ESP32', 'MQTT', 'Arduino', 'C/C++', 'Tableau', 'Power BI', 'Figma'
]

def extract_skills(raw_text):
    """
    Extracts matching tech skills from a raw text description.
    Handles boundaries gracefully for skills with special characters (e.g. C/C++, Next.js).
    """
    if not raw_text:
        return []
    matched = set()
    for skill in TECH_SKILLS:
        escaped_skill = re.escape(skill)
        # If the skill starts or ends with a non-alphanumeric char (e.g., C/C++ or Next.js),
        # standard \b word boundaries won't work, so check for whitespace or common punctuation surrounding it.
        if not skill[0].isalnum() or not skill[-1].isalnum():
            pattern = rf"(?:^|\s|[.,;:!/]){escaped_skill}(?:$|\s|[.,;:!/])"
        else:
            pattern = rf"\b{escaped_skill}\b"
        
        if re.search(pattern, raw_text, re.IGNORECASE):
            matched.add(skill)
    return list(matched)

def save_jobs(jobs, platform):
    """
    Primary interface for spiders to save jobs.
    Attempts to save to Supabase, and always saves a local backup JSON file.
    """
    if not jobs:
        logger.info(f"No jobs scraped for platform '{platform}'. Nothing to save.")
        return

    # Add scraped_at timestamp to each job if not already present
    now_str = datetime.utcnow().isoformat() + "Z"
    for job in jobs:
        if "scraped_at" not in job:
            job["scraped_at"] = now_str
        
        # Standardize required_skills as list
        if "required_skills" not in job or not job["required_skills"]:
            job["required_skills"] = extract_skills(job.get("raw_description", ""))
        elif isinstance(job["required_skills"], str):
            job["required_skills"] = [s.strip() for s in job["required_skills"].split(",") if s.strip()]

    # Save locally as backup / audit trail
    save_to_json(jobs, platform)

    # Save to Supabase
    save_to_supabase(jobs)
