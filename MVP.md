## BLUEPRINT LENGKAP - AI JOB PORTAL "ANTI RIBET"

### Executive Summary

**Nama Produk:** Lokers.biz.id - AI Job Portal "Anti Ribet"  
**Tagline:** "Temukan Lowongan, Buat Lamaran dalam Hitungan Detik"  
**Konsep Utama:** Platform agregasi lowongan kerja dengan AI-Tailored Cover Letter Generator. Menggabungkan pencarian lowongan terpusat, profil kandidat terstruktur, dan generasi surat lamaran otomatis berbasis AI.

**Tujuan:** Menyediakan pengalaman melamar kerja yang efisien, hemat waktu, dan personal. Pengguna dapat menemukan lowongan yang relevan dan menghasilkan cover letter yang disesuaikan dengan profil dan deskripsi pekerjaan dalam satu klik.

**Target Pengguna:**
- **Job Seeker:** Individu pencari kerja.
- **Employer:** Perusahaan atau perekrut yang memasang lowongan.
- **Admin:** Pengelola platform.

**Model Bisnis (SaaS-Ready):**
- Gratis: Akses terbatas (misal 3 cover letter/bulan).
- Premium: Unlimited cover letter, fitur lanjutan (job alert, bookmark, dll.) dengan biaya bulanan/tahunan.
- Employer: Paket berbayar untuk memasang lowongan, fitur branding, dan analitik.

---

### 1. Fitur-Fitur Inti (Core Features)

#### 1.1 Autentikasi & Manajemen User
- Registrasi dengan email dan password.
- Social login: Google dan LinkedIn.
- Verifikasi email (opsional, dapat diaktifkan).
- Reset password.
- Update profil.

#### 1.2 Manajemen Profil & CV
- **Input Profil Manual:** Form dengan field terstruktur: Nama lengkap, email, nomor telepon, lokasi, headline profesional, ringkasan, pengalaman kerja (perusahaan, posisi, tanggal, deskripsi), pendidikan (institusi, gelar, jurusan, tanggal), skill (daftar tag), bahasa, sertifikasi, portofolio/link.
- **Upload PDF CV:** User mengunggah file PDF. Backend mengekstrak teks menggunakan library PDF parser (misal pdf-parse di Node.js). Teks mentah dikirim ke Gemini API dengan prompt khusus untuk mengekstrak data terstruktur (JSON) yang kemudian diisi ke form secara otomatis untuk ditinjau dan diedit.
- **Multiple CV:** User dapat menyimpan beberapa versi CV (misal untuk bidang berbeda). Pilih CV mana yang digunakan untuk generating cover letter.
- **Privasi:** CV hanya dapat dilihat oleh pemiliknya dan tidak ditampilkan ke publik.

#### 1.3 Pencarian dan Browsing Lowongan
- **Daftar Lowongan:** Halaman utama menampilkan lowongan terbaru.
- **Filter Lanjutan:** Lokasi (kota/negara), kategori/job title, tipe pekerjaan (full-time, part-time, contract, remote), rentang gaji, perusahaan, tanggal posting.
- **Pencarian Teks:** Pencarian berdasarkan kata kunci.
- **Detail Lowongan:** Menampilkan deskripsi lengkap, persyaratan, info perusahaan, tombol "Buat Surat Lamaran", tombol "Simpan/Bookmark", tombol bagikan.
- **Sumber Lowongan:** Data dari hasil scraping otomatis, API pihak ketiga, dan input manual oleh admin/employer.

#### 1.4 AI-Tailored Cover Letter Generator
- **Tombol Aksi:** Pada halaman detail lowongan, user menekan tombol "Buat Surat Lamaran".
- **Proses Backend:**
  1. Ambil data CV user (yang dipilih) dan deskripsi lowongan.
  2. Format prompt dengan instruksi profesional.
  3. Kirim ke Gemini API (model 1.5 Flash).
  4. Terima teks cover letter.
- **Output:** Tampilkan hasil di halaman editor.
- **Editor Teks:** Rich text editor sederhana (bold, italic, underline, bullet list, alignment) untuk memungkinkan user mengedit.
- **Regenerasi:** Tombol "Generate Ulang" untuk mendapatkan variasi baru (bisa dengan seed/randomness).
- **Download:** Ekspor ke PDF dan DOCX.
- **Salin:** Tombol copy-to-clipboard.
- **Riwayat:** Semua cover letter yang pernah dibuat disimpan di database dan dapat diakses di dashboard user.

#### 1.5 Manajemen Lowongan oleh Employer/Admin
- **Employer/Admin Dashboard:** CRUD lowongan.
- **Employer:** Dapat memasang lowongan (jika memiliki akses), melihat statistik pelamar? (Karena tidak ada fitur apply langsung, mungkin hanya jumlah view/cover letter generated). Dapat mengedit/menghapus lowongan sendiri.
- **Admin:** Mengelola semua lowongan, menyetujui lowongan employer (jika moderasi diperlukan), mengelola user, mengelola scraping.

#### 1.6 Fitur Tambahan (SaaS-Ready)
- **Job Alert:** User dapat membuat alert berdasarkan kriteria tertentu (kata kunci, lokasi). Sistem mengirim email notifikasi ketika lowongan baru cocok (frekuensi harian).
- **Bookmark:** Simpan lowongan favorit.
- **Dashboard User:** Ringkasan: jumlah lowongan dilihat, cover letter dibuat, lowongan disimpan, statistik penggunaan.
- **Integrasi Share:** Tombol bagikan ke LinkedIn, X/Twitter, WhatsApp, Facebook.
- **Multi-tenancy:** Struktur data memisahkan data per user/employer. Setiap employer memiliki ruang sendiri.
- **Billing & Subscription:** Integrasi dengan payment gateway (misal Stripe/Midtrans). Paket berlangganan untuk job seeker premium dan employer. Manajemen langganan, invoice, pembatalan.

#### 1.7 Fitur Backend/Admin
- **Manajemen User:** Lihat daftar user, nonaktifkan/hapus.
- **Manajemen Lowongan:** Approve/reject, edit, hapus.
- **Manajemen Scraping:** Trigger manual scraping, jadwal cron, log scraping.
- **Pengaturan Global:** Tarif langganan, batas fitur, teks notifikasi.

---

### 2. Arsitektur Sistem

#### 2.1 Frontend (Next.js App Router)
- **Framework:** Next.js 14+ (App Router) dengan React 18/19, TypeScript.
- **Styling:** Tailwind CSS dengan custom design system (glassmorphism, gradient, responsif).
- **State Management:** React Context + SWR/React Query untuk data fetching. Zustand untuk state global ringan (misal auth, UI).
- **UI Components:** Shadcn/ui atau Headless UI dengan custom styling.
- **Form Handling:** React Hook Form + Zod validation.
- **Animation:** Framer Motion untuk transisi halus.
- **Internationalization:** next-intl atau i18next untuk dukungan bilingual (ID/EN).
- **Accessibility:** Semantic HTML, aria labels, keyboard navigation, focus management.
- **SEO:** Next.js metadata API, server components untuk SSR/SSG, sitemap, robots.txt, Open Graph.

#### 2.2 Backend API (Next.js API Routes / Route Handlers)
- **API Routes:** Berada di dalam Next.js untuk kecepatan pengembangan, tetapi dapat dipisah jika diperlukan.
- **Autentikasi:** Supabase Auth (dengan adaptasi untuk Next.js). Middleware untuk proteksi route.
- **Rate Limiting:** Custom rate limiter menggunakan Redis (Upstash) atau in-memory untuk API yang sensitif (misal cover letter generator).
- **PDF Parsing:** Library `pdf-parse` untuk ekstrak teks dari PDF.
- **AI Integration:** Menggunakan Google Generative AI SDK untuk Node.js. Semua panggilan ke Gemini dilakukan di sisi server.
- **File Storage:** Supabase Storage untuk menyimpan hasil download sementara (atau langsung generate di server dan kirim).
- **Email Service:** Resend atau SendGrid untuk notifikasi job alert dan verifikasi.

#### 2.3 Database (Supabase)
- **Database:** PostgreSQL (via Supabase).
- **Auth:** Supabase Auth (built-in) dengan provider email/password, Google, LinkedIn.
- **Row Level Security (RLS):** Aktif pada semua tabel. Kebijakan akses berdasarkan user ID dan role.
- **Realtime:** Tidak diperlukan untuk MVP, tetapi Supabase Realtime dapat digunakan untuk pembaruan lowongan real-time di masa depan.

#### 2.4 Scraping Engine
- **JobSpy (Python):** Untuk LinkedIn, Indeed. Dijalankan sebagai serverless function (misal di AWS Lambda, atau GitHub Actions).
- **API Pihak Ketiga:** Glints (jika tersedia API publik atau menggunakan scraping ringan). JobStreet mungkin menggunakan scraping dengan Crawlee.
- **Crawlee (Node.js):** Untuk website dinamis jika diperlukan.
- **Arsitektur Scraping:**
  - Cron job terjadwal (misal setiap 6 jam) menggunakan GitHub Actions atau Vercel Cron.
  - Proses scraping menghasilkan data JSON yang kemudian dimasukkan ke Supabase melalui REST API atau langsung ke database.
  - Log scraping disimpan untuk monitoring.
  - Proxies dan rate limiting diimplementasikan untuk menghindari blokir.
- **Penyimpanan Lowongan:** Tabel `jobs` di Supabase. Sumber scraping diidentifikasi dengan field `source`.

#### 2.5 Deployment
- **Frontend + API:** Vercel (dengan Next.js).
- **Database & Auth:** Supabase Cloud (free tier awal).
- **VPS (opsional):** Ubuntu Server dengan Nginx untuk layanan tambahan seperti scraping worker atau cron jobs, atau sebagai reverse proxy jika diperlukan. Domain lokers.biz.id diarahkan ke Vercel atau VPS.
- **CI/CD:** GitHub Actions untuk menjalankan scraping terjadwal dan deployment otomatis ke Vercel.

---

### 3. Desain Database (Supabase PostgreSQL)

#### 3.1 Tabel `profiles`
Menyimpan data profil user (baik job seeker maupun employer).
- `id` UUID PK (references auth.users.id)
- `email` text
- `full_name` text
- `avatar_url` text
- `role` text enum: 'job_seeker', 'employer', 'admin'
- `headline` text (job seeker)
- `summary` text
- `location` text
- `phone` text
- `created_at` timestamptz
- `updated_at` timestamptz

#### 3.2 Tabel `cvs`
Menyimpan data CV terstruktur milik job seeker.
- `id` UUID PK
- `user_id` UUID FK -> profiles.id
- `name` text (nama CV, misal "CV - Software Engineer")
- `is_primary` boolean
- `data` jsonb (berisi seluruh data terstruktur: pengalaman, pendidikan, skill, dll.)
- `raw_text` text (teks mentah dari PDF)
- `created_at`, `updated_at`

#### 3.3 Tabel `jobs`
Menyimpan data lowongan pekerjaan.
- `id` UUID PK
- `source` text (misal 'linkedin', 'indeed', 'glints', 'manual', 'employer')
- `source_id` text (ID unik dari sumber, jika ada)
- `title` text
- `company_name` text
- `company_logo_url` text
- `location` text
- `job_type` text (full-time, part-time, contract, internship, remote)
- `salary_min` numeric
- `salary_max` numeric
- `salary_currency` text
- `description` text
- `requirements` text
- `posted_date` date
- `apply_url` text (link ke sumber asli)
- `is_active` boolean (default true)
- `created_by` UUID FK -> profiles.id (jika employer/admin input manual)
- `created_at`, `updated_at`
- Full-text search index pada `title` dan `description`.

#### 3.4 Tabel `cover_letters`
Menyimpan cover letter yang dihasilkan.
- `id` UUID PK
- `user_id` UUID FK -> profiles.id
- `job_id` UUID FK -> jobs.id
- `cv_id` UUID FK -> cvs.id (opsional, untuk referensi CV yang digunakan)
- `content` text (isi cover letter)
- `created_at` timestamptz
- `updated_at`

#### 3.5 Tabel `bookmarks`
Menyimpan lowongan yang disimpan user.
- `id` UUID PK
- `user_id` UUID FK -> profiles.id
- `job_id` UUID FK -> jobs.id
- `created_at` timestamptz
- Unique constraint (user_id, job_id)

#### 3.6 Tabel `job_alerts`
Menyimpan preferensi alert user.
- `id` UUID PK
- `user_id` UUID FK -> profiles.id
- `keyword` text
- `location` text
- `job_type` text
- `frequency` text enum: 'daily', 'weekly'
- `is_active` boolean
- `created_at`, `updated_at`

#### 3.7 Tabel `subscriptions` (SaaS)
Menyimpan langganan user/employer.
- `id` UUID PK
- `user_id` UUID FK -> profiles.id
- `plan_id` text (misal 'free', 'job_seeker_premium', 'employer_basic', 'employer_pro')
- `status` text enum: 'active', 'canceled', 'past_due'
- `current_period_start` timestamptz
- `current_period_end` timestamptz
- `payment_provider` text (misal 'stripe')
- `provider_subscription_id` text
- `created_at`, `updated_at`

#### 3.8 Tabel `scraping_logs`
Menyimpan log aktivitas scraping.
- `id` UUID PK
- `source` text
- `status` text enum: 'success', 'failed', 'partial'
- `jobs_found` integer
- `error_message` text
- `started_at` timestamptz
- `finished_at` timestamptz

#### 3.9 Tabel `audit_logs` (opsional)
Untuk keperluan keamanan dan debugging.
- `id` UUID PK
- `user_id` UUID
- `action` text
- `entity` text
- `entity_id` UUID
- `metadata` jsonb
- `created_at` timestamptz

#### 3.10 Tabel `feature_flags` (opsional)
Untuk mengontrol fitur secara dinamis.

#### 3.11 Row Level Security (RLS) Policies
- `profiles`: User hanya bisa read/update data sendiri. Admin bisa read all.
- `cvs`: User hanya bisa CRUD milik sendiri.
- `jobs`: Public read (jika is_active=true). Employer/admin bisa insert/update/delete (dengan policy).
- `cover_letters`: User hanya bisa read/update/delete milik sendiri.
- `bookmarks`, `job_alerts`: User hanya bisa CRUD milik sendiri.
- `subscriptions`: User hanya bisa read milik sendiri. Admin full.

---

### 4. API Routes / Endpoints

#### 4.1 Autentikasi
- `POST /api/auth/register` - Registrasi dengan email/password.
- `POST /api/auth/login` - Login dengan email/password (bisa menggunakan Supabase Auth langsung).
- `POST /api/auth/logout`
- `GET /api/auth/session` - Ambil session.
- `POST /api/auth/reset-password`
- Social login dihandle oleh Supabase Auth (Google, LinkedIn) dengan callback ke frontend.

#### 4.2 Profil & CV
- `GET /api/profile` - Ambil profil user.
- `PUT /api/profile` - Update profil.
- `GET /api/cvs` - List CV user.
- `POST /api/cvs` - Create CV baru (dari form atau upload PDF).
- `POST /api/cvs/parse-pdf` - Upload PDF, ekstrak teks, kirim ke Gemini, return data terstruktur untuk pre-fill form.
- `GET /api/cvs/:id` - Detail CV.
- `PUT /api/cvs/:id` - Update CV.
- `DELETE /api/cvs/:id` - Hapus CV.

#### 4.3 Lowongan Pekerjaan
- `GET /api/jobs` - List lowongan dengan filter, pagination, search.
- `GET /api/jobs/:id` - Detail lowongan.
- `POST /api/jobs` - Create lowongan (employer/admin).
- `PUT /api/jobs/:id` - Update lowongan (employer/admin).
- `DELETE /api/jobs/:id` - Hapus lowongan (admin, employer own).
- `POST /api/jobs/scrape` - Trigger scraping manual (admin).

#### 4.4 Cover Letter Generator
- `POST /api/cover-letter/generate` - Generate cover letter. Body: `{ jobId, cvId }`. Response: `{ coverLetterId, content }`.
- `GET /api/cover-letters` - List riwayat cover letter user.
- `GET /api/cover-letters/:id` - Detail cover letter.
- `PUT /api/cover-letters/:id` - Update cover letter (edit konten).
- `DELETE /api/cover-letters/:id` - Hapus cover letter.
- `POST /api/cover-letters/:id/regenerate` - Regenerate ulang.
- `GET /api/cover-letters/:id/download?format=pdf|docx` - Download file.

#### 4.5 Bookmark & Job Alert
- `GET /api/bookmarks` - List bookmark user.
- `POST /api/bookmarks` - Tambah bookmark.
- `DELETE /api/bookmarks/:jobId` - Hapus bookmark.
- `GET /api/job-alerts` - List alert.
- `POST /api/job-alerts` - Buat alert.
- `PUT /api/job-alerts/:id` - Update alert.
- `DELETE /api/job-alerts/:id` - Hapus alert.

#### 4.6 Subscription & Billing (SaaS)
- `GET /api/subscription` - Info langganan user.
- `POST /api/subscription/checkout` - Membuat checkout session Stripe.
- `POST /api/webhooks/stripe` - Webhook untuk update status langganan.

#### 4.7 Admin
- `GET /api/admin/users` - List users.
- `GET /api/admin/jobs` - List semua jobs.
- `GET /api/admin/scraping-logs` - List scraping logs.

---

### 5. Frontend Structure (Pages & Components)

#### 5.1 Halaman
- `/` - Landing page: hero, fitur, CTA, lowongan terbaru.
- `/jobs` - Listing lowongan dengan filter.
- `/jobs/[id]` - Detail lowongan.
- `/login` - Login.
- `/register` - Registrasi.
- `/dashboard` - Dashboard user (job seeker): statistik, link ke CV, cover letters, bookmarks, alerts.
- `/dashboard/cvs` - Manajemen CV.
- `/dashboard/cvs/new` - Buat CV baru (form + upload PDF).
- `/dashboard/cvs/[id]/edit` - Edit CV.
- `/dashboard/cover-letters` - Riwayat cover letter.
- `/dashboard/cover-letters/[id]` - Editor cover letter (lihat/edit/download).
- `/dashboard/bookmarks` - Lowongan tersimpan.
- `/dashboard/job-alerts` - Pengaturan job alert.
- `/dashboard/settings` - Pengaturan profil dan langganan.
- `/employer` - Dashboard employer (kelola lowongan, statistik).
- `/employer/jobs` - List lowongan employer.
- `/employer/jobs/new` - Posting lowongan baru.
- `/admin` - Dashboard admin.
- `/admin/users`, `/admin/jobs`, `/admin/scraping`, `/admin/settings`.

#### 5.2 Komponen Utama
- `Navbar` - Navigasi utama dengan toggle bahasa, user menu.
- `Footer` - Link, info.
- `JobCard` - Kartu lowongan untuk list.
- `JobFilters` - Sidebar filter.
- `CoverLetterEditor` - Rich text editor.
- `PDFUploader` - Dropzone untuk upload PDF.
- `CVForm` - Form CV dinamis (array pengalaman, pendidikan, skill).
- `LoadingSpinner`, `ErrorBoundary`, `ToastNotification`.
- `SubscriptionPricing` - Halaman harga.

---

### 6. AI Integration dan Prompting

#### 6.1 Ekstraksi Data CV dari PDF
- **Input:** Teks mentah hasil `pdf-parse`.
- **Prompt:**
  ```
  Kamu adalah sistem ekstraksi data CV. Dari teks berikut, ekstrak informasi ke dalam JSON dengan field: full_name, email, phone, location, headline, summary, work_experience (array of {company, position, start_date, end_date, description}), education (array of {institution, degree, field, start_date, end_date}), skills (array of string), languages, certifications.
  Teks CV: [teks mentah]
  ```
- **Output:** JSON yang diparsing dan dikembalikan ke frontend.

#### 6.2 Cover Letter Generation
- **Model:** Gemini 1.5 Flash.
- **Prompt Template:**
  ```
  Kamu adalah konsultan karier profesional dengan 20 tahun pengalaman. Tugasmu menulis surat lamaran kerja yang natural, profesional, dan meyakinkan. Gunakan data CV kandidat dan deskripsi pekerjaan berikut untuk menyesuaikan surat. Jangan mengarang fakta atau pengalaman yang tidak ada di CV. Gunakan bahasa yang sesuai dengan bahasa lowongan (Indonesia atau Inggris). Tulis dengan gaya yang hangat namun formal.

  Data CV Kandidat:
  [JSON CV]

  Deskripsi Pekerjaan:
  [Job description]

  Buat surat lamaran dengan struktur: pembukaan, isi (kaitkan pengalaman dan skill dengan kebutuhan pekerjaan), penutup. Panjang sekitar 300-400 kata.
  ```
- **Parameter:** temperature 0.7, top_p 0.9, max output tokens 1024.

#### 6.3 Regeneration
- Menggunakan parameter `seed` atau menambahkan instruksi "Buat variasi berbeda dari surat sebelumnya" untuk menghasilkan variasi.

---

### 7. Scraping System Detail

#### 7.1 Sumber Scraping
- **LinkedIn:** Menggunakan JobSpy (Python). JobSpy menyediakan antarmuka untuk mengambil lowongan dari LinkedIn tanpa API resmi.
- **Indeed:** JobSpy juga mendukung Indeed.
- **Glints:** Jika tersedia API publik, gunakan API. Jika tidak, gunakan Crawlee (Node.js) untuk scraping halaman web.
- **JobStreet:** Scraping dengan Crawlee atau headless browser (Playwright) karena dinamis.
- **Admin Manual:** Admin dapat memasukkan lowongan secara manual melalui dashboard.

#### 7.2 Arsitektur Scraping
- **GitHub Actions Workflow:** 
  - Schedule: setiap 6 jam (`cron: '0 */6 * * *'`).
  - Job: Checkout repo, setup Python (untuk JobSpy) atau Node (untuk Crawlee), jalankan script scraping, hasil disimpan dalam file JSON.
  - Kemudian script mengirim data ke Supabase melalui REST API (menggunakan service role key) atau menggunakan Supabase Python/JS client.
  - Log disimpan di tabel `scraping_logs`.
- **Proxies:** Menggunakan daftar proxy gratis/berbayar dan rotasi untuk menghindari rate limit.
- **Rate Limiting:** Delay antar request (misal 2-5 detik), jumlah request per sesi.
- **Data Normalisasi:** Script scraping memetakan field ke struktur tabel `jobs`.
- **Deduplikasi:** Periksa `source_id` untuk menghindari duplikat.

#### 7.3 Manual Trigger
- Admin dapat memanggil endpoint `/api/jobs/scrape` yang akan menjalankan scraping synchronous (atau asynchronous via queue) untuk sumber tertentu.

---

### 8. Autentikasi, Otorisasi, dan Multi-Tenancy

#### 8.1 Autentikasi
- Menggunakan Supabase Auth.
- Provider: Email/Password, Google OAuth, LinkedIn OAuth.
- Setelah login, user diarahkan untuk melengkapi profil (role: job_seeker/employer).
- Session management menggunakan cookie (Supabase SSR) untuk keamanan.

#### 8.2 Otorisasi
- Role-based access control (RBAC) dengan middleware.
- Role: `job_seeker`, `employer`, `admin`.
- Admin dapat mengakses semua resource.
- Employer hanya dapat mengelola lowongan yang mereka buat.
- Job seeker hanya dapat mengelola data pribadi (CV, cover letters, bookmarks, alerts).
- API route memeriksa role dan kepemilikan resource (misal user hanya bisa update cover letter miliknya).

#### 8.3 Multi-Tenancy
- **Job Seeker:** Data terisolasi per user melalui RLS dan foreign key.
- **Employer:** Setiap employer memiliki data lowongan terpisah. Tidak ada saling melihat data antar employer.
- **Subscription:** Tabel subscriptions mengikat plan ke user/employer. Fitur tertentu di-gate berdasarkan plan (misal limit cover letter per bulan untuk free user).

---

### 9. Subscription dan Billing (SaaS-Ready)

#### 9.1 Paket
- **Free (Job Seeker):** 3 cover letter per bulan, bookmark unlimited, dasar.
- **Premium Job Seeker:** Unlimited cover letter, download PDF/DOCX, job alert harian, riwayat panjang. Harga misal Rp 29.000/bulan.
- **Employer Basic:** Maksimal 5 lowongan aktif, branding dasar. Harga Rp 99.000/bulan.
- **Employer Pro:** Lowongan unlimited, analitik, prioritas tampil. Harga Rp 299.000/bulan.
- **Admin:** Tidak berbayar.

#### 9.2 Integrasi Payment Gateway
- **Pilihan:** Stripe (untuk pasar global) atau Midtrans (untuk Indonesia).
- Flow: User memilih paket -> redirect ke checkout Stripe -> payment success -> webhook update subscriptions table.
- Cancellation: User dapat cancel di dashboard.

#### 9.3 Enforcement
- Middleware atau helper function untuk cek status subscription dan limit fitur.
- Misal saat generate cover letter, cek jumlah yang sudah dibuat bulan ini (query cover_letters where created_at > start of month). Jika melebihi limit, return error 402.

---

### 10. SEO Strategy

- **Server-Side Rendering (SSR):** Halaman detail lowongan (`/jobs/[id]`) dirender di server sehingga konten terbaca search engine.
- **Metadata Dinamis:** Title, description, Open Graph, Twitter Card berdasarkan data lowongan.
- **Sitemap.xml:** Generate otomatis dari database lowongan aktif.
- **Robots.txt:** Izinkan crawling halaman publik.
- **Structured Data (JSON-LD):** JobPosting schema untuk setiap lowongan untuk rich snippet di Google.
- **Canonical URL:** Untuk menghindari duplikat.
- **Optimasi Gambar:** Next.js Image untuk lazy loading dan kompresi.
- **Bahasa:** Halaman juga menyediakan versi bahasa Inggris dengan path `/en/...` atau query.

---

### 11. Keamanan

- **Semua API key disimpan di environment variables.**
- **Row Level Security (RLS) aktif di Supabase.**
- **Rate Limiting:** 
  - Menggunakan library `rate-limiter-flexible` dengan Redis (Upstash) untuk limit endpoint seperti `/api/cover-letter/generate` (misal 10 request/menit per user).
  - Supabase juga memiliki rate limit bawaan.
- **Input Validation:** Semua input divalidasi dengan Zod.
- **Sanitasi HTML:** Saat menyimpan cover letter (rich text) gunakan sanitizer (misal DOMPurify di server) untuk mencegah XSS.
- **HTTPS:** Vercel dan Supabase menyediakan SSL.
- **CORS:** Hanya izinkan origin frontend.
- **CSRF:** Supabase Auth menangani CSRF token.
- **File Upload:** Batasi ukuran PDF (misal 5MB), tipe file dicek.
- **Logging:** Simpan log aksi penting.

---

### 12. Performa dan Responsivitas

- **Next.js Image Optimization:** Menggunakan komponen `next/image` untuk gambar.
- **Code Splitting:** Otomatis oleh Next.js.
- **Caching:** SWR untuk data yang sering berubah, cache static untuk halaman landing.
- **Database Index:** Indeks pada kolom yang sering difilter (jobs: location, job_type, posted_date).
- **Pagination:** Batasi hasil 20-50 per halaman.
- **Mobile-first:** Desain responsif menggunakan Tailwind breakpoints.
- **Lighthouse Target:** Skor > 90 untuk performance, accessibility, best practices, SEO.
- **CDN:** Vercel CDN untuk asset statis.

---

### 13. Aksesibilitas

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>`, `<button>`, `<input>`.
- Alt text untuk gambar.
- Keyboard navigasi: semua interaksi dapat dilakukan dengan keyboard.
- Focus states yang jelas.
- Kontras warna memenuhi WCAG AA.
- Form label dan error messages yang jelas.
- Skip link.

---

### 14. Internasionalisasi (i18n)

- **Bahasa:** Indonesia (default) dan Inggris.
- **Library:** `next-intl`.
- **Penyimpanan preferensi:** Cookie atau profil user.
- **Toggle switch** di navbar.
- Semua teks UI menggunakan file terjemahan JSON.

---

### 15. Fase Pengembangan (Timeline)

#### Fase 1: MVP Fungsional (Target 1 minggu)
- Setup proyek Next.js, Tailwind, Supabase.
- Implementasi autentikasi (email/password + Google/LinkedIn).
- Halaman profil dan form CV manual + upload PDF (parsing sederhana).
- Halaman lowongan (menggunakan data dummy/manual).
- Detail lowongan.
- Generasi cover letter sederhana (tanpa editor, output text biasa).
- Simpan cover letter ke database.

#### Fase 2: Pengayaan Fitur (2-3 minggu)
- Integrasi scraping otomatis (LinkedIn, Indeed).
- Filter pencarian lanjutan.
- Bookmark.
- Job alert (email).
- Rich text editor untuk cover letter.
- Download PDF/DOCX.
- Riwayat cover letter di dashboard.
- Landing page yang menarik.

#### Fase 3: SaaS-Ready dan Polishing (1-2 minggu)
- Implementasi billing (Stripe) dan subscription.
- Role employer + dashboard.
- Admin dashboard.
- Optimasi SEO (sitemap, JSON-LD).
- Rate limiting dan keamanan lanjutan.
- Pengujian dan perbaikan bug.
- Deploy ke production dengan domain lokers.biz.id.

#### Fase 4: Post-MVP
- Scraping sumber tambahan (Glints, JobStreet).
- Fitur rekomendasi pekerjaan berbasis AI.
- Multi-bahasa lengkap.
- Analitik employer.
- Integrasi sosial media lebih dalam.

---

### 16. DevOps & Deployment

#### 16.1 Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `DATABASE_URL` (jika perlu)
- `UPSTASH_REDIS_URL` (untuk rate limiting)
- `EMAIL_SERVICE_API_KEY` (Resend/SendGrid)
- `NEXT_PUBLIC_SITE_URL`

#### 16.2 Deployment Frontend (Vercel)
- Connect repository GitHub ke Vercel.
- Set environment variables.
- Deploy automatically on push to main.
- Custom domain: lokers.biz.id (A record ke Vercel).

#### 16.3 VPS (opsional untuk scraping)
- Gunakan Ubuntu 22.04.
- Install Node.js, Python, pm2.
- Jalankan cron jobs untuk scraping (atau gunakan GitHub Actions).
- Nginx sebagai reverse proxy jika ada layanan tambahan.

#### 16.4 CI/CD
- GitHub Actions untuk:
  - Linting dan testing sebelum merge.
  - Scraping terjadwal.
  - Deploy ke Vercel (atau Vercel Git integration otomatis).

#### 16.5 Monitoring
- Vercel Analytics untuk performa.
- Sentry untuk error tracking.
- Supabase dashboard untuk monitoring database.

---

### 17. Testing Strategy

- **Unit Testing:** Jest untuk utility functions.
- **Integration Testing:** Testing API routes dengan Supertest.
- **End-to-End Testing:** Playwright untuk alur kritis (registrasi, generate cover letter).
- **Manual Testing:** Sebelum rilis.

---

### 18. Ringkasan Perintah Teknologi

- Setup proyek: `npx create-next-app@latest lokers-biz-id --typescript --tailwind --app`
- Install dependencies: `npm install @supabase/supabase-js @supabase/ssr @google/generative-ai react-hook-form zod zustand swr framer-motion next-intl rate-limiter-flexible upstash-redis stripe pdf-parse docx pdfkit`
- Menjalankan dev: `npm run dev`
- Build: `npm run build`
- Deploy: push ke GitHub, Vercel auto-deploy.

---

### 19. Kesimpulan

Blueprint ini mencakup seluruh aspek yang diperlukan untuk membangun AI Job Portal "Anti Ribet" yang modern, SaaS-ready, dan sesuai dengan MVP yang telah dikonfirmasi. Dengan arsitektur yang jelas, fitur terstruktur, dan rencana pengembangan bertahap, proyek ini dapat dieksekusi secara efisien dalam waktu 1 minggu untuk MVP fungsional dan 4-6 minggu untuk versi SaaS lengkap.

Siap untuk memulai implementasi. Jika ada penyesuaian atau pertanyaan lebih lanjut, silakan beri tahu.