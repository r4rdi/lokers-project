import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { type Job } from "@/types";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GenerateCoverLetterButton from "@/components/jobs/GenerateCoverLetterButton";
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Bookmark, 
  Building2,
  ChevronLeft,
  Share2,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getJob(id: string): Promise<Job | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return null;
  }
  
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error || !data) return null;
  return data as Job;
}

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

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return {
      title: "Lowongan Tidak Ditemukan",
    };
  }

  return {
    title: `${job.title} di ${job.company_name}`,
    description: `Lowongan ${job.title} di ${job.company_name}, ${job.location}. ${job.description.substring(0, 150)}...`,
    openGraph: {
      title: `${job.title} - ${job.company_name}`,
      description: `Lowongan kerja terbaru untuk ${job.title} di ${job.company_name}. Lamar sekarang melalui Lokers!`,
      images: job.company_logo_url ? [job.company_logo_url] : [],
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  const postedDate = new Date(job.posted_date);

  // JSON-LD Schema for JobPosting
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company_name,
      "logo": job.company_logo_url
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location
      }
    },
    "employmentType": job.job_type.toUpperCase().replace('-', '_'),
    "datePosted": job.posted_date,
    "validThrough": new Date(new Date(job.posted_date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    "baseSalary": job.salary_min ? {
      "@type": "MonetaryAmount",
      "currency": job.salary_currency || "IDR",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": job.salary_min,
        "maxValue": job.salary_max || job.salary_min,
        "unitText": "MONTH"
      }
    } : undefined
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-28 pb-20">
        <div className="container-content">
          
          {/* Back Button */}
          <Link 
            href="/jobs" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke daftar lowongan
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Header Card */}
              <div className="bg-surface border border-border rounded-xl p-6 md:p-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Logo */}
                  <div className="w-20 h-20 rounded-xl border border-border bg-surface-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {job.company_logo_url ? (
                      <img 
                        src={job.company_logo_url} 
                        alt={`Logo ${job.company_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-10 h-10 text-text-subtle" />
                    )}
                  </div>
                  
                  {/* Title & Info */}
                  <div className="flex-grow">
                    <h1 className="text-h2 text-ink mb-2">{job.title}</h1>
                    <p className="text-lg text-text-muted mb-4">{job.company_name}</p>
                    
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-muted text-sm font-medium text-text-muted">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-muted text-sm font-medium text-text-muted capitalize">
                        <Briefcase className="w-4 h-4" />
                        {job.job_type.replace('-', ' ')}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-muted text-sm font-medium text-text-muted">
                        <DollarSign className="w-4 h-4" />
                        {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Mobile only */}
              <div className="flex gap-3 lg:hidden">
                <Link 
                  href={job.apply_url || "#"} 
                  target={job.apply_url ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="flex-grow py-3 px-4 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle flex items-center justify-center gap-2 text-center"
                >
                  Lamar Sekarang
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button className="p-3 border border-border rounded-md text-text-muted hover:text-primary transition-colors bg-surface">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <div className="bg-surface border border-border rounded-xl p-6 md:p-8 space-y-8">
                <section>
                  <h2 className="text-h3 text-ink mb-4">Deskripsi Pekerjaan</h2>
                  <div className="text-body text-text-muted whitespace-pre-wrap">
                    {job.description}
                  </div>
                </section>

                {job.requirements && (
                  <section>
                    <h2 className="text-h3 text-ink mb-4">Persyaratan</h2>
                    <div className="text-body text-text-muted whitespace-pre-wrap">
                      {job.requirements}
                    </div>
                  </section>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Action Card */}
              <div className="bg-surface border border-border rounded-xl p-6 hidden lg:block sticky top-28">
                <div className="flex gap-3 mb-6">
                  <Link 
                    href={job.apply_url || "#"} 
                    target={job.apply_url ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="flex-grow py-3 px-4 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle flex items-center justify-center gap-2 text-center"
                  >
                    Lamar Sekarang
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button className="p-3 border border-border rounded-md text-text-muted hover:text-primary hover:bg-primary-soft transition-colors bg-surface" aria-label="Simpan">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
                
                <hr className="border-border mb-6" />
                
                <h3 className="text-sm font-bold text-ink mb-4">Ringkasan Pekerjaan</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Clock className="w-5 h-5 text-text-subtle shrink-0" />
                    <div>
                      <p className="text-xs text-text-subtle mb-0.5">Tanggal Posting</p>
                      <p className="text-sm font-semibold text-text">
                        {formatDistanceToNow(postedDate, { addSuffix: true, locale: localeId })}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Briefcase className="w-5 h-5 text-text-subtle shrink-0" />
                    <div>
                      <p className="text-xs text-text-subtle mb-0.5">Tipe Pekerjaan</p>
                      <p className="text-sm font-semibold text-text capitalize">
                        {job.job_type.replace('-', ' ')}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <MapPin className="w-5 h-5 text-text-subtle shrink-0" />
                    <div>
                      <p className="text-xs text-text-subtle mb-0.5">Lokasi</p>
                      <p className="text-sm font-semibold text-text">
                        {job.location}
                      </p>
                    </div>
                  </li>
                </ul>

                <hr className="border-border my-6" />

                <GenerateCoverLetterButton jobId={job.id} />
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
