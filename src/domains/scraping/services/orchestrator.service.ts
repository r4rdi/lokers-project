import { ScrapingAdapter, ScrapingInput, ScrapingResult } from "../types";
import { ingestJobs } from "./ingestion.service";
import { glintsAdapter } from "../adapters/glints.adapter";
import { remotiveAdapter } from "../adapters/remotive.adapter";
import { jobicyAdapter } from "../adapters/jobicy.adapter";
import { jobstreetAdapter } from "../adapters/jobstreet.adapter";
import { linkedinAdapter } from "../adapters/linkedin.adapter";
import { deallsAdapter } from "../adapters/dealls.adapter";

// Register all available adapters
const registry: Record<string, ScrapingAdapter> = {
  glints: glintsAdapter,
  remotive: remotiveAdapter,
  jobicy: jobicyAdapter,
  jobstreet: jobstreetAdapter,
  linkedin: linkedinAdapter,
  dealls: deallsAdapter,
};

export async function runScraping(sources: string[] = ["jobicy", "glints"], limit = 20): Promise<ScrapingResult[]> {
  const results: ScrapingResult[] = [];

  for (const source of sources) {
    const adapter = registry[source];
    if (!adapter) {
      console.warn(`[Orchestrator] Adapter for '${source}' not found. Skipping.`);
      continue;
    }

    try {
      console.log(`[Orchestrator] Starting scraping for: ${source}`);
      
      // 1. Fetch raw data via adapter
      const rawJobs = await adapter.fetchJobs({ limit });
      
      // 2. Normalize and ingest to Supabase
      const result = await ingestJobs(source, rawJobs);
      results.push(result);
      
      console.log(`[Orchestrator] Finished ${source}: ${result.status} (${result.jobsInserted} inserted, ${result.jobsSkipped} skipped)`);
      
    } catch (error: any) {
      console.error(`[Orchestrator] Fatal error running ${source}:`, error);
      
      // We log total failure as a result too
      results.push({
        source,
        status: "failed",
        jobsFound: 0,
        jobsInserted: 0,
        jobsUpdated: 0,
        jobsSkipped: 0,
        errorMessage: error.message,
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString()
      });
    }
  }

  return results;
}
