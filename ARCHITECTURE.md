\
# ARCHITECTURE.md — Lokers.biz.id

## 1. Architecture Goals

Lokers.biz.id uses a **modular monolith with clear domain boundaries** for the initial product.

The architecture prioritizes:

- fast MVP delivery;
- server-first rendering;
- strong data isolation;
- explicit domain services;
- easy migration of heavy workloads such as scraping and AI generation to workers later;
- testability;
- low operational complexity.

The system should not be prematurely split into microservices.

---

## 2. High-Level Architecture

```text
                         ┌─────────────────────┐
                         │      Browser        │
                         │ Desktop / Mobile Web│
                         └──────────┬──────────┘
                                    │ HTTPS
                                    ▼
                    ┌─────────────────────────────┐
                    │ Vercel / Next.js App Router │
                    │                             │
                    │ Pages + Server Components   │
                    │ Route Handlers / API         │
                    │ Middleware / RBAC            │
                    └───────┬─────────┬───────────┘
                            │         │
                ┌───────────┘         └───────────────┐
                ▼                                     ▼
      ┌──────────────────┐                   ┌──────────────────┐
      │ Supabase          │                   │ External Services│
      │ PostgreSQL        │                   │                  │
      │ Auth              │                   │ Gemini           │
      │ RLS               │                   │ Email            │
      │ Storage           │                   │ Payment           │
      └──────────────────┘                   │ Redis             │
                                              └──────────────────┘

                    Scheduled / Async Work
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
      GitHub Actions / Cron             Optional Worker/VPS
             │                                 │
             ▼                                 ▼
      Scraping orchestration          JobSpy / Crawlee / Playwright
             │
             └──────────────► Supabase
```

---

## 3. Architectural Style

### Modular Monolith

Use domain-oriented modules inside one Next.js deployment.

Recommended domains:

- `auth`
- `profiles`
- `cvs`
- `jobs`
- `cover-letters`
- `bookmarks`
- `job-alerts`
- `subscriptions`
- `scraping`
- `admin`

Each domain owns:
- validation;
- service functions;
- data access;
- domain types;
- relevant UI components.

Cross-domain dependencies must be explicit.

---

## 4. Frontend Architecture

### App Router

Public routes:

```text
/
 /jobs
 /jobs/[id]
 /pricing
```

Auth:

```text
/login
/register
```

Job seeker:

```text
/dashboard
/dashboard/cvs
/dashboard/cvs/new
/dashboard/cvs/[id]/edit
/dashboard/cover-letters
/dashboard/cover-letters/[id]
/dashboard/bookmarks
/dashboard/job-alerts
/dashboard/settings
```

Employer:

```text
/employer
/employer/jobs
/employer/jobs/new
/employer/jobs/[id]/edit
```

Admin:

```text
/admin
/admin/users
/admin/jobs
/admin/scraping
/admin/settings
```

### Rendering strategy

- Public job pages: Server Components + dynamic metadata.
- Landing page: mostly static/server-rendered.
- Dashboard shell: server-rendered.
- Interactive filters: Client Components.
- Rich editor: Client Component, dynamically loaded where useful.
- Admin tables: server-first with client controls only where necessary.

---

## 5. Domain Boundaries

### Jobs

Responsibilities:
- query/search/filter jobs;
- job detail;
- source normalization;
- publication status;
- ownership checks for employer-created jobs.

### CVs

Responsibilities:
- profile/CV data;
- PDF validation;
- parsing orchestration;
- AI extraction validation;
- CV version management.

### Cover Letters

Responsibilities:
- generation;
- usage limits;
- persistence;
- editing;
- regeneration;
- export.

### Subscriptions

Responsibilities:
- current plan;
- entitlements;
- usage limits;
- checkout;
- webhook synchronization.

### Scraping

Responsibilities:
- source adapters;
- normalization;
- deduplication;
- execution logs;
- scheduling.

---

## 6. Data Architecture

Core relationships:

```text
auth.users
    │
    └── 1:1 profiles
             │
             ├── 1:N cvs
             ├── 1:N cover_letters
             ├── 1:N bookmarks ─── N:1 jobs
             ├── 1:N job_alerts
             └── 1:N subscriptions

jobs
 ├── source/source_id
 ├── created_by → profiles
 └── 1:N cover_letters

scraping_logs
 └── records each ingestion run
```

### RLS

RLS policies are mandatory.

- Profiles: owner read/update; admin broad access.
- CVs: owner CRUD.
- Cover letters: owner CRUD.
- Bookmarks: owner CRUD.
- Job alerts: owner CRUD.
- Jobs: public read only for active jobs; employer owns write access to own records; admin full access.
- Subscriptions: owner read; server/admin management.
- Scraping logs: admin only.

---

## 7. API Architecture

All responses follow:

```ts
type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string;
};
```

Request pipeline:

```text
Request
  ↓
Authentication
  ↓
Authorization
  ↓
Zod validation
  ↓
Rate limiting (where applicable)
  ↓
Domain service
  ↓
Database / external provider
  ↓
Sanitized response
```

Never let route handlers contain large business algorithms.

---

## 8. AI Architecture

```text
Job Detail
   │
   ▼
Select CV
   │
   ▼
Server validation
   │
   ├── subscription/usage check
   ├── ownership check
   └── job availability check
   │
   ▼
Prompt Builder
   │
   ▼
Gemini API
   │
   ▼
Output validation
   │
   ▼
Persist cover_letters
   │
   ▼
Editor UI
```

AI prompt construction belongs in a server-only module.

The model output is untrusted input and must be validated before being treated as application data.

---

## 9. CV Parsing Architecture

```text
PDF Upload
   ↓
MIME + size validation
   ↓
pdf-parse
   ↓
Raw text
   ↓
Gemini structured extraction
   ↓
Zod validation
   ↓
Review UI
   ↓
User confirmation
   ↓
cvs table
```

Do not persist AI-extracted data as final truth until the user confirms it.

---

## 10. Scraping Architecture

Use source adapters.

```text
Scheduler
   ↓
Scraping Orchestrator
   ├── LinkedIn adapter / JobSpy
   ├── Indeed adapter / JobSpy
   ├── Glints adapter
   └── JobStreet adapter / Crawlee where appropriate
   ↓
Raw records
   ↓
Normalization
   ↓
Deduplication
   ↓
Validation
   ↓
Supabase jobs
   ↓
scraping_logs
```

Operational rules:
- respect applicable site terms and access restrictions;
- use reasonable rate limiting;
- avoid bypassing authentication/access controls;
- isolate scraping credentials;
- record failures;
- deduplicate using source + source ID where available.

---

## 11. Subscription Architecture

Entitlements are derived from plan state.

Example:

```text
FREE
- 3 cover letters/month
- unlimited bookmarks
- core discovery

PREMIUM
- unlimited cover letters
- PDF/DOCX export
- job alerts
- extended history

EMPLOYER BASIC
- up to 5 active jobs
- basic branding

EMPLOYER PRO
- unlimited jobs
- analytics
- priority visibility
```

The exact pricing is product-configurable.

Enforcement must happen server-side.

---

## 12. Security Architecture

### Trust boundaries

1. Browser → Next.js.
2. Next.js → Supabase.
3. Next.js → Gemini.
4. Next.js → payment provider.
5. Scheduled worker → Supabase.

Secrets must never cross into the browser.

### Security controls

- Supabase RLS.
- Secure session cookies.
- Zod validation.
- Rate limiting.
- File validation.
- HTML sanitization.
- HTTPS.
- Role and ownership checks.
- Audit logs for sensitive admin actions.

---

## 13. SEO Architecture

Public job detail pages should expose:

- dynamic title;
- meta description;
- canonical URL;
- Open Graph;
- Twitter card;
- JobPosting JSON-LD;
- sitemap inclusion for active jobs;
- robots directives.

Do not expose private dashboard routes to search engines.

---

## 14. Caching

Use caching selectively.

Good candidates:
- static marketing content;
- relatively stable public job queries;
- company metadata;
- reference data.

Do not cache:
- private CVs;
- private cover letters;
- subscription state;
- authorization-sensitive data.

Invalidate/revalidate job data after ingestion and publication changes.

---

## 15. Failure Handling

Every asynchronous operation must define:

- loading state;
- timeout behavior;
- retry policy where safe;
- user-friendly error;
- server-side log;
- fallback where possible.

AI generation failures should not delete existing cover letters.

Scraping failure should be isolated per source.

Payment webhook handling must be idempotent.

---

## 16. Observability

Recommended:
- Vercel Analytics.
- Sentry.
- Supabase monitoring.
- Structured application logs.

Track:
- API errors;
- AI latency/failure;
- scraping failures;
- payment webhook failures;
- authorization failures;
- unusual rate-limit events.

Never log secrets or unnecessary private CV contents.

---

## 17. Evolution Path

### MVP

Single Next.js application + Supabase + scheduled scraping.

### Growth

Introduce:
- queue for AI jobs;
- dedicated scraping worker;
- Redis-backed rate limiting;
- object storage;
- background email processing.

### Scale

Only split services when measurable operational bottlenecks justify it.

Potential future services:
- scraping worker;
- AI generation worker;
- notification service;
- analytics pipeline.

Avoid microservices before the product has a real scaling requirement.
