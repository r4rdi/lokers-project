import { createServerClient } from "@/lib/supabase/server";
import { Plus, Sparkles, FileType2, MoreVertical, Clock, Download } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default async function CoverLettersHistoryPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isMockEnv = !supabaseUrl || supabaseUrl.includes("placeholder");
  
  let letters: any[] = [];
  
  if (!isMockEnv) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Join with jobs table if possible, for MVP we just fetch the letters
      const { data } = await supabase
        .from("cover_letters")
        .select("*, jobs(title, company_name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      letters = data || [];
    }
  }

  // Mock data if empty for layout presentation
  if (letters.length === 0 && isMockEnv) {
    letters = [
      {
        id: "1",
        jobs: { title: "Software Engineer", company_name: "Gojek" },
        content: "Yth. HRD Gojek,\n\nMelalui surat ini saya bermaksud melamar posisi Software Engineer...",
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: "2",
        jobs: null, // manual job
        content: "Yth. HRD PT Teknologi Modern,\n\nSaya memiliki pengalaman 3 tahun...",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      }
    ];
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-ink mb-2">Riwayat Cover Letters</h1>
          <p className="text-body text-text-muted">
            Kumpulan surat lamaran yang pernah Anda buat menggunakan AI.
          </p>
        </div>
        <Link 
          href="/dashboard/cover-letters/create"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-[#60A5FA] hover:shadow-glow text-on-primary font-bold rounded-md transition-all whitespace-nowrap"
        >
          <Sparkles className="w-5 h-5" />
          Buat Cover Letter Baru
        </Link>
      </div>

      {letters.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-surface border border-dashed border-border rounded-xl text-center min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-h3 text-ink mb-2">Belum ada Surat Lamaran</h3>
          <p className="text-body text-text-muted max-w-sm mb-6">
            Gunakan kekuatan AI untuk meracik surat lamaran yang sangat personal dan sesuai standar ATS.
          </p>
          <Link 
            href="/dashboard/cover-letters/create"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle"
          >
            <Sparkles className="w-5 h-5" />
            Coba AI Generator
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {letters.map((letter) => (
            <div key={letter.id} className="bg-surface border border-border rounded-xl p-5 flex flex-col h-full transition-all hover:shadow-card">
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-surface-muted border border-border flex items-center justify-center shrink-0">
                  <FileType2 className="w-6 h-6 text-primary" />
                </div>
                <button className="p-1.5 text-text-subtle hover:text-ink hover:bg-surface-muted rounded-md transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4 flex-grow">
                <h3 className="text-lg font-bold text-ink mb-1 line-clamp-1">
                  {letter.jobs ? `${letter.jobs.title} - ${letter.jobs.company_name}` : "Posisi Kustom (Manual)"}
                </h3>
                <p className="text-xs text-text-muted line-clamp-3 italic bg-surface-muted p-2 rounded-md border border-border/50">
                  "{letter.content.substring(0, 100)}..."
                </p>
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-1.5 text-xs text-text-subtle font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDistanceToNow(new Date(letter.created_at), { addSuffix: true, locale: localeId })}</span>
                </div>
                
                {/* Real download logic would be a client component or link */}
                <button className="p-1.5 text-primary bg-primary-soft hover:bg-primary/20 rounded-md transition-colors" title="Download TXT" aria-label="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
