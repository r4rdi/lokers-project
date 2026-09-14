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

// Resolved search params type for JobList component
interface JobListSearchParams {
  search?: string;
  location?: string;
  job_type?: string;
  salary?: string;
  page?: string;
}

// Separate server component for fetching to allow Suspense streaming
async function JobList({ searchParams }: { searchParams: JobListSearchParams }) {
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
      .order("is_featured", { ascending: false })
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
            : "Maaf, kami tidak dapat menemukan lowongan yang sesuai dengan filter Anda. Silakan coba kata kunci lain."}
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
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0 2a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 1000-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {paginatedJobs.map((job) => (
          <JobCard key={job.id} job={job} featured={job.is_featured} />
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
      <main className="min-h-screen bg-black pt-16 pb-12 overflow-clip relative">
        <div className="container-max relative z-10">
          <div className="mb-6">
            {/* Top Horizontal Filter Bar */}
            <TopJobFilterBar />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters - on mobile, show as accordion or full-width above results */}
            <aside className="w-full lg:w-1/4 lg:sticky lg:top-0">
              <JobFilters />
            </aside>

            {/* Main Content */}
            <div className="w-full lg:w-3/4 mt-4 lg:mt-0">
              <JobList searchParams={resolvedParams} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}