import { NextResponse } from "next/server";

import { runScraping } from "@/domains/scraping/services/orchestrator.service";

export async function GET(req: Request) {
  void req;
  try {
    // For MVP, we'll allow anyone to hit this endpoint to sync jobs.
    // In production, you would add an authorization header check (e.g. cron secret).

    console.log("Starting Scraping Orchestrator...");

    // We can define which sources to run here.
    const results = await runScraping(["jobicy", "remotive", "glints", "jobstreet", "linkedin", "dealls"], 20);

    // Calculate totals for response
    const totalFound = results.reduce((sum, res) => sum + res.jobsFound, 0);
    // Add jobsInserted from orchestrator AND route fallback
    const totalInsertedAll = results.reduce((sum, res) => sum + res.jobsInserted, 0);

    return NextResponse.json({
      success: true,
      message: `Scraping completed. Found ${totalFound} jobs, inserted ${totalInsertedAll} new jobs.`,
      details: results
    });

  } catch (error) {
    console.error("Job sync error:", error);
    const message = error instanceof Error ? error.message : "Job sync error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
