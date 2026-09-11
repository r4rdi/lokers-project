import sys
import json
from jobspy import scrape_jobs

def main():
    try:
        # We can parse arguments here, but for MVP we will hardcode the defaults
        limit_arg = 10
        if len(sys.argv) > 1:
            try:
                limit_arg = int(sys.argv[1])
            except ValueError:
                pass
                
        # jobspy returns a pandas DataFrame
        jobs = scrape_jobs(
            site_name=["linkedin"],
            search_term="software engineer",
            location="Indonesia",
            results_wanted=limit_arg,
            country_linkedin="id",
            linkedin_fetch_description=True,
            hours_old=72, 
        )
        
        # Output directly to stdout as JSON
        # Convert everything to string to avoid date serialization errors, and replace NaN
        jobs_json = jobs.astype(str).replace("nan", "").to_dict(orient="records")
        print(json.dumps(jobs_json))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
