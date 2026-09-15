# 🚀 OneApply AI — Next-Gen AI-Powered Job Portal

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black?logo=next.js)](https://nextjs.org/)
[![FastAPI / Python](https://img.shields.io/badge/Backend-FastAPI%20%2F%20Python-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![OpenAI / Claude](https://img.shields.io/badge/AI%20Engine-GPT--4o%20%2F%20Claude%203.5-412991?logo=openai)](https://openai.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20pgvector-336791?logo=postgresql)](https://www.postgresql.org/)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel%20%2F%20Docker-blue?logo=vercel)](https://vercel.com/)

**Revolusi Alur Melamar Kerja: "Upload Sekali → AI Racik CV & Cover Letter → 1-Klik Apply"**

[Demo Live](#-live-demo--preview) • [Fitur Utama](#-fitur-utama) • [Tech Stack](#-tech-stack) • [Panduan Instalasi](#-panduan-instalasi--menjalankan-lokal) • [Panduan Deploy](#-panduan-deployment) • [Kontribusi](#-kontribusi)

</div>

---

## 📌 Daftar Isi
1. [Tentang Proyek](#-tentang-proyek)
2. [Problem vs Solusi](#-problem-vs-solusi)
3. [Dampak Inovasi & Nilai Tambah](#-dampak-inovasi--nilai-tambah)
4. [Fitur Utama](#-fitur-utama)
5. [Alur Kerja Sistem (Workflow)](#-alur-kerja-sistem-workflow)
6. [Tech Stack](#-tech-stack)
7. [Panduan Instalasi & Menjalankan Lokal](#-panduan-instalasi--menjalankan-lokal)
8. [Konfigurasi Environment Variables](#-konfigurasi-environment-variables-env)
9. [Panduan Deployment](#-panduan-deployment)
10. [Model Bisnis & Monetisasi](#-model-bisnis--monetisasi)
11. [Roadmap Pengembangan](#-roadmap-pengembangan)
12. [Lisensi](#-lisensi)

---

## 💡 Tentang Proyek

**OneApply AI** adalah platform *job portal* cerdas berbasis Artificial Intelligence yang memangkas friksi terbesar dalam proses rekrutmen: **pekerjaan administratif repetitif bagi pelamar** dan **beban *screening* manual ribuan berkas acak-acakan bagi HRD**.

Dengan pendekatan **"Single Profile, Infinite Tailoring"**, pencari kerja hanya perlu mengunggah riwayat karir/data dasar satu kali. Sistem AI kami akan secara otomatis menganalisis deskripsi pekerjaan (Job Description) target, menyusun CV berstandar ATS (*Applicant Tracking System*), menulis *cover letter* yang hiper-personal, dan mengirimkan lamaran hanya dalam hitungan detik.

---

## 🎯 Problem vs Solusi

| Tantangan Saat Ini (Status Quo) | Solusi OneApply AI |
| :--- | :--- |
| **Burnout Pelamar**: Rata-rata pelamar menghabiskan 45–60 menit per lamaran hanya untuk utak-atik format CV dan nulis surat lamaran dari nol. | **1-Click AI Tailoring**: Otomatisasi pembuatan CV standar ATS dan surat lamaran relevan dalam < 10 detik. |
| **Form Repetitif**: Mengisi data identik berulang kali di berbagai form rekrutmen. | **Single Master Profile**: Cukup sekali upload, AI yang mendistribusikan data ke format standar. |
| **HRD Kewalahan**: Menerima ratusan CV format acak, typo, dan tidak relevan yang memperlambat seleksi awal. | **Standardized & Pre-Scored Dossier**: HR menerima berkas terstruktur rapi + ringkasan kecocokan kompetensi dari AI. |
| **Biaya Rekrutmen Membengkak**: Waktu *time-to-hire* lama dan mahal akibat beban *screening* manual. | **Screening Terakselerasi**: HRD menghemat waktu screening hingga 70% dengan ringkasan kandidat yang tajam. |

---

## 🌟 Dampak Inovasi & Nilai Tambah

### 👤 Bagi Pencari Kerja (*Job Seekers*)
- ⏱️ **Hemat Waktu Hingga 80%**: Tidak ada lagi waktu terbuang untuk penyesuaian format berkas manual.
- 🧘 **Bebas Stres Administratif**: Fokus penuh dialihkan ke persiapan wawancara (*interview prep*) dan peningkatan skill.
- 🎯 **ATS-Friendly Guarantee**: Format CV teroptimasi agar lolos filter sistem ATS perusahaan secara maksimal.

### 🏢 Bagi Perusahaan & Rekruter (*Employers*)
- 📋 **Format Dokumen Terstandarisasi**: Semua lamaran masuk dalam format baku yang bersih, memudahkan komparasi kandidat.
- ⚡ **Screening Cepat & Akurat**: Dilengkapi AI Match Score dan *executive summary* keahlian pelamar.
- 💰 **Efisiensi Biaya Operasional HR**: Mengurangi jam kerja non-produktif pada fase *top-of-funnel hiring*.

---

## ✨ Fitur Utama

### 1. 🧑‍💼 Modul Pencari Kerja
- **Smart Master Profile**: Upload CV lama atau isi form profil master sekali saja.
- **Dynamic ATS CV Generator**: AI menyesuaikan kata kunci (*keywords*), pengalaman, dan *action verbs* sesuai kualifikasi loker.
- **Contextual Cover Letter Engine**: Menghasilkan surat lamaran profesional dengan nada (*tone of voice*) yang pas dan kontekstual.
- **One-Click Instant Apply**: Lamar lowongan langsung tanpa pengisian ulang form yang bertele-tele.
- **Application Tracker**: Pantau status lamaran (Terkirim, Direview, Wawancara, Ditolak) secara real-time.

### 2. 🏢 Modul Perusahaan (Recruiter Hub)
- **Job Posting Wizard**: Buat lowongan kerja cepat dengan rekomendasi kualifikasi bertenaga AI.
- **Unified Candidate Inbox**: Dashboard terpusat untuk melihat berkas pelamar yang sudah terstandarisasi.
- **AI Relevance & Match Scoring**: Indikator persentase kecocokan profil kandidat dengan *job requirements*.
- **Quick Action & Scheduling**: Kirim undangan wawancara atau update status pelamar dalam satu platform.

### 3. 🧠 Modul AI Core & NLP
- **Deep Semantic Matching**: Membandingkan skill pelamar vs kebutuhan loker menggunakan *vector embeddings*.
- **Hallucination Prevention**: Memastikan AI hanya meracik fakta dari data riil pelamar tanpa mengada-ada pengalaman.

---

## 🔄 Alur Kerja Sistem (Workflow)

```mermaid
flowchart TD
    subgraph Pelamar
        A[Upload Data Dasar / CV Master] --> B[Pilih Lowongan Pekerjaan]
        B --> C[Klik 'Apply with AI']
    end

    subgraph AI Engine
        C --> D[Analisis Job Description]
        D --> E[Ekstraksi Keyword & Kualifikasi Kunci]
        A --> F[Cocokkan Data Pelamar]
        E & F --> G[Generate CV ATS-Friendly]
        E & F --> H[Generate Personalized Cover Letter]
    end

    subgraph Submit & Screening
        G & H --> I[1-Click Final Submission]
        I --> J[(Database Lamaran)]
        J --> K[Dashboard HRD / Perusahaan]
        K --> L[Review Berkas Rapi & Match Score]
    end
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React Server Components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons & Animations**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) / [TanStack Query](https://tanstack.com/query)

### Backend & API
- **API Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+) / Next.js Server Actions
- **ORM & Database**: [PostgreSQL](https://www.postgresql.org/) via [Prisma](https://www.prisma.io/) / [SQLAlchemy](https://www.sqlalchemy.org/)
- **Vector Search**: [pgvector](https://github.com/pgvector/pgvector) untuk pencocokan semantik CV & Loker
- **File Storage**: AWS S3 / Cloudflare R2 / Supabase Storage

### AI / LLM Integration
- **LLM Provider**: OpenAI GPT-4o / Anthropic Claude 3.5 Sonnet / Groq (Llama 3)
- **PDF Generation**: WeasyPrint / React-PDF / Puppeteer

### Payment & Monetization
- **Payment Gateway**: Midtrans / Xendit / Stripe (untuk sistem Pay-to-Post loker)

---

## 💻 Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (v18.x atau v20.x)
- [Python](https://www.python.org/) (v3.10+) *(jika menggunakan FastAPI backend terpisah)*
- [PostgreSQL](https://www.postgresql.org/) (v15+)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/username-anda/oneapply-ai.git
cd oneapply-ai
```

### 2. Setup Frontend & Dependensi
```bash
npm install
# atau
pnpm install
# atau
yarn install
```

### 3. Setup Backend (Opsional / Jika Backend Terpisah)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Di Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 4. Setup Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Jalankan Server Pengembangan (Local Dev)
```bash
npm run dev
```
Buka browser dan akses di `http://localhost:3000`.

---

## 🔐 Konfigurasi Environment Variables (`.env`)

Duplikasi file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Isi konfigurasi berikut:

```env
# APP
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# DATABASE
DATABASE_URL="postgresql://user:password@localhost:5432/oneapply_db?schema=public"

# AUTHENTICATION (NextAuth / Supabase / Clerk)
NEXTAUTH_SECRET="your-super-secret-jwt-key"
NEXTAUTH_URL="http://localhost:3000"

# AI PROVIDERS
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxx"
ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxxxxxxxxx"

# STORAGE (AWS S3 / Supabase / Cloudflare R2)
S3_BUCKET_NAME="oneapply-assets"
S3_REGION="ap-southeast-1"
S3_ACCESS_KEY_ID="your-access-key-id"
S3_SECRET_ACCESS_KEY="your-secret-access-key"

# PAYMENT GATEWAY (Midtrans / Xendit / Stripe)
PAYMENT_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxx"
NEXT_PUBLIC_PAYMENT_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxx"
```

---

## 🚢 Panduan Deployment

### Opsi A: Deploy ke Vercel (Rekomendasi Frontend & Fullstack)

1. Push repository Anda ke GitHub / GitLab.
2. Buka [Vercel Dashboard](https://vercel.com/new).
3. Import repository `oneapply-ai`.
4. Masukkan seluruh konfigurasi dari `.env.local` ke bagian **Environment Variables**.
5. Klik **Deploy**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

### Opsi B: Deploy Menggunakan Docker

Tersedia `Dockerfile` dan `docker-compose.yml` untuk kemudahan orkestrasi container:

```bash
# Build dan jalankan seluruh container (App + PostgreSQL)
docker compose up --build -d

# Periksa status log
docker compose logs -f
```

---

## 💰 Model Bisnis & Monetisasi

Platform ini menggunakan model **B2B Pay-to-Post & Premium Talent Solutions**:

1. **Pay-to-Post (Perusahaan)**:
   - Perusahaan membayar per postingan lowongan kerja (*per-listing* atau paket *bundling*).
   - Akses otomatis ke sistem standardisasi berkas dan scoring AI.
2. **Featured Job & Accelerated Reach**:
   - Biaya *add-on* agar loker tampil di urutan teratas dan dikirimkan ke kandidat ber-rating tertinggi.
3. **Gratis untuk Pencari Kerja (Freemium)**:
   - Fitur dasar lamar kerja bertenaga AI gratis untuk mendukung inklusivitas pencari kerja.
   - Opsi *Pro Tier* opsional (kuota AI CV revision tak terbatas, mock interview AI).

---

## 🗺️ Roadmap Pengembangan

- [x] **Fase 1**: Core Engine — Master Profile, ATS CV Tailoring & Contextual Cover Letter.
- [x] **Fase 2**: Recruiter Portal — Job Posting & Standardized Applicant Inbox.
- [ ] **Fase 3**: AI Video Screening & Smart Interview Preparation Assistant.
- [ ] **Fase 4**: Integrasi WhatsApp Notification untuk Jadwal Wawancara.
- [ ] **Fase 5**: Dukungan Multi-bahasa & Multi-regional (ID, EN, SEA).

---

## 🤝 Kontribusi

Kontribusi dari komunitas sangat terbuka! Jika Anda ingin berkontribusi:

1. **Fork** repository ini.
2. Buat feature branch baru: `git checkout -b feature/FiturKerenBaru`
3. Commit perubahan Anda: `git commit -m 'feat: Menambahkan fitur pencocokan AI baru'`
4. Push ke branch: `git push origin feature/FiturKerenBaru`
5. Ajukan **Pull Request (PR)**.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi [MIT License](LICENSE). Bebas digunakan, dikembangkan, dan dimodifikasi untuk tujuan komersial maupun non-komersial.

---

<div align="center">

Dibuat dengan ❤️ untuk merevolusi ekosistem pencarian kerja yang lebih manusiawi, cepat, dan cerdas.

**[Kembali ke Atas ⬆️](#-oneapply-ai--next-gen-ai-powered-job-portal)**

</div>