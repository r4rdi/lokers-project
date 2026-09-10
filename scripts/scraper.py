import os
import sys
import argparse
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client
from jobspy import scrape_jobs

# Load environment variables
# Look for .env.local first, then .env
dotenv_path = os.path.join(os.path.dirname(__dirname), '.env.local')
if not os.path.exists(dotenv_path):
    dotenv_path = os.path.join(os.path.dirname(__dirname), '.env')

load_dotenv(dotenv_path)

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase credentials in environment variables.")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def init_scraping_log(source: str):
    """Initialize a scraping log entry."""
    response = supabase.table("scraping_logs").insert({
        "source": source,
        "status": "partial", # starting state
        "jobs_found": 0,
        "started_at": datetime.now().isoformat()
    }).execute()
    return response.data[0]['id']

def update_scraping_log(log_id: str, status: str, jobs_found: int, error_message: str = None):
    """Update scraping log with final status."""
    data = {
        "status": status,
        "jobs_found": jobs_found,
        "finished_at": datetime.now().isoformat()
    }
    if error_message:
        data["error_message"] = error_message
        
    supabase.table("scraping_logs").update(data).eq("id", log_id).execute()

def scrape(source_site: str, search_term: str = "software engineer", location: str = "Indonesia", results_wanted: int = 10):
    print(f"Starting scraping for {source_site}...")
    log_id = init_scraping_log(source_site)
    
    try:
        jobs = scrape_jobs(
            site_name=[source_site],
            search_term=search_term,
            location=location,
            results_wanted=results_wanted,
            country_circa='indonesia' 
        )
        
        jobs_found = len(jobs) if jobs is not None else 0
        print(f"Found {jobs_found} jobs.")
        
        if jobs_found > 0:
            inserted_count = 0
            # Process jobs and insert into Supabase
            # jobspy returns a pandas DataFrame
            for index, row in jobs.iterrows():
                # Map to schema
                # job_source enum: ('linkedin', 'indeed', 'glints', 'jobstreet', 'manual', 'employer')
                # job_type enum: ('full-time', 'part-time', 'contract', 'internship', 'remote')
                
                db_source = source_site.lower()
                if db_source not in ['linkedin', 'indeed', 'glints', 'jobstreet']:
                    db_source = 'manual'
                    
                # Determine job_type safely
                j_type_raw = str(row.get('job_type', '')).lower()
                db_type = 'full-time'
                if 'part' in j_type_raw: db_type = 'part-time'
                elif 'contract' in j_type_raw: db_type = 'contract'
                elif 'intern' in j_type_raw: db_type = 'internship'
                elif 'remote' in str(row.get('location', '')).lower() or 'remote' in str(row.get('is_remote', '')).lower(): 
                    db_type = 'remote'
                
                # Check for existing
                source_id = str(row.get('id', ''))
                if not source_id or source_id == 'nan':
                    continue
                    
                job_data = {
                    "source": db_source,
                    "source_id": source_id,
                    "title": str(row.get('title', 'Unknown Title'))[:255],
                    "company_name": str(row.get('company', 'Unknown Company'))[:255],
                    "company_logo_url": str(row.get('company_logo', ''))[:1000] if str(row.get('company_logo', '')) != 'nan' else None,
                    "location": str(row.get('location', location))[:255],
                    "job_type": db_type,
                    "description": str(row.get('description', ''))[:10000], 
                    "apply_url": str(row.get('job_url', ''))[:1000] if str(row.get('job_url', '')) != 'nan' else None,
                    "is_active": True
                }
                
                # Handle dates safely
                try:
                    date_posted = row.get('date_posted')
                    if date_posted and str(date_posted) != 'nan':
                        job_data['posted_date'] = str(date_posted)
                except Exception:
                    pass
                
                try:
                    # Insert ignoring conflicts
                    response = supabase.table('jobs').insert(job_data).execute()
                    inserted_count += 1
                except Exception as e:
                    # Usually means duplicate violation
                    pass
            
            print(f"Successfully inserted/processed {inserted_count} jobs.")
            update_scraping_log(log_id, "success", inserted_count)
        else:
            update_scraping_log(log_id, "success", 0, "No jobs returned.")
            
    except Exception as e:
        print(f"Error during scraping: {str(e)}")
        update_scraping_log(log_id, "failed", 0, str(e))
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Job scraper for Lokers")
    parser.add_argument("--site", type=str, default="linkedin", choices=["linkedin", "indeed", "glassdoor"], help="Target job site")
    parser.add_argument("--search", type=str, default="software engineer", help="Search term")
    parser.add_argument("--location", type=str, default="Indonesia", help="Location")
    parser.add_argument("--limit", type=int, default=10, help="Results wanted")
    
    args = parser.parse_args()
    
    scrape(source_site=args.site, search_term=args.search, location=args.location, results_wanted=args.limit)
