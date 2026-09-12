"""# Minimum Viable Product (MVP) - AI Job Portal "Anti Ribet"

## 1. Konsep Utama
Platform agregasi lowongan kerja dengan fitur **"AI-Tailored Cover Letter Generator"**. Sistem ini memfasilitasi pencari kerja dengan mengumpulkan lowongan dari berbagai sumber secara terpusat, lalu menyediakan tombol instan untuk merumuskan surat lamaran (Cover Letter). Surat lamaran ini dikustomisasi secara spesifik berdasarkan kecocokan antara profil kandidat dan deskripsi pekerjaan. Pendekatan ini sangat efisien, hemat biaya infrastruktur server, dan memastikan pengguna memiliki kontrol penuh untuk mereviu lamarannya sebelum dikirimkan secara mandiri.

## 2. Alur Kerja User (User Flow)
1.  **Registrasi & Profiling:** User mendaftar ke portal dan memberikan data diri. (Metode input CV: *TBD - Form manual atau ekstraksi PDF*).
2.  **Browsing Pekerjaan:** User mencari lowongan yang dikumpulkan (hasil scraping) di platform.
3.  **Aksi "Buat Surat Lamaran":** Pada halaman detail pekerjaan, user menekan tombol untuk menyusun surat lamaran.
4.  **Generasi AI (Backend):** Sistem memproses data CV user dan Job Description menggunakan LLM untuk menghasilkan surat lamaran yang tajam dan relevan.
5.  **Output & Review:** Surat lamaran ditampilkan di antarmuka web. User dapat menyalin (copy) teks atau mengunduhnya (download PDF) untuk dikirim bersama lamaran secara mandiri.

## 3. Arsitektur & Teknologi

### A. Frontend (Antarmuka Pengguna)
*   **Teknologi:** Vite React.
*   **Fungsi Utama:**
    *   Menampilkan daftar pekerjaan.
    *   Mengelola *state* (loading, error, success) saat pemrosesan pembuatan surat lamaran.
    *   Menampilkan hasil teks dari AI secara instan.

### B. AI Engine & Prompting
*   **Model:** Gemini API.
*   **Prototyping Tools:** Google AI Studio (untuk tuning prompt).
*   **Struktur Prompting (Contoh):**
    *   **Peran:** Konsultan karier profesional.
    *   **Instruksi:** Menulis surat lamaran kerja yang natural dan profesional, mencocokkan CV dengan kriteria pekerjaan. Dilarang mengarang fakta (halusinasi).
    *   **Input Data:** Teks CV User + Deskripsi Lowongan Pekerjaan.

### C. Web Scraping (Pengumpul Data Lowongan)
*   **Agregator Lowongan (LinkedIn, dsb):** `JobSpy` (Python).
*   **Website Dinamis (Glints, dsb):** `Crawlee` (Node.js/Python).
*   **Sosial Media (X/Twitter & Instagram) - Sistem Fallback Bertingkat:**
    *   **Level 1 (Utama - API-based):** `twscrape` (X/Twitter) dan `instagrapi` (Instagram) untuk pengambilan data cepat dan efisien.
    *   **Level 2 (Cadangan - Browser Automation):** `Playwright` (Python) + `playwright-stealth` sebagai fallback otomatis jika library Level 1 terblokir atau mengalami kendala karena pembaruan platform.
    *   **Facebook:** `facebook-scraper` (Python).
*   *Catatan Operasional:* Membutuhkan manajemen *proxy* (residential/mobile), manajemen sesi/cookie akun tumbal (*burner account*), dan *rate limiting* untuk menjaga kelancaran ekstraksi data.


### D. Server & Deployment (Arsitektur Hybrid)
*   **Frontend & AI Backend:** Hosted di **Vercel** (menggunakan Serverless Functions untuk hemat biaya dan kemudahan deployment).
*   **Database:** **Supabase** atau **Neon (PostgreSQL)** sebagai jembatan penyimpanan data terpusat.
*   **Scraper Engine:** Hosted di **VPS Ubuntu** murah atau **Railway/Render** untuk menjalankan script scraper (Python/Playwright) secara berkala (cron) tanpa terkena limitasi timeout Vercel.
*   **Keamanan:** API Key Gemini dan kredensial database disimpan secara aman di Environment Variables dan hanya diakses di sisi server.

## 4. Langkah Selanjutnya (Action Items)
1.  **Definisi Input CV:** Memutuskan mekanisme bagaimana user menginput data diri (Form manual berbasis web atau ekstraksi otomatis dari file PDF).
2.  **Pembuatan Prototipe Prompt:** Mengembangkan prompt di Google AI Studio dan mengujinya dengan berbagai sampel Job Description.
3.  **Setup Scraper:** Mengonfigurasi library JobSpy untuk menarik sampel data lowongan dalam jumlah kecil sebagai data awal.
"""