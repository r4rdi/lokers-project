---
name: lokers-scraping
description: >
  Skill modular untuk domain scraping Lokers.biz.id. Gunakan saat mengerjakan
  adapter sumber lowongan, JobSpy, Crawlee, Playwright, API Glints, normalisasi,
  deduplikasi, validasi, scraping_logs, scheduler GitHub Actions/Vercel Cron,
  manual trigger admin, rate limiting, dan operasional ingestion lowongan.
version: 1.0.0
tags:
  - scraping
  - jobspy
  - crawlee
  - playwright
  - supabase
  - jobs
  - ingestion
  - github-actions
  - vercel-cron
---

# SKILL.md — Lokers Scraping

## 1. Tujuan Skill

Skill ini memberi agen AI pengetahuan khusus untuk mengerjakan **domain scraping**
di Lokers.biz.id.

Domain scraping bertanggung jawab untuk:

- mengambil data lowongan dari sumber eksternal;
- menormalisasi data mentah ke struktur `jobs`;
- mendeteksi dan mencegah duplikasi;
- memvalidasi data sebelum masuk database;
- mencatat aktivitas ke `scraping_logs`;
- menyediakan manual trigger untuk admin;
- menjaga scraping tetap sopan, terisolasi, dan tidak merusak data manual.

Scraping bukan sumber kebenaran tunggal. Data lowongan bisa berasal dari:

1. scraping;
2. API pihak ketiga;
3. input manual admin/employer.

---

## 2. Kapan Skill Ini Digunakan

Gunakan skill ini ketika:

- menambah adapter sumber baru;
- mengubah normalisasi field lowongan;
- memperbaiki deduplikasi;
- membuat atau mengubah `scraping_logs`;
- mengerjakan scheduler cron;
- membuat endpoint manual trigger admin;
- menangani kegagalan scraping per source;
- melakukan review rate limiting dan legal/operational scraping.

Jangan gunakan skill ini untuk:

- mengubah desain UI umum;
- mengubah subscription;
- mengubah AI cover letter;
- mengubah RLS di luar tabel `jobs` dan `scraping_logs`.

---

## 3. Sumber Kebenaran

Baca dokumen berikut sebelum coding:

| Dokumen | Bagian yang relevan |
|---|---|
| `ARCHITECTURE.md` | Domain `scraping`, alur ingestion, failure handling |
| `PRD.md` | FR terkait job discovery, admin scraping, sumber data |
| `MVP.md` | Target platform, JobSpy, Crawlee, API Glints |
| `PRODUCTION.md` | Scraping operations, jadwal, monitoring, security |
| `Lokers_AI_Konfirmasi_Blueprint.md` | Prioritas sumber dan keputusan scraping |

Prioritas:

1. `ARCHITECTURE.md` untuk batas domain dan alur.
2. `PRODUCTION.md` untuk aturan operasional dan keamanan.
3. `PRD.md` untuk requirement produk.
4. `MVP.md` untuk urutan implementasi.

Jika ada konflik, jangan berasumsi. Tandai sebagai TBD dan tanyakan.

---

## 4. Prinsip Wajib

1. **Adapter pattern**  
   Setiap sumber punya adapter sendiri. Jangan mencampur logika LinkedIn ke adapter Indeed.

2. **Satu source gagal tidak memblokir source lain**  
   Kegagalan LinkedIn tidak boleh menghentikan Indeed, Glints, atau JobStreet.

3. **Normalisasi terpisah dari pengambilan data**  
   Adapter menghasilkan raw record. Normalizer mengubah ke bentuk `jobs`.

4. **Deduplikasi dengan `source + source_id`**  
   Jika `source_id` tidak tersedia, gunakan fallback hash yang stabil.

5. **Validasi sebelum insert**  
   Gunakan Zod atau validator internal sebelum menulis ke Supabase.

6. **Logging wajib**  
   Setiap run harus menghasilkan catatan di `scraping_logs`.

7. **Rate limiting sopan**  
   Gunakan delay, batas request, dan rotasi yang wajar.

8. **Hormati terms dan akses**  
   Jangan bypass autentikasi, access control, atau proteksi yang berlaku.

9. **Isolasi credential**  
   Credential scraping hanya di server/worker. Jangan pernah ke browser.

10. **Jangan menimpa data manual**  
    Data yang dibuat admin/employer tidak boleh digantikan diam-diam oleh scraping.

---

## 5. Arsitektur Domain Scraping

```text
Scheduler / Manual Trigger
        ↓
Scraping Orchestrator
        ↓
┌─────────────────────────────────────┐
│ Adapter Registry                    │
│ - LinkedIn Adapter / JobSpy         │
│ - Indeed Adapter / JobSpy           │
│ - Glints Adapter / API              │
│ - JobStreet Adapter / Crawlee       │
│ - Playwright jika diperlukan        │
└─────────────────────────────────────┘
        ↓
Raw Records
        ↓
Normalization
        ↓
Deduplication
        ↓
Validation
        ↓
Supabase `jobs`
        ↓
`scraping_logs`
```

Orchestrator hanya mengatur urutan. Detail sumber ada di adapter.

---

## 6. Target Platform dan Prioritas

Prioritas sumber:

1. LinkedIn — JobSpy.
2. Indeed — JobSpy.
3. Glints — API jika tersedia; jika tidak, Crawlee.
4. JobStreet — Crawlee atau Playwright.

Aturan:

- LinkedIn dan Indeed adalah prioritas utama.
- Glints dan JobStreet dikembangkan bertahap.
- Jika API resmi tersedia, utamakan API.
- Jika tidak ada API resmi, gunakan scraping ringan yang sopan.
- Jangan membuat adapter yang bergantung pada bypass login.

---

## 7. Struktur Modul Scraping

Di dalam project, domain scraping sebaiknya berada di:

```text
src/domains/scraping/
├── adapters/
│   ├── linkedin.adapter.ts
│   ├── indeed.adapter.ts
│   ├── glints.adapter.ts
│   ├── jobstreet.adapter.ts
│   └── index.ts
├── normalizers/
│   ├── job.normalizer.ts
│   └── index.ts
├── validators/
│   ├── job.schema.ts
│   └── scraping-log.schema.ts
├── services/
│   ├── orchestrator.service.ts
│   ├── deduplication.service.ts
│   ├── ingestion.service.ts
│   └── manual-trigger.service.ts
├── types.ts
└── index.ts
```

Script worker/scraper yang berjalan di luar Next.js:

```text
scripts/scraping/
├── jobspy/
│   ├── linkedin.py
│   ├── indeed.py
│   └── requirements.txt
├── crawlee/
│   ├── glints.ts
│   └── jobstreet.ts
├── run.ts
└── README.md
```

---

## 8. Kontrak Adapter

Setiap adapter harus memiliki kontrak yang konsisten.

Contoh tipe:

```ts
export type RawJobRecord = {
  source: string;
  sourceId?: string;
  title: string;
  companyName?: string;
  companyLogoUrl?: string;
  location?: string;
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  description?: string;
  requirements?: string;
  postedDate?: string;
  applyUrl?: string;
  raw: unknown;
};

export type ScrapingAdapter = {
  source: string;
  fetchJobs(input: ScrapingInput): Promise<RawJobRecord[]>;
};
```

Aturan:

- `fetchJobs` tidak boleh menulis ke database.
- `fetchJobs` hanya mengambil dan mengembalikan raw record.
- Error harus dilempar dengan pesan yang aman.
- Jangan log credential.

---

## 9. Alur Ingestion

```text
1. Tentukan source
2. Jalankan adapter
3. Kumpulkan raw records
4. Normalisasi field
5. Validasi dengan Zod
6. Deduplikasi
7. Insert/update Supabase
8. Catat scraping_logs
9. Kembalikan ringkasan
```

Ringkasan minimal:

```ts
type ScrapingResult = {
  source: string;
  status: "success" | "failed" | "partial";
  jobsFound: number;
  jobsInserted: number;
  jobsUpdated: number;
  jobsSkipped: number;
  errorMessage?: string;
  startedAt: string;
  finishedAt: string;
};
```

---

## 10. Normalisasi

Field yang wajib dinormalisasi:

- `source`
- `source_id`
- `title`
- `company_name`
- `company_logo_url`
- `location`
- `job_type`
- `salary_min`
- `salary_max`
- `salary_currency`
- `description`
- `requirements`
- `posted_date`
- `apply_url`
- `is_active`

Aturan:

- `job_type` harus dipetakan ke nilai yang konsisten:
  `full-time`, `part-time`, `contract`, `internship`, `remote`.
- Gaji harus angka, bukan string.
- Tanggal harus format ISO atau `YYYY-MM-DD`.
- `description` dan `requirements` harus dibersihkan dari HTML berbahaya.
- Jangan simpan field mentah kecuali diperlukan untuk audit.

---

## 11. Deduplikasi

Prioritas deduplikasi:

1. `source + source_id`.
2. Jika tidak ada, hash stabil dari:
   - `title`;
   - `company_name`;
   - `location`;
   - `apply_url`.

Aturan:

- Jangan insert jika sudah ada.
- Update hanya field yang aman.
- Jangan menimpa data manual.
- Jangan menghapus lowongan lama hanya karena tidak muncul di run berikutnya.
- Lowongan yang hilang bisa ditandai `is_active = false` setelah beberapa run.

---

## 12. Validasi

Gunakan Zod.

Contoh:

```ts
export const jobIngestionSchema = z.object({
  source: z.string().min(1),
  sourceId: z.string().optional(),
  title: z.string().min(1),
  companyName: z.string().optional(),
  location: z.string().optional(),
  jobType: z.enum([
    "full-time",
    "part-time",
    "contract",
    "internship",
    "remote",
  ]).optional(),
  salaryMin: z.number().nonnegative().optional(),
  salaryMax: z.number().nonnegative().optional(),
  salaryCurrency: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  postedDate: z.string().optional(),
  applyUrl: z.string().url().optional(),
});
```

Data invalid:

- jangan insert;
- catat sebagai skip;
- jangan gagalkan seluruh run jika hanya satu record invalid.

---

## 13. Scheduling

Default schedule dari dokumen produksi:

```text
0 */6 * * *
```

Artinya setiap 6 jam.

Opsi implementasi:

- GitHub Actions.
- Vercel Cron.
- VPS cron jika worker terpisah.

Aturan:

- Scheduler memanggil orchestrator, bukan adapter langsung.
- Scheduler harus bisa dijalankan manual.
- Scheduler harus mencatat log.
- Jangan menjalankan scraping terlalu agresif.
- Gunakan jitter jika perlu.

---

## 14. Manual Trigger Admin

Endpoint:

```text
POST /api/jobs/scrape
```

Aturan:

- Hanya admin.
- Wajib auth dan authorization.
- Wajib rate limit.
- Bisa menerima parameter `source`.
- Bisa synchronous untuk sumber kecil.
- Untuk proses berat, gunakan queue/background.
- Kembalikan `ApiResponse<ScrapingResult>`.

Jangan biarkan endpoint ini bisa dipanggil publik.

---

## 15. Logging dan Observability

Tabel `scraping_logs`:

- `id`
- `source`
- `status`
- `jobs_found`
- `error_message`
- `started_at`
- `finished_at`

Yang harus dicatat:

- source;
- status success/failed/partial;
- jumlah lowongan ditemukan;
- jumlah insert/update/skip;
- error message yang aman;
- durasi.

Jangan log:

- credential;
- token;
- cookie;
- data pribadi yang tidak perlu.

Monitoring yang disarankan:

- scraping failure berulang;
- duplicate rate;
- jumlah jobs found per source;
- durasi run;
- partial run.

---

## 16. Failure Handling

Setiap source harus terisolasi.

Aturan:

- Jika LinkedIn gagal, Indeed tetap jalan.
- Jika satu record invalid, skip record itu.
- Jika database insert gagal, catat error.
- Jika rate limit terkena, backoff.
- Jika source memblokir, hentikan source itu untuk run tersebut.
- Jangan retry tanpa batas.
- Retry hanya untuk error yang aman di-retry.

Status:

- `success` — semua berjalan baik.
- `partial` — sebagian source/record gagal.
- `failed` — source utama gagal total.

---

## 17. Rate Limiting dan Etika Scraping

Wajib:

- delay antar request;
- batas request per sesi;
- rotasi user agent jika perlu;
- hormati robots dan terms yang berlaku;
- jangan bypass login/access control;
- jangan mengambil data pribadi yang tidak perlu;
- isolasi credential;
- gunakan proxy hanya sesuai kebijakan yang sah.

Larangan:

- brute force;
- bypass captcha;
- mengambil data privat;
- membebani server sumber;
- menyamarkan aktivitas sebagai serangan.

---

## 18. Environment Variables

Contoh:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SCRAPING_USER_AGENT
SCRAPING_PROXY_URL
JOBSPY_API_KEY
GLINTS_API_KEY
```

Aturan:

- Jangan pernah expose ke browser.
- Jangan commit ke Git.
- Gunakan secret manager.
- Pisahkan credential per source.

---

## 19. Testing

Minimal:

- unit test normalizer;
- unit test deduplication;
- unit test validator;
- integration test orchestrator dengan adapter mock;
- test failure isolation;
- test manual trigger authorization;
- test `scraping_logs` tercatat.

Jangan test scraping ke situs produksi secara agresif.

Gunakan fixture raw record.

---

## 20. Anti-Pattern

Jangan lakukan:

- menaruh logika scraping di route handler;
- menulis ke database langsung dari adapter;
- mencampur normalisasi dan fetching;
- mengabaikan `source_id`;
- menimpa data manual;
- menggagalkan semua source karena satu source gagal;
- log credential;
- menjalankan scraping tanpa rate limit;
- bypass login/captcha;
- menganggap scraping selalu boleh secara legal;
- membuat endpoint manual trigger tanpa admin check.

---

## 21. Definisi Selesai

Sebuah task scraping selesai jika:

- adapter mengikuti kontrak;
- normalisasi konsisten;
- deduplikasi bekerja;
- validasi berjalan;
- `scraping_logs` tercatat;
- failure terisolasi;
- rate limiting diterapkan;
- manual trigger aman;
- test tersedia;
- dokumentasi diperbarui;
- tidak ada secret terekspos.

---

## 22. Format Output Agen

Saat menyelesaikan task scraping, laporkan:

1. Ringkasan perubahan.
2. File yang disentuh.
3. Source yang terpengaruh.
4. Perubahan schema/migration jika ada.
5. Environment variable baru.
6. Test yang dijalankan.
7. Risiko legal/operasional.
8. Bagian yang belum diuji.