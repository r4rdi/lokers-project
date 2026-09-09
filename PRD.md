\
# Product Requirements Document — Lokers.biz.id

**Product:** Lokers.biz.id — AI Job Portal “Anti Ribet”  
**Tagline:** “Temukan Lowongan, Buat Lamaran dalam Hitungan Detik”  
**Version:** v1.0.0  
**Status:** Active development  
**Document type:** Living Product Requirements Document

> This PRD follows the seven-section structure in the supplied PRD reference: Problem Statement, Goals, Target Users/Personas, User Stories, Functional Requirements, Non-Functional Requirements, and Scope (In/Out). The supplied reference explicitly frames a PRD as the WHAT and WHY rather than implementation HOW.

---

## 1. Problem Statement

### 1.1 Problem

Job seekers commonly need to move between multiple sources to discover suitable vacancies, inspect requirements, prepare a CV, write a tailored application letter, save opportunities, and track previous applications.

Traditional job portals can also make the process feel fragmented:

- job discovery and application preparation are separated;
- job descriptions may be difficult to compare quickly;
- candidates repeatedly write similar cover letters;
- candidate information is often re-entered manually;
- useful vacancies can be lost without bookmarks or alerts;
- employer/admin workflows require separate management surfaces.

Lokers.biz.id addresses this gap by combining **centralized job discovery**, **structured candidate/CV data**, and **AI-tailored cover-letter generation** in one product.

### 1.2 Product Opportunity

The product differentiator is not merely “another job board.” The core experience is:

> **Find a relevant vacancy → select a CV → generate a tailored cover letter → edit → copy/download → continue to the original application source.**

### 1.3 Evidence / Validation Status

The supplied PRD reference recommends evidence-backed problem statements, but it contains research data for a fictional Task Manager example, not for Lokers.biz.id. Therefore, this product PRD does **not** present those fictional statistics as evidence for Lokers.biz.id.

**Validation items — TBD:**
- Job-seeker interviews.
- Search behavior analytics.
- Competitor workflow comparison.
- Cover-letter creation time baseline.
- Conversion from job detail → cover-letter generation.
- Employer willingness-to-pay validation.

---

## 2. Goals

| ID | Goal | Success Metric | Priority |
|---|---|---|---|
| G1 | Reduce time required to prepare a job application | A user can generate a tailored first draft in one guided flow | P1 |
| G2 | Centralize job discovery | Users can search, filter, inspect, save, and revisit jobs from one account | P1 |
| G3 | Make cover letters genuinely personalized | Generated letters use only facts present in the selected CV and job description | P1 |
| G4 | Create a useful candidate workspace | Dashboard exposes CVs, cover letters, bookmarks, alerts, and usage | P1 |
| G5 | Enable employer job publishing | Employers can create, edit, and remove their own vacancies | P2 |
| G6 | Establish SaaS monetization | Premium limits/features can be enforced through subscription status | P2 |
| G7 | Maintain trust and safety | Private CV data is isolated and sensitive endpoints are rate-limited | P1 |
| G8 | Support bilingual discovery | Core UI supports Indonesian and English | P2 |
| G9 | Support scalable job ingestion | Jobs can originate from manual input, approved integrations, and scraping workflows | P2 |

---

## 3. Target Users / Personas

### Persona 1 — Job Seeker

**Profile:** Individual looking for employment, internship, contract, remote, or part-time opportunities.

**Needs:**
- Find relevant jobs quickly.
- Understand requirements.
- Keep multiple CV versions.
- Generate tailored cover letters.
- Save jobs.
- Receive job alerts.
- Reuse and edit previous cover letters.

**Primary success moment:** “I found a suitable job and produced a usable tailored letter in minutes instead of starting from zero.”

### Persona 2 — Employer / Recruiter

**Profile:** Company or recruiter that needs to publish vacancies.

**Needs:**
- Create and manage job postings.
- Present company branding.
- See basic vacancy performance.
- Keep their own job data isolated from other employers.

**Primary success moment:** “I can publish and manage vacancies without a complicated recruitment system.”

### Persona 3 — Admin

**Profile:** Platform operator.

**Needs:**
- Moderate jobs.
- Manage users.
- Trigger/monitor scraping.
- Manage platform settings.
- Inspect operational logs.

**Primary success moment:** “I can operate the marketplace safely and understand what is happening.”

---

## 4. User Stories

Priorities follow the supplied PRD convention: **P1 = required for launch, P2 = important, P3 = nice-to-have.**

| ID | Pri | User Story |
|---|---|---|
| US-1 | P1 | Sebagai job seeker, saya ingin mencari lowongan berdasarkan kata kunci dan lokasi agar cepat menemukan pekerjaan yang relevan. |
| US-2 | P1 | Sebagai job seeker, saya ingin memfilter tipe pekerjaan, gaji, perusahaan, dan tanggal posting agar hasil pencarian lebih relevan. |
| US-3 | P1 | Sebagai job seeker, saya ingin melihat detail lowongan lengkap agar dapat menilai kecocokan sebelum melamar. |
| US-4 | P1 | Sebagai job seeker, saya ingin menyimpan beberapa versi CV agar dapat memilih CV yang paling relevan untuk setiap lowongan. |
| US-5 | P1 | Sebagai job seeker, saya ingin mengunggah PDF CV dan mendapatkan data terstruktur otomatis agar tidak perlu mengetik semuanya dari awal. |
| US-6 | P1 | Sebagai job seeker, saya ingin meninjau hasil parsing CV sebelum menyimpannya agar data saya tetap akurat. |
| US-7 | P1 | Sebagai job seeker, saya ingin membuat cover letter berdasarkan CV dan lowongan agar surat lebih relevan. |
| US-8 | P1 | Sebagai job seeker, saya ingin mengedit, menyalin, dan mengunduh cover letter agar dapat digunakan dalam proses lamaran. |
| US-9 | P1 | Sebagai job seeker, saya ingin melihat riwayat cover letter agar dapat menemukan dokumen yang pernah dibuat. |
| US-10 | P2 | Sebagai job seeker, saya ingin bookmark lowongan agar dapat kembali lagi nanti. |
| US-11 | P2 | Sebagai job seeker, saya ingin menerima job alert agar tidak melewatkan lowongan baru. |
| US-12 | P2 | Sebagai employer, saya ingin membuat dan mengelola lowongan saya sendiri agar perusahaan dapat mempublikasikan kebutuhan tenaga kerja. |
| US-13 | P2 | Sebagai admin, saya ingin menyetujui atau menolak lowongan agar kualitas marketplace terjaga. |
| US-14 | P2 | Sebagai pengguna premium, saya ingin mendapatkan batas/fasilitas cover-letter yang lebih tinggi agar proses lamaran tidak terhambat. |
| US-15 | P3 | Sebagai pengguna, saya ingin membagikan lowongan ke platform sosial agar dapat berdiskusi atau menyimpan referensi di luar Lokers.biz.id. |

---

## 5. Functional Requirements

### 5.1 Authentication & Account

| ID | Requirement | Pri |
|---|---|---|
| FR-AUTH-01 | Register with email/password | P1 |
| FR-AUTH-02 | Login/logout | P1 |
| FR-AUTH-03 | Google OAuth | P1 |
| FR-AUTH-04 | LinkedIn OAuth when configured | P2 |
| FR-AUTH-05 | Password reset | P1 |
| FR-AUTH-06 | Optional email verification | P2 |
| FR-AUTH-07 | Role assignment: job_seeker/employer/admin | P1 |

### 5.2 Profile & CV

| ID | Requirement | Pri |
|---|---|---|
| FR-CV-01 | Create/update structured profile | P1 |
| FR-CV-02 | Store work experience, education, skills, languages, certifications, portfolio | P1 |
| FR-CV-03 | Upload PDF CV | P1 |
| FR-CV-04 | Extract PDF text | P1 |
| FR-CV-05 | Transform extracted CV text into structured JSON through Gemini | P1 |
| FR-CV-06 | Validate AI extraction before persistence | P1 |
| FR-CV-07 | Allow user review/edit after parsing | P1 |
| FR-CV-08 | Store multiple CV versions | P1 |
| FR-CV-09 | Mark one CV as primary | P1 |
| FR-CV-10 | Keep CV private to its owner | P1 |

### 5.3 Job Discovery

| ID | Requirement | Pri |
|---|---|---|
| FR-JOB-01 | Display latest active jobs | P1 |
| FR-JOB-02 | Keyword search | P1 |
| FR-JOB-03 | Location filter | P1 |
| FR-JOB-04 | Category/title filter | P1 |
| FR-JOB-05 | Job type filter | P1 |
| FR-JOB-06 | Salary range filter | P2 |
| FR-JOB-07 | Company filter | P2 |
| FR-JOB-08 | Posted-date filter | P2 |
| FR-JOB-09 | Paginate results | P1 |
| FR-JOB-10 | Display full job detail | P1 |
| FR-JOB-11 | Link to original application URL | P1 |
| FR-JOB-12 | Show source of job data | P1 |
| FR-JOB-13 | Bookmark from listing/detail | P2 |
| FR-JOB-14 | Social share | P3 |

### 5.4 AI Cover Letter

| ID | Requirement | Pri |
|---|---|---|
| FR-AI-01 | Start generation from job detail | P1 |
| FR-AI-02 | Select CV to use | P1 |
| FR-AI-03 | Combine selected CV data with job description | P1 |
| FR-AI-04 | Generate through Gemini server-side | P1 |
| FR-AI-05 | Match job language where possible | P1 |
| FR-AI-06 | Prohibit invented candidate facts | P1 |
| FR-AI-07 | Save generated cover letter | P1 |
| FR-AI-08 | Rich-text editing | P2 |
| FR-AI-09 | Regenerate variation | P2 |
| FR-AI-10 | Copy to clipboard | P1 |
| FR-AI-11 | Download PDF | P2 |
| FR-AI-12 | Download DOCX | P2 |
| FR-AI-13 | Cover-letter history | P1 |
| FR-AI-14 | Apply usage/rate limits | P1 |

### 5.5 Employer/Admin

| ID | Requirement | Pri |
|---|---|---|
| FR-MGMT-01 | Employer CRUD for own jobs | P2 |
| FR-MGMT-02 | Employer job statistics | P3 |
| FR-MGMT-03 | Admin user management | P2 |
| FR-MGMT-04 | Admin job moderation | P2 |
| FR-MGMT-05 | Admin scraping trigger | P2 |
| FR-MGMT-06 | Scraping logs | P2 |
| FR-MGMT-07 | Global settings | P3 |

### 5.6 SaaS

| ID | Requirement | Pri |
|---|---|---|
| FR-SAAS-01 | Free plan | P2 |
| FR-SAAS-02 | Premium job-seeker plan | P2 |
| FR-SAAS-03 | Employer Basic plan | P2 |
| FR-SAAS-04 | Employer Pro plan | P3 |
| FR-SAAS-05 | Subscription status | P2 |
| FR-SAAS-06 | Checkout | P2 |
| FR-SAAS-07 | Payment webhook | P2 |
| FR-SAAS-08 | Feature gating | P2 |
| FR-SAAS-09 | Cancellation | P3 |

### 5.7 Alerts & Bookmarks

| ID | Requirement | Pri |
|---|---|---|
| FR-EXTRA-01 | Bookmark CRUD | P2 |
| FR-EXTRA-02 | Create alert by keyword/location/job type | P2 |
| FR-EXTRA-03 | Daily/weekly alert frequency | P2 |
| FR-EXTRA-04 | Email notification for matching jobs | P2 |

### 5.8 API Surface

Authentication:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `POST /api/auth/reset-password`

Profile/CV:
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/cvs`
- `POST /api/cvs`
- `POST /api/cvs/parse-pdf`
- `GET /api/cvs/:id`
- `PUT /api/cvs/:id`
- `DELETE /api/cvs/:id`

Jobs:
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs`
- `PUT /api/jobs/:id`
- `DELETE /api/jobs/:id`
- `POST /api/jobs/scrape`

Cover letters:
- `POST /api/cover-letter/generate`
- `GET /api/cover-letters`
- `GET /api/cover-letters/:id`
- `PUT /api/cover-letters/:id`
- `DELETE /api/cover-letters/:id`
- `POST /api/cover-letters/:id/regenerate`
- `GET /api/cover-letters/:id/download?format=pdf|docx`

Bookmarks/alerts:
- `GET /api/bookmarks`
- `POST /api/bookmarks`
- `DELETE /api/bookmarks/:jobId`
- `GET /api/job-alerts`
- `POST /api/job-alerts`
- `PUT /api/job-alerts/:id`
- `DELETE /api/job-alerts/:id`

Subscription:
- `GET /api/subscription`
- `POST /api/subscription/checkout`
- `POST /api/webhooks/stripe`

Admin:
- `GET /api/admin/users`
- `GET /api/admin/jobs`
- `GET /api/admin/scraping-logs`

---

## 6. Non-Functional Requirements

| ID | Requirement | Pri |
|---|---|---|
| NFR-01 | Responsive web UI from mobile to desktop | P1 |
| NFR-02 | Ordinary API operations target p95 < 200ms where infrastructure permits | P1 |
| NFR-03 | UI interactions should feel immediate; expensive operations show explicit loading states | P1 |
| NFR-04 | Production availability target 99.5%, excluding scheduled maintenance | P1 |
| NFR-05 | Encrypt data in transit using HTTPS/TLS and rely on managed encrypted storage where available | P1 |
| NFR-06 | RLS isolates user-owned data | P1 |
| NFR-07 | AI generation endpoint is rate-limited | P1 |
| NFR-08 | Uploaded PDF is size/type validated | P1 |
| NFR-09 | Rich text is sanitized to reduce XSS risk | P1 |
| NFR-10 | WCAG 2.1 AA target for web accessibility | P2 |
| NFR-11 | SEO metadata and JobPosting structured data on public job detail pages | P2 |
| NFR-12 | Lighthouse target > 90 where practical | P2 |
| NFR-13 | Job listing pagination limits payload size | P1 |
| NFR-14 | Application supports Indonesian and English UI | P2 |
| NFR-15 | System can scale from MVP infrastructure to dedicated workers/queues | P2 |

---

## 7. Scope

### In Scope v1.0

**Core MVP**
- Authentication.
- User profile.
- Manual CV creation.
- PDF CV upload and parsing.
- Multiple CV versions.
- Job listing.
- Keyword search.
- Core filters.
- Job detail.
- Bookmark.
- AI cover-letter generation.
- Cover-letter persistence/history.
- Basic editor.
- Copy and download flows.
- Job-seeker dashboard.
- Basic job alerts.
- Employer job CRUD.
- Admin moderation.
- Scraping ingestion/logging.
- Basic subscription architecture.
- Responsive web.
- Indonesian/English foundations.
- SEO foundations.
- Security/RLS/rate limiting.

### Out of Scope for the first functional MVP

These can be staged into subsequent releases:
- Native iOS application.
- Native Android application.
- Team collaboration between job seekers.
- Advanced employer ATS.
- Full applicant tracking system.
- Complex interview scheduling.
- Advanced AI job recommendations.
- AI-generated CV rewriting.
- Deep social-media integrations.
- Desktop native application.
- Real-time collaborative editing.
- Advanced analytics and BI.
- Guaranteed access to third-party job sources where no authorized API/access exists.

### Product Decisions / TBD

- Exact payment provider: Stripe vs Midtrans.
- Exact email provider: Resend vs SendGrid.
- Final scraping source availability and legal/technical constraints.
- Exact premium pricing validation.
- Whether employer analytics are included in Pro.
- Exact Gemini model/version available at implementation time.

---

## 8. Primary User Flows

### Flow A — Find a Job

`Landing → Search → Results → Filters → Job Detail → Save or Generate Cover Letter → Original Apply URL`

### Flow B — Generate Cover Letter

`Job Detail → Select CV → Generate → Review → Edit → Regenerate/Copy/Download → Apply on Source`

### Flow C — Import CV

`Dashboard → CVs → Upload PDF → Parse → Review extracted fields → Edit → Save CV`

### Flow D — Employer

`Employer Dashboard → Jobs → New Job → Validate → Publish → Manage/Edit`

### Flow E — Admin

`Admin → Jobs/Users/Scraping → Review → Approve/Reject/Manage → Audit`

---

## 9. AI Requirements

### CV Extraction Prompt Contract

The model must return structured information equivalent to:

```json
{
  "full_name": "",
  "email": "",
  "phone": "",
  "location": "",
  "headline": "",
  "summary": "",
  "work_experience": [],
  "education": [],
  "skills": [],
  "languages": [],
  "certifications": []
}
```

The application must validate the response before using it.

### Cover Letter Prompt Contract

The generator must:
- act as a professional career-writing assistant;
- use candidate CV facts and job requirements;
- never invent facts;
- use Indonesian or English according to the job context;
- produce a warm but formal letter;
- target approximately 300–400 words unless product settings change.

Suggested model parameters from the blueprint:
- temperature: 0.7
- top_p: 0.9
- max output tokens: 1024

These values are implementation defaults, not immutable product requirements.

---

## 10. Success Metrics

Initial instrumentation should capture:

- Search usage.
- Search → job detail click-through rate.
- Job detail → cover-letter generation rate.
- Generation success/failure rate.
- Median cover-letter generation latency.
- Cover-letter edit rate.
- Copy/download rate.
- Bookmark rate.
- Job alert activation.
- CV upload completion.
- CV parsing correction rate.
- Free → Premium conversion.
- Employer job publication completion.
- Job source ingestion success rate.

Metrics must be used for product validation rather than vanity reporting.

---

## 11. Release Plan

### Phase 1 — Functional MVP

- Next.js/Supabase foundation.
- Auth.
- Profile/CV.
- Manual jobs.
- Job listing/detail.
- Basic Gemini cover-letter generation.
- Cover-letter storage.

### Phase 2 — Feature Enrichment

- Automated job ingestion.
- Advanced filtering.
- Bookmark.
- Alerts.
- Rich editor.
- PDF/DOCX.
- Dashboard polish.
- Landing-page polish.

### Phase 3 — SaaS & Production Hardening

- Billing.
- Employer role/dashboard.
- Admin dashboard.
- SEO.
- Rate limiting.
- Security hardening.
- Monitoring.
- Production deployment.

### Phase 4 — Post-MVP

- More job sources.
- AI job recommendations.
- Expanded analytics.
- Deeper multilingual support.
- More employer capabilities.
