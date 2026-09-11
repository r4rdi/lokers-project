import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Briefcase, PlusCircle, Pencil, Trash2, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export const metadata = {
  title: "Kelola Lowongan - Employer Dashboard",
};

export default async function EmployerJobsPage() {
  const supabase = await createServerClient();
  
  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch jobs created by this employer
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('created_by', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight mb-1">
            Kelola Lowongan
          </h1>
          <p className="text-text-muted">
            Daftar semua lowongan kerja yang Anda publikasikan.
          </p>
        </div>
        <Link 
          href="/employer/jobs/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-warning text-black font-bold rounded-full hover:bg-warning/90 transition-all shadow-subtle shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          Pasang Lowongan
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-error">
            Gagal memuat data lowongan. Silakan coba lagi.
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">Belum ada lowongan</h3>
            <p className="text-text-muted mb-6 max-w-md">
              Anda belum memasang lowongan pekerjaan apa pun. Mulai publikasikan lowongan pertama Anda sekarang.
            </p>
            <Link 
              href="/employer/jobs/new"
              className="px-6 py-2 bg-primary text-on-primary font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Pasang Lowongan Pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-muted border-b border-border text-text-subtle text-sm">
                  <th className="py-4 px-6 font-medium">Posisi & Perusahaan</th>
                  <th className="py-4 px-6 font-medium">Tipe & Lokasi</th>
                  <th className="py-4 px-6 font-medium">Tanggal Dibuat</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 px-6 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-surface-muted/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-bold text-ink">{job.title}</div>
                      <div className="text-sm text-text-muted">{job.company_name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-ink capitalize">{job.job_type?.replace('-', ' ')}</div>
                      <div className="text-sm text-text-muted">{job.location}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-ink">
                        {new Date(job.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-text-muted">
                        {formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: id })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {job.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-muted text-text-muted border border-border">
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/jobs/${job.id}`}
                          target="_blank"
                          title="Lihat Lowongan"
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/employer/jobs/${job.id}/edit`}
                          title="Edit"
                          className="p-2 text-text-muted hover:text-warning hover:bg-warning/10 rounded-md transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        {/* Note: In a real app, delete should be a button with confirmation modal */}
                        <button 
                          title="Hapus"
                          className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
