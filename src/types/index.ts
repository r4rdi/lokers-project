// ===========================
// Domain Types - Lokers!
// Based on MVP.md Section 3
// ===========================

// --- Profiles ---
export type UserRole = "job_seeker" | "employer" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  headline: string | null;
  summary: string | null;
  location: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

// --- CVs ---
export interface WorkExperience {
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string;
  is_current: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
}

export interface CVData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  summary: string;
  work_experience: WorkExperience[];
  education: Education[];
  skills: string[];
  languages: string[];
  certifications: string[];
  portfolio_links: string[];
}

export interface CV {
  id: string;
  user_id: string;
  name: string;
  is_primary: boolean;
  data: CVData;
  raw_text: string | null;
  created_at: string;
  updated_at: string;
}

// --- Jobs ---
export type JobType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "remote";

export type JobSource =
  | "linkedin"
  | "indeed"
  | "glints"
  | "jobstreet"
  | "manual"
  | "employer";

export interface Job {
  id: string;
  source: JobSource;
  source_id: string | null;
  title: string;
  company_name: string;
  company_logo_url: string | null;
  location: string;
  job_type: JobType;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  description: string;
  requirements: string | null;
  posted_date: string;
  apply_url: string | null;
  is_active: boolean;
  is_featured?: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// --- Cover Letters ---
export interface CoverLetter {
  id: string;
  user_id: string;
  job_id: string;
  cv_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  // Joined fields (optional)
  job?: Job;
}

// --- Bookmarks ---
export interface Bookmark {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
  // Joined
  job?: Job;
}

// --- Job Alerts ---
export type AlertFrequency = "daily" | "weekly";

export interface JobAlert {
  id: string;
  user_id: string;
  keyword: string;
  location: string | null;
  job_type: JobType | null;
  frequency: AlertFrequency;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- Subscriptions ---
export type PlanId =
  | "free"
  | "job_seeker_premium"
  | "employer_basic"
  | "employer_pro";

export type SubscriptionStatus = "active" | "canceled" | "past_due";

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: PlanId;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  payment_provider: string | null;
  provider_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

// --- Scraping Logs ---
export type ScrapingStatus = "success" | "failed" | "partial";

export interface ScrapingLog {
  id: string;
  source: string;
  status: ScrapingStatus;
  jobs_found: number;
  error_message: string | null;
  started_at: string;
  finished_at: string | null;
}

// --- API Response ---
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

// --- Pagination ---
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// --- Job Filters ---
export interface JobFilters {
  search?: string;
  location?: string;
  job_type?: JobType;
  salary_min?: number;
  salary_max?: number;
  company?: string;
  source?: JobSource;
  sort_by?: "posted_date" | "salary_max" | "relevance";
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}
