import { createServerClient } from "@/lib/supabase/server";
import { 
  FileText, 
  Sparkles, 
  Bookmark, 
  TrendingUp, 
  Plus
} from "lucide-react";
import Link from "next/link";

export default async function DashboardOverview() {
  const supabase = await createServerClient();
  
  // In a real scenario, we'd fetch counts from Supabase.
  // We'll mock it for the MVP layout if it fails.
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user?.id)
    .single();

  // Fetch actual counts
  const [{ count: cvCount }, { count: clCount }, { count: savedCount, error: savedError }] = await Promise.all([
    supabase.from("cvs").select("*", { count: "exact", head: true }).eq("user_id", user?.id),
    supabase.from("cover_letters").select("*", { count: "exact", head: true }).eq("user_id", user?.id),
    supabase.from("saved_jobs").select("*", { count: "exact", head: true }).eq("user_id", user?.id)
  ]);

  // Fetch recent cover letters for activity feed
  const { data: recentCoverLetters } = await supabase
    .from("cover_letters")
    .select(`
      id, 
      created_at,
      job:jobs ( company_name )
    `)
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch primary CV
  const { data: primaryCv } = await supabase
    .from("cvs")
    .select("name, updated_at")
    .eq("user_id", user?.id)
    .eq("is_primary", true)
    .single();

  const stats = [
    {
      label: "CV Tersimpan",
      value: (cvCount || 0).toString(),
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Cover Letter Dibuat",
      value: (clCount || 0).toString(),
      icon: Sparkles,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Lowongan Disimpan",
      value: savedError ? "0" : (savedCount || 0).toString(),
      icon: Bookmark,
      color: "text-teal-500",
      bgColor: "bg-teal-50",
    },
    {
      label: "Profile Views",
      value: "0", // Profile views usually require complex tracking, default 0 for MVP
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  // Helper for relative time (very basic fallback if date-fns is not imported on this page, but wait, we can just use simple string formatting)
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('id-ID')} ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h2 text-ink mb-2">
          Selamat datang, {profile?.full_name || "Pengguna"}!
        </h1>
        <p className="text-body text-text-muted">
          Berikut adalah ringkasan aktivitas pencarian kerja Anda.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface border border-border p-5 rounded-xl shadow-sm flex items-start gap-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-ink">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h3 text-ink">CV Anda</h2>
            <Link href="/dashboard/cv" className="text-sm text-primary font-medium hover:underline">
              Lihat Semua
            </Link>
          </div>
          
          <div className="space-y-4">
            {primaryCv ? (
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-surface-muted">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-text-subtle" />
                  <div>
                    <p className="font-semibold text-text">{primaryCv.name}</p>
                    <p className="text-xs text-text-muted">
                      Diperbarui {new Date(primaryCv.updated_at || new Date()).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-success/10 text-success text-xs font-bold rounded-md">Utama</span>
              </div>
            ) : (
              <div className="p-4 border border-dashed border-border rounded-lg bg-surface-muted text-center">
                <p className="text-sm text-text-muted mb-2">Belum ada CV utama</p>
              </div>
            )}
            
            <Link 
              href="/dashboard/cv/create"
              className="flex items-center justify-center gap-2 p-4 border border-dashed border-border rounded-lg text-text-muted hover:border-primary hover:text-primary hover:bg-primary-soft transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Buat CV Baru dengan AI</span>
            </Link>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h3 text-ink">Aktivitas Terakhir</h2>
          </div>
          
          <div className="space-y-6">
            {recentCoverLetters && recentCoverLetters.length > 0 ? (
              recentCoverLetters.map((activity, i) => (
                <div key={activity.id} className="flex gap-4 relative">
                  {i !== recentCoverLetters.length - 1 && (
                    <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-border -z-10" />
                  )}
                  <div className="w-6 h-6 rounded-full bg-primary-soft flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">
                      Cover Letter dibuat untuk <span className="text-primary">{activity.job?.company_name || "Perusahaan"}</span>
                    </p>
                    <p className="text-xs text-text-muted mt-1">{formatDate(activity.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-muted italic text-center py-4">Belum ada aktivitas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
