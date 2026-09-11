import os
import sys
import logging
import asyncio

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ScraperSetup")

def load_current_env():
    """Load current env values into a dict if the .env file exists."""
    env_data = {}
    # Look for .env at common locations
    possible_paths = [".env", "../.env", "../../.env", "../../../.env"]
    env_path = None
    
    for path in possible_paths:
        if os.path.exists(path):
            env_path = os.path.abspath(path)
            break
            
    if env_path and os.path.exists(env_path):
        logger.info(f"Reading existing configuration from: {env_path}")
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    try:
                        key, val = line.split("=", 1)
                        env_data[key.strip()] = val.strip().strip('"').strip("'")
                    except Exception:
                        pass
    else:
        # Resolve path to write to (should be root of workspace)
        # Assuming run from services/scraper/spiders or root
        if os.path.basename(os.getcwd()) == "spiders":
            env_path = os.path.abspath("../../.env")
        elif os.path.basename(os.getcwd()) == "scraper":
            env_path = os.path.abspath("../.env")
        else:
            env_path = os.path.abspath(".env")
            
    return env_data, env_path

def prompt_value(key, description, current_env):
    """Prompt the user for a value, showing the current value as default."""
    current_val = current_env.get(key, "")
    default_hint = f" [{current_val}]" if current_val else ""
    prompt_text = f"\n>> {description} (Env Variable: {key}){default_hint}:\n   > "
    
    val = input(prompt_text).strip()
    if not val:
        return current_val
    return val

async def main():
    print("=" * 60)
    print("      ONEAPPLY AI - SCRAPER ENGINE CONFIGURATION WIZARD")
    print("=" * 60)
    print("This script will help you configure the API keys and burner accounts")
    print("needed for the web scraping services (JobSpy, Twitter, Instagram).")
    print("Press [Enter] to keep the current value shown in brackets.")
    
    current_env, env_path = load_current_env()
    new_env = current_env.copy()

    # 1. Supabase Config
    print("\n--- 1. DATABASE & SUPABASE CONFIGURATION ---")
    new_env["SUPABASE_URL"] = prompt_value(
        "SUPABASE_URL", 
        "Enter Supabase Project URL (e.g. https://xyz.supabase.co)", 
        current_env
    )
    new_env["SUPABASE_SERVICE_ROLE_KEY"] = prompt_value(
        "SUPABASE_SERVICE_ROLE_KEY", 
        "Enter Supabase Service Role Key (service_role secret API key)", 
        current_env
    )

    # 2. Twitter Config
    print("\n--- 2. X / TWITTER BURNER ACCOUNT CONFIGURATION (twscrape) ---")
    new_env["TWITTER_USERNAME"] = prompt_value(
        "TWITTER_USERNAME", 
        "Enter Twitter Username (do NOT use your main account)", 
        current_env
    )
    new_env["TWITTER_PASSWORD"] = prompt_value(
        "TWITTER_PASSWORD", 
        "Enter Twitter Password", 
        current_env
    )
    new_env["TWITTER_EMAIL"] = prompt_value(
        "TWITTER_EMAIL", 
        "Enter Twitter Account Email", 
        current_env
    )
    new_env["TWITTER_2FA_SECRET"] = prompt_value(
        "TWITTER_2FA_SECRET", 
        "Enter Twitter 2FA TOTP Secret Key (optional, leave blank if none)", 
        current_env
    )

    # 3. Instagram Config
    print("\n--- 3. INSTAGRAM BURNER ACCOUNT CONFIGURATION (instagrapi) ---")
    new_env["INSTAGRAM_USERNAME"] = prompt_value(
        "INSTAGRAM_USERNAME", 
        "Enter Instagram Username (do NOT use your main account)", 
        current_env
    )
    new_env["INSTAGRAM_PASSWORD"] = prompt_value(
        "INSTAGRAM_PASSWORD", 
        "Enter Instagram Password", 
        current_env
    )

    # Write back to .env
    print(f"\nWriting configuration to {env_path}...")
    try:
        # Preserve comments or other variables by reading and replacing or rewriting
        existing_lines = []
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                existing_lines = f.readlines()
                
        written_keys = set()
        new_lines = []
        
        # Update existing lines
        for line in existing_lines:
            stripped = line.strip()
            if stripped and not stripped.startswith("#") and "=" in stripped:
                key, _ = stripped.split("=", 1)
                key = key.strip()
                if key in new_env:
                    new_lines.append(f'{key}="{new_env[key]}"\n')
                    written_keys.add(key)
                else:
                    new_lines.append(line)
            else:
                new_lines.append(line)
                
        # Append new keys
        for key, val in new_env.items():
            if key not in written_keys:
                # Add section headers if writing them for the first time
                if key == "SUPABASE_URL" and not any("SUPABASE" in l for l in existing_lines):
                    new_lines.append("\n# DATABASE / SUPABASE CONFIG\n")
                elif key == "TWITTER_USERNAME" and not any("TWITTER" in l for l in existing_lines):
                    new_lines.append("\n# X / TWITTER SCRAPER BURNER ACCOUNT\n")
                elif key == "INSTAGRAM_USERNAME" and not any("INSTAGRAM" in l for l in existing_lines):
                    new_lines.append("\n# INSTAGRAM SCRAPER BURNER ACCOUNT\n")
                new_lines.append(f'{key}="{val}"\n')
                
        # Write to file
        with open(env_path, "w", encoding="utf-8") as f:
            f.writelines(new_lines)
            
        print("Success! Environment variables written successfully.")
    except Exception as e:
        logger.error(f"Failed to write environment variables: {e}")
        sys.exit(1)

    # 4. Optional twscrape Initialization
    if new_env.get("TWITTER_USERNAME") and new_env.get("TWITTER_PASSWORD") and new_env.get("TWITTER_EMAIL"):
        init_twitter = input("\n>> Would you like to register/login the Twitter burner account inside twscrape right now? (y/n): ").strip().lower()
        if init_twitter == 'y':
            print("Initializing X/Twitter session...")
            try:
                # Temporarily set env variables in runtime
                for k, v in new_env.items():
                    os.environ[k] = v
                
                from twscrape import API, AccountsPool
                api = API()
                pool = AccountsPool()
                
                # Register account inside twscrape.db database
                await pool.add_account(
                    new_env["TWITTER_USERNAME"], 
                    new_env["TWITTER_PASSWORD"], 
                    new_env["TWITTER_EMAIL"], 
                    new_env.get("TWITTER_2FA_SECRET", "")
                )
                print(f"Account '{new_env['TWITTER_USERNAME']}' added to twscrape accounts database.")
                
                # Perform login
                print("Logging in to generate active session cookies...")
                await pool.login_all()
                print("Twitter burner account initialized successfully!")
            except Exception as tw_err:
                print(f"Failed to login Twitter account: {tw_err}. You can re-attempt later using the scrapers.")

    print("\n" + "=" * 60)
    print("Configuration finished successfully! You can now run the scrapers.")
    print("=" * 60)

if __name__ == "__main__":
    # Ensure event loop runs the async main
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nWizard cancelled.")
