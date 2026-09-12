import { exec } from "child_process";
import path from "path";
import { RawJobRecord, ScrapingAdapter, ScrapingInput } from "../types";

export const jobstreetAdapter: ScrapingAdapter = {
  source: "jobstreet",

  async fetchJobs(input: ScrapingInput): Promise<RawJobRecord[]> {
    const limit = input.limit || 5;
    
    console.log(`[Jobstreet Adapter] Fetching up to ${limit} jobs via Puppeteer Stealth...`);
    
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(process.cwd(), "scripts", "scraping", "puppeteer_scraper.js");
      exec(`node "${scriptPath}" jobstreet ${limit}`, { maxBuffer: 1024 * 1024 * 5 }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Failed to run Jobstreet Puppeteer:`, stderr || error.message);
          return reject(error);
        }
        
        try {
          const rawOutput = stdout.trim();
          if (!rawOutput) {
             return resolve([]);
          }
          // The script might output some browser logs, we find the last JSON array
          const jsonStart = rawOutput.indexOf("[");
          const jsonStr = rawOutput.slice(jsonStart);
          
          const jobsData = JSON.parse(jsonStr);
          
          // Map to standard format
          const mappedJobs: RawJobRecord[] = jobsData.map((job: any) => ({
            source: "jobstreet",
            sourceId: `jobstreet-${job.id}`,
            title: job.title,
            companyName: job.company,
            companyLogoUrl: job.company_logo || "",
            location: job.location,
            jobType: job.job_type,
            salary: job.salary,
            experience: job.experience,
            description: job.description,
            requirements: "",
            postedDate: job.date_posted,
            applyUrl: job.apply_url,
            raw: job
          }));
          
          resolve(mappedJobs);
        } catch (parseError) {
          console.error("Failed to parse Jobstreet Puppeteer output:", stdout);
          reject(parseError);
        }
      });
    });
  }
};
