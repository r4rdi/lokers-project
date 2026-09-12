import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase/server";
import { ChevronLeft, Briefcase, Building2, MapPin } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface CoverLetterPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Cover Letter Detail | Lokers",
  description: "Lihat detail cover letter yang telah di-generate",
};

export default async function CoverLetterDetailPage({ params }: CoverLetterPageProps) {
  const { id } = await params;
  const supabase = await createServerClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return notFound();
  }

  // Fetch cover letter with joined job data
  const { data: coverLetter, error } = await supabase
    .from("cover_letters")
    .select(`
      *,
      job:jobs (
        title,
        company_name,
        location,
        company_logo_url
      )
    `)
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (error || !coverLetter) {
    return notFound();
  }

  const job = coverLetter.job;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/cover-letters"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Riwayat Surat Lamaran
        </Link>
        <h1 className="text-h3 text-ink mb-2">Detail Surat Lamaran</h1>
        <p className="text-sm text-text-muted">
          Dibuat pada {format(new Date(coverLetter.created_at), "dd MMMM yyyy, HH:mm", { locale: localeId })}
        </p>
      </div>

      {job && (
        <div className="bg-surface border border-border rounded-xl p-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-surface-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
            {job.company_logo_url ? (
              <Image src={job.company_logo_url} alt={job.company_name} width={60} height={60} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-6 h-6 text-text-subtle" />
            )}
          </div>
          <div>
            <h2 className="text-base font-semibold text-ink">{job.title}</h2>
            <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {job.company_name}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border bg-surface-muted flex justify-between items-center">
          <h3 className="text-sm font-semibold text-ink">Isi Surat Lamaran</h3>
          <CopyButton textToCopy={coverLetter.content} />
        </div>
        <div className="p-6 md:p-8">
          <div className="prose prose-sm md:prose-base max-w-none text-text leading-relaxed whitespace-pre-wrap">
            {coverLetter.content}
          </div>
        </div>
      </div>
    </div>
  );
}
