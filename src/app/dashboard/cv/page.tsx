import { createServerClient } from "@/lib/supabase/server";
import { Plus, FileText, MoreVertical, Star, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default async function CVListPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isMockEnv = !supabaseUrl || supabaseUrl.includes("placeholder");
  
  let cvs: any[] = [];
  
  if (!isMockEnv) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from("cvs")
        .select("*")
        .eq("user_id", user.id)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false });
        
      cvs = data || [];
    }
  }

  // Mock data if empty for layout presentation
  if (cvs.length === 0 && isMockEnv) {
    cvs = [
      {
        id: "1",
        name: "Software Engineer CV (ID)",
        is_primary: true,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "2",
        name: "Frontend Developer CV (EN)",
        is_primary: false,
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      }
    ];
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-ink mb-2">Kelola CV Anda</h1>
          <p className="text-body text-text-muted">
            Upload, edit, dan kelola berbagai versi CV Anda untuk posisi yang berbeda.
          </p>
        </div>
        <Link 
          href="/dashboard/cv/create"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Buat / Upload CV
        </Link>
      </div>

      {cvs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-surface border border-dashed border-border rounded-xl text-center min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-h3 text-ink mb-2">Belum ada CV yang tersimpan</h3>
          <p className="text-body text-text-muted max-w-sm mb-6">
            Mulai dengan mengunggah CV Anda yang sudah ada atau buat dari awal menggunakan bantuan AI.
          </p>
          <Link 
            href="/dashboard/cv/create"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle"
          >
            <Plus className="w-5 h-5" />
            Upload CV Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <div key={cv.id} className={`bg-surface border rounded-xl p-5 flex flex-col h-full transition-all hover:shadow-card relative ${cv.is_primary ? 'border-primary shadow-subtle' : 'border-border'}`}>
              
              {cv.is_primary && (
                <div className="absolute -top-3 right-5 px-3 py-1 bg-primary text-on-primary text-xs font-bold rounded-pill shadow-subtle flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Utama
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-surface-muted border border-border flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-text-subtle" />
                </div>
                <button className="p-1.5 text-text-subtle hover:text-ink hover:bg-surface-muted rounded-md transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6 flex-grow">
                <h3 className="text-lg font-bold text-ink mb-1 line-clamp-1">{cv.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Diperbarui {formatDistanceToNow(new Date(cv.created_at), { addSuffix: true, locale: localeId })}</span>
                </div>
              </div>
              
              <div className="flex gap-2 border-t border-border pt-4">
                <Link 
                  href={`/dashboard/cv/${cv.id}`}
                  className="flex-1 py-2 text-center text-sm font-semibold text-text bg-surface-muted hover:bg-border transition-colors rounded-md"
                >
                  Edit Data
                </Link>
                <Link 
                  href={`/dashboard/cv/${cv.id}/print`}
                  target="_blank"
                  className="flex-1 py-2 text-center text-sm font-semibold text-primary bg-primary-soft hover:bg-primary/20 transition-colors rounded-md"
                >
                  Generate PDF
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
