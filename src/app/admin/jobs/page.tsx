import { createServerClient } from "@/lib/supabase/server";
import { Plus, Search, MoreVertical, Database } from "lucide-react";
import { Job } from "@/types";

export default async function AdminJobsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isMockEnv = !supabaseUrl || supabaseUrl.includes("placeholder");

  let jobs: Job[] = [];
  
  if (!isMockEnv) {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from("jobs")
      .select("id, title, company_name, source, is_active, posted_date")
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
        posted_date: now.toISOString(),
        formattedPostDate: now.toLocaleDateString('id-ID')
      },
      {
        id: "2",
        title: "Product Designer",
        company_name: "Creative Studio",
        source: "manual",
        is_active: false,
        posted_date: yesterday.toISOString(),
        formattedPostDate: yesterday.toLocaleDateString('id-ID')
      },
    ];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Manajemen Lowongan</h1>
          <p className="text-white/60">
            Kelola data lowongan dari scraper dan input manual.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-md transition-colors whitespace-nowrap">
          <Plus className="w-5 h-5" /> Tambah Lowongan
        </button>
      </div>

      <div className="bg-ink border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Cari lowongan..."
              className="w-full pl-9 pr-4 py-2 rounded-md border border-white/10 bg-black/20 text-sm text-white focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-black/20 text-xs uppercase text-white/60">
              <tr>
                <th className="px-6 py-4">Posisi & Perusahaan</th>
                <th className="px-6 py-4">Sumber</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal Posting</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    <Database className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    Belum ada data lowongan. Jalankan script seed.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{job.title}</p>
                      <p className="text-xs text-white/50">{job.company_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/10 rounded-md text-xs font-semibold capitalize">
                        {job.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {job.is_active ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs font-semibold">Aktif</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-md text-xs font-semibold">Inaktif</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {job.formattedPostDate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
