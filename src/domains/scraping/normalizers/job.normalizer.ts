import { RawJobRecord } from "../types";

/**
 * Strips HTML tags from text
 */
function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
}

/**
 * Normalizes a job title
 */
function normalizeTitle(title: string): string {
  return title.trim();
}

/**
 * Maps varying job type strings into our strict ENUM
 */
function normalizeJobType(rawType?: string): 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote' {
  if (!rawType) return 'full-time'; // default fallback
  
  const lower = rawType.toLowerCase();
  if (lower.includes("remote") || lower.includes("jarak jauh")) return 'remote';
  if (lower.includes("part-time") || lower.includes("paruh waktu")) return 'part-time';
  if (lower.includes("contract") || lower.includes("kontrak")) return 'contract';
  if (lower.includes("intern") || lower.includes("magang")) return 'internship';
  
  return 'full-time';
}

/**
 * Normalizes RawJobRecord into the exact object expected by Supabase jobs table
 */
export function normalizeJob(raw: RawJobRecord) {
  // Ensure we have a source_id. If missing, generate a simple hash using title and company
  let source_id = raw.sourceId;
  if (!source_id) {
    const slug = `${raw.companyName}-${raw.title}`.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 50);
    source_id = `${raw.source}-${slug}`;
  }

  return {
    source: raw.source,
    source_id: source_id,
    title: normalizeTitle(raw.title),
    company_name: raw.companyName || "Perusahaan Dirahasiakan",
    company_logo_url: raw.companyLogoUrl || null,
    location: raw.location || "Indonesia",
    job_type: normalizeJobType(raw.jobType),
    salary_min: raw.salaryMin || null,
    salary_max: raw.salaryMax || null,
    salary_currency: raw.salaryCurrency || "IDR",
    description: raw.description ? stripHtml(raw.description) : "Tidak ada deskripsi rinci.",
    requirements: raw.requirements ? stripHtml(raw.requirements) : null,
    apply_url: raw.applyUrl || null,
    posted_date: raw.postedDate ? new Date(raw.postedDate).toISOString() : new Date().toISOString(),
    is_active: true,
  };
}
