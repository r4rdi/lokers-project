import { createServerClient } from "@/lib/supabase/server";
import { Plus, Search, MoreVertical, Database } from "lucide-react";
import { Job } from "@/types";
import AdminJobsClient from "./AdminJobsClient";

export default async function AdminJobsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isMockEnv = !supabaseUrl || supabaseUrl.includes("placeholder");

  let jobs: Job[] = [];
  if (!isMockEnv) {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("posted_date", { ascending: false })
      .limit(20); // Just fetch 20 for MVP table

    jobs = data || [];
  }

  // Mock data
  if (jobs.length === 0 && isMockEnv) {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000); // 24 hours ago

    jobs = [
      {
        id: "1",
        title: "Frontend Engineer",
        company_name: "Tech Corp",
        source: "linkedin",
        source_id: "1",
        company_logo_url: null,
        location: "Indonesia",
        job_type: "full-time",
        salary_min: 5000000,
        salary_max: 8000000,
        salary_currency: "IDR",
        description: "We are looking for a Frontend Engineer...",
        requirements: "Experience with React...",
        posted_date: now.toISOString(),
        apply_url: null,
        is_active: true,
        is_featured: true,
        created_by: null,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      } as any,
      {
        id: "2",
        title: "Product Designer",
        company_name: "Creative Studio",
        source: "manual",
        source_id: "2",
        company_logo_url: null,
        location: "Remote",
        job_type: "full-time",
        salary_min: 6000000,
        salary_max: 9000000,
        salary_currency: "IDR",
        description: "We are looking for a Product Designer...",
        requirements: "Experience with Figma...",
        posted_date: yesterday.toISOString(),
        apply_url: null,
        is_active: false,
        is_featured: false,
        created_by: null,
        created_at: yesterday.toISOString(),
        updated_at: yesterday.toISOString(),
      } as any,
    ];
  }

  return <AdminJobsClient initialJobs={jobs as any} />;
}
