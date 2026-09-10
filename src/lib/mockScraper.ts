import { type Job, type JobSource, type JobType } from "@/types";

const COMPANIES = [
  "PT GoTo Gojek Tokopedia", "PT Astra International", "Bank Central Asia (BCA)", 
  "Bank Mandiri", "Telkomsel", "Shopee Indonesia", "Traveloka", 
  "Bukalapak", "Ruangguru", "Tiket.com", "Halodoc", "Kopi Kenangan",
  "PT Bank Rakyat Indonesia", "PT Pertamina", "Indofood", "Unilever Indonesia",
  "PT Gudang Garam", "Blibli", "OVO", "Dana Indonesia"
];

const JOB_TITLES = [
  "Frontend Web Developer", "Backend Software Engineer", "Fullstack Developer", 
  "UI/UX Designer", "Product Manager", "Data Analyst", "Data Scientist", 
  "Digital Marketing Specialist", "DevOps Engineer", "Mobile App Developer",
  "Quality Assurance (QA)", "System Administrator", "Scrum Master", "Business Analyst",
  "Human Resources", "Content Writer", "Social Media Manager", "Account Executive",
  "Cyber Security Analyst", "IT Support Specialist"
];

const LOCATIONS = [
  "Jakarta, Indonesia", "Bandung, Jawa Barat", "Surabaya, Jawa Timur", 
  "Yogyakarta, DIY", "Bali, Indonesia", "Medan, Sumatera Utara", 
  "Semarang, Jawa Tengah", "Remote (Indonesia)"
];

const SOURCES: JobSource[] = ["jobstreet", "glints", "linkedin"];

// Helper to get random item from array
const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

let cachedMockJobs: Job[] | null = null;

export function generateMockIndonesianJobs(count: number = 300): Job[] {
  if (cachedMockJobs) {
    return cachedMockJobs;
  }

  const mockJobs: Job[] = [];
  const now = new Date();

  // Seeded-like simple deterministic generation is better, but since it's cached in memory, random is fine.
  for (let i = 1; i <= count; i++) {
    const company = randomItem(COMPANIES);
    // Determine logo based on domain (heuristic)
    const domain = company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
    // Generate posted date within last 30 days
    const postedDate = new Date(now.getTime() - randomInt(0, 30) * 24 * 60 * 60 * 1000);
    
    const salaryMin = randomInt(5, 15) * 1000000;
    const salaryMax = salaryMin + randomInt(2, 10) * 1000000;
    
    const jobTypes: JobType[] = ["full-time", "contract", "remote", "part-time"];
    
    const source = randomItem(SOURCES);

    mockJobs.push({
      id: `mock-${source}-${i}`,
      source: source,
      source_id: `ext-${i}`,
      title: randomItem(JOB_TITLES),
      company_name: company,
      company_logo_url: logoUrl,
      location: randomItem(LOCATIONS),
      job_type: randomItem(jobTypes),
      salary_min: randomInt(0, 10) > 3 ? salaryMin : null,
      salary_max: randomInt(0, 10) > 3 ? salaryMax : null,
      salary_currency: "IDR",
      description: `Dicari kandidat berpengalaman untuk posisi ini di ${company}. Anda akan bertanggung jawab untuk pengembangan dan inovasi produk.`,
      requirements: "Pengalaman minimal 2 tahun. Mampu bekerja sama dalam tim.",
      posted_date: postedDate.toISOString(),
      apply_url: "https://example.com/apply",
      is_active: true,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  // Sort them by posted date (newest first)
  mockJobs.sort((a, b) => new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime());
  
  cachedMockJobs = mockJobs;
  return mockJobs;
}
