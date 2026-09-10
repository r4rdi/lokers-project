import Link from "next/link";
import { MapPin, Briefcase, DollarSign, Clock, Bookmark, Building2, Globe, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { type Job } from "@/types";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  featured?: boolean;
}

export default function JobCard({ job, featured = false }: JobCardProps) {
  const postedDate = new Date(job.posted_date);

  // Format salary
  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return "Gaji tidak ditampilkan";

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency || "IDR",
      maximumFractionDigits: 0,
    });

    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
    if (min) return `Mulai dari ${formatter.format(min)}`;
    if (max) return `Hingga ${formatter.format(max)}`;
    return "Gaji dirahasiakan";
  };

  // Helper to strip HTML tags from description snippet
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
  };

  return (
    <div
      className={cn(
        "group relative bg-[#141416]/80 backdrop-blur-md border rounded-[2rem] p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full",
        featured ? "border-blue-500/50" : "border-white/5 hover:border-white/20"
      )}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
          Diunggulkan
        </div>
      )}

      {/* Top Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium text-white/70">
            {formatDistanceToNow(postedDate, { addSuffix: true, locale: id })}
          </div>
          {job.apply_url && (
            <a
              href={job.apply_url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-full text-[11px] font-medium transition-colors flex items-center gap-1.5 group/link"
            >
              <Globe className="w-3 h-3" />
              <span className="capitalize">
                Sumber: {job.id.startsWith("remotive") ? "Remotive" : job.source}
              </span>
              <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover/link:opacity-100" />
            </a>
          )}
        </div>
        <button
          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Simpan lowongan"
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      {/* Middle Content */}
      <div className="flex justify-between items-start gap-4 mb-6">
        <div>
          <p className="text-xs font-medium text-white/50 mb-1">{job.company_name}</p>
          <Link href={`/jobs/${job.id}`} className="block group-hover:text-blue-400 transition-colors">
            <h3 className="text-xl font-semibold text-white leading-tight line-clamp-2">{job.title}</h3>
          </Link>
        </div>
        <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
          {job.company_logo_url ? (
            <img
              src={job.company_logo_url}
              alt={`Logo ${job.company_name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-6 h-6 text-white/40" />
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-medium text-white/70">
          {job.job_type.replace('-', ' ')}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-medium text-white/70">
          Tingkat senior
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-medium text-white/70">
          Jarak jauh
        </span>
      </div>

      {/* Description Snippet */}
      <p className="text-xs text-white/40 line-clamp-2 mb-6 flex-grow leading-relaxed hidden">
        {stripHtml(job.description)}
      </p>

      <div className="flex-grow" />

      {/* Footer */}
      <div className="flex items-end justify-between mt-auto">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-white">
            {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
          </span>
          <span className="text-xs text-white/50 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job.location}
          </span>
        </div>

        <Link
          href={`/jobs/${job.id}`}
          className="px-5 py-2.5 bg-white text-black font-semibold text-xs rounded-full hover:bg-white/90 transition-colors shadow-lg"
        >
          Detail
        </Link>
      </div>
    </div>
  );
}
