# Konfirmasi Blueprint Lokers AI

Dokumen ini berisi jawaban dan keputusan yang telah dikonfirmasi untuk menjadi dasar penyusunan blueprint final project **Lokers AI**.

---

## A. Input Data CV

### 1. Metode input CV user
**Jawaban:** Keduanya — form manual + upload PDF.

Sistem menyediakan:
- Form manual berbasis web.
- Upload CV dalam format PDF.
- Sistem melakukan parsing CV PDF.
- Hasil ekstraksi digunakan untuk **pre-fill form** agar user dapat memeriksa dan mengedit data sebelum disimpan.

### 2. Metode parsing PDF
**Jawaban:** Menggunakan AI/LLM untuk ekstraksi data CV.

Alur yang dipilih:
1. Sistem menerima file PDF CV.
2. Teks mentah diekstrak dari PDF.
3. Teks dikirim ke Gemini.
4. Gemini menstrukturisasi informasi CV ke dalam format data terstruktur.
5. Data hasil ekstraksi digunakan untuk mengisi form CV secara otomatis.
6. User dapat melakukan koreksi sebelum data disimpan.

---

## B. Ruang Lingkup MVP vs Produk Penuh

### 3. Scope blueprint
**Jawaban:** MVP + fitur-fitur SaaS-ready.

Blueprint tidak hanya berfokus pada functional MVP, tetapi juga menyiapkan fondasi untuk pengembangan SaaS, termasuk:
- Multi-tenancy.
- Subscription.
- Billing.
- Struktur role dan permission.
- Skalabilitas arsitektur.

Fitur SaaS yang kompleks dapat diimplementasikan secara bertahap setelah MVP functional selesai.

### 4. Autentikasi dan manajemen user
**Jawaban:** Kombinasi:
- Registrasi/login menggunakan email + password.
- Social login menggunakan Google.
- Social login menggunakan LinkedIn.

### 5. Role user
**Jawaban:** Tiga role utama:
- **Job Seeker** — mencari lowongan, membuat CV, dan membuat cover letter.
- **Employer** — membuat dan mengelola lowongan pekerjaan.
- **Admin** — mengelola platform, lowongan, user, scraping, dan moderasi.

---

## C. Data Lowongan Pekerjaan

### 6. Sumber data lowongan
**Jawaban:** Kombinasi scraping + API + input manual.

Strategi sumber data:
- **JobSpy** untuk scraping LinkedIn dan Indeed.
- **API** untuk sumber seperti Glints.
- **Input manual oleh Admin** untuk sumber lain yang belum memiliki integrasi scraping/API.

Pendekatan hybrid ini dipilih agar cakupan data lebih luas sekaligus memberikan fallback ketika suatu sumber tidak dapat diakses melalui scraping/API.

### 7. Frekuensi update data
**Jawaban:** Setiap beberapa jam + manual trigger oleh Admin.

Mekanisme:
- Scheduled update secara berkala.
- Admin dapat menjalankan scraping/update secara manual.
- Sistem dapat menggunakan cron-based execution.

---

## D. AI Cover Letter Generator

### 8. Model Gemini
**Jawaban:** Gemini 1.5 Flash untuk MVP.

Alasan:
- Cepat.
- Relatif hemat biaya.
- Cukup untuk kebutuhan generasi cover letter MVP.

Arsitektur AI sebaiknya dibuat configurable sehingga model dapat diganti/di-upgrade ke model yang lebih kuat seperti Gemini Pro pada tahap berikutnya.

### 9. Output cover letter
**Jawaban:** Teks + PDF + DOCX + regenerasi.

Fitur:
- Generate cover letter.
- Edit hasil.
- Copy teks.
- Download PDF.
- Download DOCX.
- Re-generate untuk mendapatkan alternatif hasil.

### 10. Editor setelah generate
**Jawaban:** Ya.

Cover letter dapat diedit menggunakan **rich text editor sederhana** sebelum:
- Dicopy.
- Di-download sebagai PDF.
- Di-download sebagai DOCX.
- Disimpan ke riwayat.

---

## E. Desain & UX

### 11. Tema visual
**Jawaban:** Modern dengan gradient dan glassmorphism.

Identitas visual:
- Hitam.
- Putih.
- Biru.
- Merah.
- Elemen transparan.
- Gradient modern.
- Glassmorphism.

Desain tetap harus menjaga keterbacaan, kontras, dan usability agar efek visual tidak mengganggu fungsi utama aplikasi.

### 12. Bahasa antarmuka
**Jawaban:** Bilingual — Indonesia + Inggris.

Sistem menyediakan:
- Bahasa Indonesia.
- Bahasa Inggris.
- Toggle switch untuk mengganti bahasa.

Struktur i18n sebaiknya disiapkan sejak awal agar penambahan bahasa di masa depan tidak memerlukan perubahan besar pada frontend.

### 13. Prioritas UX
**Jawaban:** Semua di atas.

Prioritas:
1. Kecepatan loading halaman.
2. Animasi dan transisi yang halus.
3. Kemudahan navigasi.
4. Mobile-first responsiveness.

Prinsip utama: visual modern tidak boleh mengorbankan performance dan usability.

---

## F. Infrastruktur & Deployment

### 14. Supabase
**Jawaban:** Supabase Cloud.

Tahap awal:
- Menggunakan Free Tier.
- Upgrade ke paid tier ketika kebutuhan resource meningkat.

Supabase digunakan untuk kebutuhan seperti:
- PostgreSQL database.
- Authentication.
- Storage.
- Row Level Security.
- Data aplikasi.

### 15. Server deployment
**Jawaban:** Vercel + server API terpisah.

Arsitektur:
- **Frontend:** Vercel.
- **API/backend:** VPS dengan Ubuntu + Nginx.
- Service backend berjalan pada server terpisah dari frontend.

Pemisahan ini memberikan fleksibilitas untuk API, scraping, processing, dan scaling.

### 16. Domain dan SSL
**Jawaban:** Sudah memiliki domain:

**lokers.biz.id**

Domain digunakan sebagai domain utama project dan perlu dikonfigurasi dengan SSL/HTTPS.

---

## G. Scraping Engine

### 17. Execution scraping
**Jawaban:** Serverless function / cron-based.

Pilihan implementasi:
- Vercel Cron Jobs.
- GitHub Actions.

Scraping dijalankan secara terjadwal dan dapat dipadukan dengan manual trigger dari Admin.

### 18. Target platform scraping
**Prioritas:**
1. LinkedIn.
2. Indeed.
3. Glints.
4. JobStreet.

Prioritas utama adalah LinkedIn, kemudian sumber lain dikembangkan secara bertahap.

---

## H. SEO & Marketing

### 19. Prioritas SEO
**Jawaban:** Cukup penting — optimasi dasar.

MVP akan mencakup:
- Meta tags.
- Sitemap.
- robots.txt.
- Open Graph.
- Struktur halaman yang SEO-friendly.

SEO tidak menjadi penghambat utama functional MVP, tetapi fondasinya disiapkan sejak awal.

### 20. Fitur tambahan MVP
Fitur yang dipilih:

- **Job alert / notifikasi email.**
- **Bookmark / simpan lowongan favorit.**
- **Riwayat cover letter.**
- **Dashboard user dengan statistik.**
- **Filter pencarian lanjutan:**
  - Lokasi.
  - Gaji.
  - Tipe kerja.
  - Tanggal posting.
- **Integrasi share ke media sosial.**

Fitur-fitur tersebut tetap perlu diprioritaskan berdasarkan tingkat kepentingan agar target MVP functional 1 minggu tetap realistis.

---

## I. Keamanan & Aksesibilitas

### 21. Standar aksesibilitas
**Jawaban:** Dasar.

Implementasi minimal:
- Semantic HTML.
- Alt text.
- Keyboard navigation.
- Struktur heading yang baik.
- Form dengan label yang jelas.

### 22. Rate limiting dan proteksi API
**Jawaban:** Kombinasi:
- Custom rate limiting pada API route.
- Supabase built-in rate limiting.

Rate limiting terutama diperlukan untuk endpoint yang berhubungan dengan:
- AI generation.
- Authentication.
- Job search.
- Scraping trigger.
- Upload/processing CV.
- API yang berpotensi mahal atau disalahgunakan.

---

## J. Fase Pengembangan

### 23. Urutan pengembangan
**Jawaban:** Prototype cepat dulu, lalu iterasi.

Strategi:
1. Membuat prototype functional.
2. Memastikan core user flow dapat berjalan.
3. Melakukan testing.
4. Memperbaiki UX/UI.
5. Menambahkan optimasi.
6. Mengembangkan fitur SaaS-ready secara bertahap.

### 24. Target timeline
**Jawaban:** **1 minggu untuk MVP functional.**

Target awal adalah menghasilkan versi yang benar-benar dapat digunakan dalam waktu 1 minggu.

Setelah MVP functional selesai, tahap berikutnya adalah:
- Refinement UI/UX.
- Optimasi performance.
- Hardening keamanan.
- Penyempurnaan AI.
- Pengembangan fitur SaaS.
- Testing dan deployment production.

---

# Ringkasan Keputusan Teknis

| Area | Keputusan |
|---|---|
| Input CV | Form manual + upload PDF |
| CV Parsing | PDF text extraction + Gemini |
| Scope | MVP + SaaS-ready |
| Auth | Email/password + Google + LinkedIn |
| Roles | Job Seeker + Employer + Admin |
| Job Data | Scraping + API + Admin input |
| Scraping | JobSpy + API |
| Update Job | Periodik + manual Admin trigger |
| AI Model | Gemini 1.5 Flash |
| Cover Letter | Text + PDF + DOCX + regenerate |
| Editor | Rich text editor |
| UI | Gradient + glassmorphism |
| Color | Black + white + blue + red |
| Language | Indonesia + English |
| UX | Performance + animation + navigation + mobile |
| Database | Supabase Cloud |
| Frontend | Vercel |
| Backend/API | VPS Ubuntu + Nginx |
| Domain | lokers.biz.id |
| Cron | Vercel Cron / GitHub Actions |
| Scraping Priority | LinkedIn → Indeed → Glints → JobStreet |
| SEO | Basic SEO |
| Notifications | Email job alerts |
| Saved Jobs | Bookmark |
| History | Cover letter history |
| Dashboard | User statistics |
| Search | Advanced filters |
| Sharing | Social media integration |
| Accessibility | Basic accessibility |
| API Security | Custom rate limiting + Supabase |
| Development | Prototype → Iterate |
| MVP Target | 1 minggu |

---

# Target MVP Functional

Dengan keputusan di atas, MVP functional Lokers AI ditargetkan memiliki core flow:

```text
User
  ↓
Register / Login
  ↓
Create Profile
  ↓
Input CV
  ├── Manual Form
  └── Upload PDF → AI Parsing → Pre-fill Form
  ↓
Search Jobs
  ├── LinkedIn
  ├── Indeed
  ├── Glints
  └── JobStreet
  ↓
Filter & View Job Detail
  ↓
Save / Bookmark Job
  ↓
Generate AI Cover Letter
  ↓
Edit Cover Letter
  ↓
Regenerate (Optional)
  ↓
Download PDF / DOCX
  ↓
Save to History
```

Untuk role Employer:

```text
Employer
  ↓
Login
  ↓
Employer Dashboard
  ↓
Create Job Vacancy
  ↓
Manage Job Posting
  ↓
Monitor Vacancy
```

Untuk Admin:

```text
Admin
  ↓
Admin Dashboard
  ↓
Manage Users
  ↓
Manage Jobs
  ↓
Trigger Scraping
  ↓
Monitor Job Data
  ↓
Manage Platform
```

---

# Prinsip Arsitektur

Blueprint final sebaiknya menggunakan prinsip berikut:

1. **MVP-first, SaaS-ready architecture**  
   Core feature dibuat sesederhana mungkin untuk mencapai target 1 minggu, tetapi struktur database dan API tidak dibuat buntu terhadap pengembangan SaaS.

2. **Modular AI layer**  
   Provider/model AI dibuat mudah diganti sehingga Gemini 1.5 Flash dapat ditingkatkan ke model yang lebih kuat tanpa merombak seluruh aplikasi.

3. **Hybrid job ingestion**  
   Data lowongan berasal dari kombinasi scraping, API, dan input Admin.

4. **Separation of concerns**  
   Frontend, API, database, AI processing, dan scraping memiliki tanggung jawab yang jelas.

5. **Security by default**  
   Authentication, authorization, RLS, validation, rate limiting, dan proteksi endpoint diterapkan sejak awal.

6. **Performance-first UX**  
   Glassmorphism dan animasi digunakan secara terkontrol agar tidak mengorbankan loading speed.

7. **Mobile-first**  
   UI harus tetap nyaman digunakan pada perangkat mobile maupun desktop.

8. **Internationalization-ready**  
   Sistem dibangun dengan dukungan ID/EN sejak awal.

9. **Incremental development**  
   Tidak semua fitur harus selesai sempurna dalam 1 minggu. Prioritas pertama adalah core flow yang functional, kemudian refinement dan fitur lanjutan.

---

# Kesimpulan

Konfigurasi yang telah dikonfirmasi menetapkan **Lokers AI** sebagai platform job-search dan career assistance yang menggabungkan:

- Job aggregation.
- AI CV parsing.
- AI cover letter generation.
- Job matching/search.
- Bookmark dan job alert.
- Dashboard pengguna.
- Employer job posting.
- Admin management.
- Fondasi SaaS-ready.
- Bilingual interface.
- Modern glassmorphism UI.

Prioritas pengembangan adalah **mencapai MVP functional dalam 1 minggu**, kemudian melakukan iterasi untuk meningkatkan kualitas UI/UX, performa, keamanan, akurasi AI, dan kesiapan SaaS.

Dokumen ini dapat digunakan sebagai **source of truth** untuk menyusun blueprint teknis, arsitektur sistem, database schema, API specification, folder structure, user flow, development roadmap, dan implementation plan Lokers AI berikutnya.
