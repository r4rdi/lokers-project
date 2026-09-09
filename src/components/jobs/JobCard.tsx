import Link from "next/link";
import { MapPin, Briefcase, DollarSign, Clock, Bookmark, Building2 } from "lucide-react";
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

  return (
    <div 
      className={cn(
        "group relative bg-surface border rounded-xl p-6 transition-all duration-300 hover:shadow-card flex flex-col h-full",
        featured ? "border-primary shadow-subtle" : "border-border"
      )}
    >
      {featured && (
        <div className="absolute -top-3 right-6 px-3 py-1 bg-primary text-on-primary text-xs font-bold rounded-pill shadow-subtle">
          Diunggulkan
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-lg border border-border bg-surface-muted flex items-center justify-center shrink-0 overflow-hidden">
            {job.company_logo_url ? (
              <img 
                src={job.company_logo_url} 
                alt={`Logo ${job.company_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-6 h-6 text-text-subtle" />
            )}
          </div>
          <div>
            <Link href={`/jobs/${job.id}`} className="block group-hover:text-primary transition-colors">
              <h3 className="text-h3 text-ink line-clamp-1">{job.title}</h3>
            </Link>
            <p className="text-sm text-text-muted mt-1">{job.company_name}</p>
          </div>
        </div>
        <button 
          className="text-text-subtle hover:text-primary transition-colors p-2 -mr-2"
          aria-label="Simpan lowongan"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-muted text-xs font-medium text-text-muted">
          <MapPin className="w-3.5 h-3.5" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-muted text-xs font-medium text-text-muted capitalize">
          <Briefcase className="w-3.5 h-3.5" />
          {job.job_type.replace('-', ' ')}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-muted text-xs font-medium text-text-muted">
          <DollarSign className="w-3.5 h-3.5" />
          {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
        </span>
      </div>

      {/* Description Snippet */}
      <p className="text-sm text-text-muted line-clamp-2 mb-6 flex-grow">
        {job.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-text-subtle">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {formatDistanceToNow(postedDate, { addSuffix: true, locale: id })}
          </span>
        </div>
        
        {job.source !== 'manual' && job.source !== 'employer' && (
          <span className="text-xs font-medium text-primary bg-primary-soft px-2 py-1 rounded-md capitalize">
            via {job.source}
          </span>
        )}
      </div>
    </div>
  );
}
