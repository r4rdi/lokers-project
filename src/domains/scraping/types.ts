export type RawJobRecord = {
  source: string;
  sourceId?: string;
  title: string;
  companyName?: string;
  companyLogoUrl?: string;
  location?: string;
  jobType?: string; // e.g., 'full-time', 'part-time', 'contract', 'internship', 'remote'
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  description?: string;
  requirements?: string;
  postedDate?: string;
  applyUrl?: string;
  raw: unknown; // Store the original raw data just in case
};

export type ScrapingInput = {
  keyword?: string;
  location?: string;
  limit?: number;
};

export type ScrapingAdapter = {
  source: string;
  fetchJobs(input: ScrapingInput): Promise<RawJobRecord[]>;
};

export type ScrapingResult = {
  source: string;
  status: "success" | "failed" | "partial";
  jobsFound: number;
  jobsInserted: number;
  jobsUpdated: number;
  jobsSkipped: number;
  errorMessage?: string;
  startedAt: string;
  finishedAt: string;
};
