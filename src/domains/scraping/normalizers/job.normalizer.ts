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

function parseSalary(salaryStr?: string | null): { min: number | null; max: number | null; currency: string } {
  if (!salaryStr) return { min: null, max: null, currency: "IDR" };
  const s = salaryStr.toLowerCase().replace(/\s+/g, '');
  if (s.includes('tidakditampilkan') || s.includes('dirahasiakan')) {
    return { min: null, max: null, currency: "IDR" };
  }

  let currency = "IDR";
  if (s.includes('usd') || s.includes('$')) currency = "USD";
  
  // Regex to extract numbers (like 3,5 or 4 or 7.000.000)
  // Glints often uses "3,5-4jt" or "7.000.000-10.000.000"
  const matches = s.match(/[\d,\.]+/g);
  if (!matches || matches.length === 0) return { min: null, max: null, currency };

  let min = 0;
  let max = 0;

  const parseNum = (str: string) => {
    const clean = str.replace(/\./g, '').replace(/,/g, '.');
    let num = parseFloat(clean);
    if (s.includes('jt') || s.includes('juta')) {
      if (num < 1000) num = num * 1000000;
    }
    return num;
  };

  min = parseNum(matches[0]);
  if (matches.length > 1) {
    max = parseNum(matches[1]);
  } else {
    max = min;
  }

  return { min, max, currency };
}

/**
 * Normalizes RawJobRecord into the exact object expected by Supabase jobs table
 */
export function normalizeJob(raw: RawJobRecord & { salary?: string; experience?: string }) {
  // Force a deterministic source_id based on company and title to aggressively prevent duplicates
  // This solves the issue of scrapers returning different URLs/timestamps for the same job
  const safeCompany = (raw.companyName || "unknown").toLowerCase().replace(/[^a-z0-9]/g, "-");
  const safeTitle = (raw.title || "job").toLowerCase().replace(/[^a-z0-9]/g, "-");
  const source_id = `${raw.source}-${safeCompany}-${safeTitle}`.replace(/-+/g, '-').slice(0, 150);

  const parsedSalary = parseSalary(raw.salary);
  const min = raw.salaryMin || parsedSalary.min;
  const max = raw.salaryMax || parsedSalary.max;
  const curr = raw.salaryCurrency || parsedSalary.currency;

  let finalDesc = raw.description ? stripHtml(raw.description) : "Tidak ada deskripsi rinci.";

  // Append experience if it's missing from description but we found it
  if (raw.experience && !finalDesc.includes(raw.experience)) {
      finalDesc = `Pengalaman: ${raw.experience}\n\n` + finalDesc;
  }

  return {
    source: raw.source,
    source_id: source_id,
    title: normalizeTitle(raw.title),
    company_name: raw.companyName || "Perusahaan Dirahasiakan",
    company_logo_url: raw.companyLogoUrl || null,
    location: raw.location || "Indonesia",
    job_type: normalizeJobType(raw.jobType),
    salary_min: min,
    salary_max: max,
    salary_currency: curr,
    description: finalDesc,
    requirements: raw.requirements ? stripHtml(raw.requirements) : null,
    apply_url: raw.applyUrl || null,
    posted_date: raw.postedDate ? new Date(raw.postedDate).toISOString() : new Date().toISOString(),
    is_active: true,
  };
}
