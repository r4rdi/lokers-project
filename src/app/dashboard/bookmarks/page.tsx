import { createServerClient } from "@/lib/supabase/server";
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { formatSalary } from "@/lib/utils"; // I'll create this util or inline it

const formatSalaryText = (min: number | null, max: number | null, currency: string) => {
  if (!min && !max) return "Gaji tidak ditampilkan";
  const formatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: currency || "IDR", maximumFractionDigits: 0 });
  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
  if (min) return `Mulai dari ${formatter.format(min)}`;
  if (max) return `Hingga ${formatter.format(max)}`;
  return "Gaji dirahasiakan";
};

export default async function BookmarksPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isMockEnv = !supabaseUrl || supabaseUrl.includes("placeholder");
  
  interface BookmarkData {
  id: string;
  created_at: string;
  jobs: {
    id: string;
    title: string;
    company_name: string;
    location: string;
    job_type: string;
    salary_min: number;
    salary_max: number;
    salary_currency: string;
    posted_date: string;
  } | null;
}

let bookmarks: BookmarkData[] = [];
  
  if (!isMockEnv) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from("bookmarks")
        .select("id, created_at, jobs(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      bookmarks = data || [];
    }
  }

  // Mock data if empty for layout presentation
  if (bookmarks.length === 0 && isMockEnv) {
    bookmarks = [mockBookmark];
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h2 text-ink mb-2">Lowongan Tersimpan</h1>
        <p className="text-body text-text-muted">
          Daftar lowongan kerja yang Anda bookmark untuk dilamar nanti.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-surface border border-dashed border-border rounded-xl text-center min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mb-4">
            <Bookmark className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-h3 text-ink mb-2">Belum ada Bookmark</h3>
          <p className="text-body text-text-muted max-w-sm mb-6">
            Anda belum menyimpan lowongan apa pun. Jelajahi lowongan pekerjaan sekarang.
          </p>
          <Link 
            href="/jobs"
            className="flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle"
          >
            Cari Lowongan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookmarks.map((bookmark) => {
            const job = bookmark.jobs;
            if (!job) return null;
            
            return (
              <div key={bookmark.id} className="bg-surface border border-border rounded-xl p-5 flex flex-col h-full transition-all hover:shadow-card group">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div>
                    <Link href={`/jobs/${job.id}`} className="block group-hover:text-primary transition-colors">
                      <h3 className="text-lg font-bold text-ink line-clamp-1">{job.title}</h3>
                    </Link>
                    <p className="text-sm text-text-muted mt-1">{job.company_name}</p>
                  </div>
                  
                  {/* Real app would use a client component for unfavoriting */}
                  <button className="text-text-subtle hover:text-error transition-colors p-2 -mr-2" title="Hapus Bookmark">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-muted text-xs font-medium text-text-muted">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-muted text-xs font-medium text-text-muted capitalize">
                    <Briefcase className="w-3 h-3" />
                    {job.job_type?.replace('-', ' ')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-muted text-xs font-medium text-text-muted">
                    <DollarSign className="w-3 h-3" />
                    {formatSalaryText(job.salary_min, job.salary_max, job.salary_currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-text-subtle">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Disimpan {formatDistanceToNow(new Date(bookmark.created_at), { addSuffix: true, locale: localeId })}
                    </span>
                  </div>
                  
                  <Link 
                    href={`/jobs/${job.id}`}
                    className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
                  >
                    Lihat Detail <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
