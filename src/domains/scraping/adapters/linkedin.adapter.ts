import { exec } from "child_process";
import path from "path";
import { RawJobRecord, ScrapingAdapter, ScrapingInput } from "../types";

export const linkedinAdapter: ScrapingAdapter = {
  source: "linkedin",

  async fetchJobs(input: ScrapingInput): Promise<RawJobRecord[]> {
    const limit = input.limit || 10;
    
    console.log(`[LinkedIn Adapter] Fetching up to ${limit} jobs via Python JobSpy...`);
    
    // Determine path to the python script
    const scriptPath = path.join(process.cwd(), "scripts", "scraping", "jobspy", "linkedin.py");
    
    return new Promise((resolve, reject) => {
      // Execute the python script. 
      // Note: In production, python must be installed on the worker running this code.
      exec(`python "${scriptPath}" ${limit}`, { maxBuffer: 1024 * 1024 * 10 }, (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.error(`[LinkedIn Adapter] Python execution error:`, error.message);
          console.error(`[LinkedIn Adapter] stderr:`, stderr);
          return reject(new Error(`Failed to run LinkedIn JobSpy: ${error.message}`));
        }
        
        try {
          const rawJobs = JSON.parse(stdout);
          
          if (!Array.isArray(rawJobs)) {
            throw new Error("Python script did not return an array.");
          }

          interface JobSpyOutput {
    id?: string | number;
    job_url?: string;
    title: string;
    company: string;
    company_logo?: string;
    location?: string;
    job_type?: string;
    description?: string;
    date_posted?: string;
  }
          const jobs: RawJobRecord[] = rawJobs.map((job: JobSpyOutput) => ({
            source: "linkedin",
            sourceId: `linkedin-${job.id || job.job_url?.split('view/')[1]?.split('/')[0] || Math.random().toString(36).substring(7)}`,
            title: job.title,
            companyName: job.company,
            companyLogoUrl: job.company_logo,
            location: job.location || "Indonesia",
            jobType: job.job_type, // JobSpy returns full-time, contract, etc.
            description: job.description,
            requirements: "",
            postedDate: job.date_posted,
            applyUrl: job.job_url,
            raw: job,
          }));

          resolve(jobs);
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Unknown error";
          console.error(`[LinkedIn Adapter] Failed to parse Python output:`, message);
          console.error(`[LinkedIn Adapter] Raw stdout:`, stdout.substring(0, 500) + "...");
          reject(new Error("Failed to parse LinkedIn JobSpy output"));
        }
      });
    });
  }
};
