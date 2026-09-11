import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { runScraping } from "@/domains/scraping/services/orchestrator.service";

export async function GET(req: Request) {
  try {
    // For MVP, we'll allow anyone to hit this endpoint to sync jobs.
    // In production, you would add an authorization header check (e.g. cron secret).
    
    console.log("Starting Scraping Orchestrator...");
    
    // We can define which sources to run here.
    const results = await runScraping(["jobicy", "remotive", "glints", "jobstreet", "linkedin", "dealls"], 20);

    let totalInserted = 0;
    let totalUpdated = 0;
    
    const allowedSources = ['linkedin', 'indeed', 'glints', 'jobstreet', 'manual', 'employer'];

    for (const result of results) {
      if (result.status === "failed" || !result.jobs || result.jobs.length === 0) {
        continue;
      }

      const validJobs = result.jobs.map(job => {
          // Map unsupported sources to 'manual' so the DB doesn't reject them
          // The UI will determine the real source using sourceId (e.g. dealls-123)
          const dbSource = allowedSources.includes(job.source) ? job.source : 'manual';
          
          return {
            source: dbSource,
            source_id: job.sourceId,
            title: job.title,
            company_name: job.companyName,
            company_logo_url: job.companyLogoUrl || null,
            location: job.location || null,
            job_type: job.jobType || null,
            salary_min: job.salaryMin || null,
            salary_max: job.salaryMax || null,
            salary_currency: job.salaryCurrency || null,
            description: job.description || null,
            requirements: job.requirements || null,
            posted_date: job.postedDate || new Date().toISOString(),
            apply_url: job.applyUrl || null,
            raw_data: job.raw || {},
            is_active: true
          };
      });
      
      if (validJobs.length > 0) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { error, count } = await supabase
          .from("jobs")
          .upsert(validJobs, {
            onConflict: "source, source_id",
            ignoreDuplicates: false
          });

        if (error) {
          console.error(`Error inserting batch for ${result.source}:`, error);
        } else {
          totalInserted += validJobs.length; // Approximate
        }
      }
    }

    // Calculate totals for response
    const totalFound = results.reduce((sum, res) => sum + res.jobsFound, 0);
    // Add jobsInserted from orchestrator AND route fallback
    const totalInsertedAll = totalInserted + results.reduce((sum, res) => sum + res.jobsInserted, 0);

    return NextResponse.json({
      success: true,
      message: `Scraping completed. Found ${totalFound} jobs, inserted ${totalInsertedAll} new jobs.`,
      details: results
    });

  } catch (error: any) {
    console.error("Job sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
