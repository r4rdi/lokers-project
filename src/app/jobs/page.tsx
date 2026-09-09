import { Suspense } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { type Job } from "@/types";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import { Briefcase } from "lucide-react";

// The search params available to this page
interface JobsPageProps {
  searchParams: Promise<{
    search?: string;
    location?: string;
    job_type?: string;
  }>;
}

// Separate server component for fetching to allow Suspense streaming
async function JobList({ searchParams }: { searchParams: any }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isMockEnv = !supabaseUrl || supabaseUrl.includes("placeholder");
  
  let jobs: Job[] = [];
  
  if (!isMockEnv) {
    const supabase = await createServerClient();
    
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
      // In a real app, use the `fts` column created in migration:
      // query = query.textSearch("fts", searchParams.search);
      // For simplicity in MVP if FTS isn't perfectly configured yet, we fall back to ilike
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedParams = await searchParams;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-28 pb-20">
        <div className="container-max">
          <div className="mb-8">
            <h1 className="text-h2 text-ink mb-2">Temukan Pekerjaan Impianmu</h1>
            <p className="text-body text-text-muted">
              Ribuan lowongan kerja terbaru dari perusahaan terkemuka, menantimu.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-1/4 lg:sticky lg:top-28">
              {/* Note: In a real app, JobFilters would update the URL search params via router.push */}
              <JobFilters onFilterChange={() => {}} />
            </aside>

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-sm font-semibold text-text">
                  Menampilkan Hasil Lowongan
                </p>
              </div>

              <Suspense 
                fallback={
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-surface rounded-xl border border-border h-64 animate-pulse" />
                    ))}
                  </div>
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
