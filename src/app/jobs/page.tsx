import { Suspense } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { type Job } from "@/types";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import TopJobFilterBar from "@/components/jobs/TopJobFilterBar";
import Pagination from "@/components/ui/Pagination";
import { Briefcase } from "lucide-react";

// The search params available to this page
interface JobsPageProps {
  searchParams: Promise<{
    search?: string;
    location?: string;
    job_type?: string;
    salary?: string;
    page?: string;
  }>;
}

// Separate server component for fetching to allow Suspense streaming
async function JobList({ searchParams }: { searchParams: any }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isMockEnv = !supabaseUrl || supabaseUrl.includes("placeholder");
  
  let jobs: Job[] = [];
  
  if (!isMockEnv) {
    // Use service role to bypass RLS recursion bug on public job listing
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Build query
    let query = supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .order("posted_date", { ascending: false });

    // Apply filters
    if (searchParams.job_type) {
      query = query.eq("job_type", searchParams.job_type);
    }
    
    if (searchParams.search || searchParams.location) {
      if (searchParams.search) {
        query = query.ilike("title", `%${searchParams.search}%`);
      }
      if (searchParams.location) {
        query = query.ilike("location", `%${searchParams.location}%`);
      }
    }

    const { data, error } = await query;
    if (!error && data) {
      jobs = data as Job[];
    }
  }

  // Apply Salary Filter
  if (searchParams.salary) {
    const minSalary = Number(searchParams.salary);
    jobs = jobs.filter(job => {
      if (job.salary_min !== null) {
        return job.salary_min >= minSalary;
      }
      if (job.salary_max !== null) {
        return job.salary_max >= minSalary;
      }
      return false;
    });
  }

  // Pagination Logic
  const totalJobs = jobs.length;
  const perPage = 21;
  const totalPages = Math.ceil(totalJobs / perPage);
  const currentPage = Number(searchParams.page) || 1;
  
  const startIndex = (currentPage - 1) * perPage;
  const paginatedJobs = jobs.slice(startIndex, startIndex + perPage);

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface border border-border rounded-xl text-center h-full min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-text-subtle" />
        </div>
        <h3 className="text-h3 text-ink mb-2">Belum ada lowongan</h3>
        <p className="text-body text-text-muted max-w-md">
          {isMockEnv 
            ? "Database Supabase belum terhubung. Konfigurasi .env.local terlebih dahulu."
            : "Maaf, kami tidak dapat menemukan lowongan yang sesuai dengan filter Anda. Silakan coba kata kunci lain atau jalankan API /api/jobs/sync untuk menarik data."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap justify-between items-end gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-medium text-white tracking-tight">Lowongan Rekomendasi</h2>
          <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium border border-white/10">
            {totalJobs}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <span>Urutkan:</span>
          <button className="flex items-center gap-1 font-medium text-white hover:text-blue-400">
            Terbaru 
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {paginatedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {totalPages > 1 && <Pagination totalPages={totalPages} />}
    </>
  );
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedParams = await searchParams;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-28 pb-20 overflow-clip relative">
        {/* N8N Inspired Background Gradients (Orange, Red, Blue) */}
        <div className="absolute top-[20%] left-0 right-0 h-[600px] bg-gradient-to-r from-orange-600/20 via-red-600/10 to-blue-600/20 blur-[120px] pointer-events-none opacity-60" />
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[70%] h-[400px] bg-orange-500/10 blur-[150px] pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-max relative z-10">
          <div className="mb-10">
            {/* Top Horizontal Filter Bar */}
            <Suspense fallback={<div className="h-16 w-full bg-white/5 border border-white/10 rounded-2xl animate-pulse" />}>
              <TopJobFilterBar />
            </Suspense>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-1/4 lg:sticky lg:top-28 transition-all duration-500 ease-in-out z-10">
              {/* Note: In a real app, JobFilters would update the URL search params via router.push */}
              <Suspense fallback={<div className="h-64 bg-white/5 border border-white/10 animate-pulse rounded-xl" />}>
                <JobFilters />
              </Suspense>
            </aside>

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              <Suspense 
                fallback={
                  <>
                    <div className="mb-6 flex flex-wrap justify-between items-end gap-4 border-b border-white/5 pb-4">
                      <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-medium text-white tracking-tight">Lowongan Rekomendasi</h2>
                        <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium border border-white/10 animate-pulse text-transparent">
                          000
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-[#0F0F11] rounded-xl border border-white/10 h-64 animate-pulse" />
                      ))}
                    </div>
                  </>
                }
              >
                <JobList searchParams={resolvedParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
