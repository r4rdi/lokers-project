import { RawJobRecord, ScrapingAdapter, ScrapingInput } from "../types";

export const jobicyAdapter: ScrapingAdapter = {
  source: "jobicy",

  async fetchJobs(input: ScrapingInput): Promise<RawJobRecord[]> {
    const limit = input.limit || 50;
    
    console.log(`[Jobicy Adapter] Fetching up to ${limit} jobs...`);
    const res = await fetch(`https://jobicy.com/api/v2/remote-jobs?count=${limit}&industry=engineering`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error(`Jobicy API returned status ${res.status}`);
    }

    const data = await res.json();

    // Define the shape of a job object from Jobicy API
    interface JobicyJob {
      id: string | number;
      jobTitle: string;
      companyName: string;
      companyLogo?: string;
      jobGeo?: string;
      jobDescription: string;
      pubDate: string;
      url: string;
    }

    const jobs: JobicyJob[] = data.jobs || [];

    return jobs.map((job) => ({
      source: "jobicy",
      sourceId: `jobicy-${job.id}`,
      title: job.jobTitle,
      companyName: job.companyName,
      companyLogoUrl: job.companyLogo,
      location: job.jobGeo || "Remote",
      jobType: "remote",
      salaryCurrency: "USD",
      description: job.jobDescription,
      requirements: "",
      postedDate: job.pubDate,
      applyUrl: job.url,
      raw: job,
    }));
  }
};
