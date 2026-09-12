import { createClient } from "@supabase/supabase-js";
import { RawJobRecord, ScrapingResult } from "../types";
import { normalizeJob } from "../normalizers/job.normalizer";

// We require service role key for ingestion to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function ingestJobs(source: string, rawJobs: RawJobRecord[]): Promise<ScrapingResult> {
  const startedAt = new Date().toISOString();
  let jobsInserted = 0;
  let jobsSkipped = 0;
  let errorMessage = undefined;
  let status: "success" | "failed" | "partial" = "success";

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase Service Key or URL for ingestion.");
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  if (rawJobs.length === 0) {
    return {
      source,
      status: "success",
      jobsFound: 0,
      jobsInserted: 0,
      jobsUpdated: 0,
      jobsSkipped: 0,
      startedAt,
      finishedAt: new Date().toISOString(),
    };
  }

  try {
    // 1. Normalize
    const normalizedJobs = rawJobs.map(normalizeJob);
    
    // 2. We will insert row by row or in chunks to avoid single-row failures rejecting the whole batch
    const allowedSources = ['linkedin', 'indeed', 'glints', 'jobstreet', 'manual', 'employer'];
    
    for (const job of normalizedJobs) {
      // Map unsupported sources to 'manual' to bypass Supabase job_source ENUM constraints
      const dbSource = allowedSources.includes(job.source) ? job.source : 'manual';
      const jobToInsert = { ...job, source: dbSource };
      
      const { error } = await supabase
        .from("jobs")
        .upsert(jobToInsert, { 
          onConflict: "source,source_id", 
          ignoreDuplicates: false // Changed to false to allow updating old dummy data with the new accurately scraped metadata
        });

      if (error) {
        console.error(`[Ingestion] Failed to upsert job ${job.source_id}:`, error.message);
        jobsSkipped++;
        status = "partial";
      } else {
        // Technically, Supabase doesn't return count if ignoreDuplicates is true, but we count it as processed
        jobsInserted++; 
      }
    }
  } catch (err: any) {
    console.error(`[Ingestion] Critical failure for ${source}:`, err);
    status = "failed";
    errorMessage = err.message;
  }

  const finishedAt = new Date().toISOString();

  // 3. Log to scraping_logs table
  await supabase.from("scraping_logs").insert({
    source,
    status,
    jobs_found: rawJobs.length,
    error_message: errorMessage,
    started_at: startedAt,
    finished_at: finishedAt,
  });

  return {
    source,
    status,
    jobsFound: rawJobs.length,
    jobsInserted,
    jobsUpdated: 0,
    jobsSkipped,
    errorMessage,
    startedAt,
    finishedAt,
  };
}
