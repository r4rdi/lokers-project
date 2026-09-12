import { createServerClient } from "@/lib/supabase/server";
import { Plus, Search, MoreVertical, Database } from "lucide-react";
import { Job } from "@/types";
import AdminJobsClient from "./AdminJobsClient";

export default async function AdminJobsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isMockEnv = !supabaseUrl || supabaseUrl.includes("placeholder");

  let jobs: any[] = [];
  
  if (!isMockEnv) {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("posted_date", { ascending: false })
      .limit(20); // Just fetch 20 for MVP table

    // Process data to avoid calling Date() in render
    jobs = (data || []).map(job => ({
      ...job,
      formattedPostDate: new Date(job.posted_date).toLocaleDateString('id-ID')
    }));
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
        is_active: true,
        is_featured: true,
        posted_date: now.toISOString(),
        formattedPostDate: now.toLocaleDateString('id-ID')
      } as any,
      {
        id: "2",
        title: "Product Designer",
        company_name: "Creative Studio",
        source: "manual",
        is_active: false,
        is_featured: false,
        posted_date: yesterday.toISOString(),
        formattedPostDate: yesterday.toLocaleDateString('id-ID')
      } as any,
    ];
  }

  return <AdminJobsClient initialJobs={jobs as any} />;
}
