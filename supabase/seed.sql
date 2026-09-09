-- ===========================
-- Supabase Seed Data
-- ===========================

-- 1. Insert 2 Dummy Users (Admin & Employer) - Note: auth.users insert isn't possible directly via SQL easily due to password hashing, 
-- so we'll just insert jobs without created_by for now (or let the scraping engine do it). 
-- In MVP, jobs created by 'admin' or without created_by (NULL) are shown to everyone.

INSERT INTO public.jobs (title, company_name, location, job_type, salary_min, salary_max, salary_currency, description, requirements, source, source_id, is_active) VALUES
('Senior Frontend Engineer', 'Tech Innovators', 'Jakarta', 'full-time', 15000000, 25000000, 'IDR', 'Kami mencari Senior Frontend Engineer yang ahli dalam React dan Next.js.', 'Pengalaman 3+ tahun dengan React. Familiar dengan TailwindCSS.', 'linkedin', 'li-001', true),
('UI/UX Designer', 'Creative Studio', 'Bandung', 'full-time', 8000000, 15000000, 'IDR', 'Desainer UI/UX dengan mata tajam untuk detail dan user experience.', 'Menguasai Figma. Portfolio UI yang kuat.', 'jobstreet', 'js-002', true),
('Data Scientist', 'DataCorp Indonesia', 'Jakarta', 'remote', 20000000, 35000000, 'IDR', 'Bergabunglah dengan tim Data kami untuk membangun model machine learning yang akan merevolusi industri.', 'Python, TensorFlow, SQL, Pengalaman 4 tahun.', 'indeed', 'in-003', true),
('Backend Developer (Node.js)', 'SaaS Startup', 'Remote', 'contract', 10000000, 18000000, 'IDR', 'Dibutuhkan developer backend untuk durasi kontrak 6 bulan.', 'Node.js, Express, PostgreSQL.', 'glints', 'gl-004', true),
('Marketing Manager', 'Brandify', 'Surabaya', 'full-time', 12000000, 20000000, 'IDR', 'Memimpin divisi marketing untuk campaign digital terbaru.', 'Pengalaman manajerial marketing min 3 tahun.', 'linkedin', 'li-005', true),
('Digital Marketing Specialist', 'E-commerce Nusantara', 'Jakarta', 'full-time', 6000000, 10000000, 'IDR', 'Mengelola iklan berbayar dan SEO website.', 'Google Ads, Facebook Ads, SEO.', 'manual', 'man-006', true),
('Fullstack Web Developer', 'DevHouse', 'Yogyakarta', 'part-time', 4000000, 8000000, 'IDR', 'Kerja remote paruh waktu untuk mengembangkan website klien.', 'Next.js, Tailwind, Supabase.', 'employer', 'emp-007', true),
('Product Manager', 'Fintech Indo', 'Jakarta', 'full-time', 25000000, 40000000, 'IDR', 'Membangun roadmap produk finansial untuk jutaan pengguna.', 'Pengalaman PM 5 tahun, paham industri fintech.', 'linkedin', 'li-008', true),
('Junior Mobile App Developer', 'App Factory', 'Bandung', 'full-time', 5000000, 8000000, 'IDR', 'Kami menerima fresh graduate untuk posisi ini!', 'Mengerti dasar-dasar Flutter atau React Native.', 'jobstreet', 'js-009', true),
('System Administrator', 'CloudTech', 'Jakarta', 'full-time', 9000000, 15000000, 'IDR', 'Mengelola server Linux dan cloud infrastruktur AWS.', 'AWS Certified, Linux, Bash Scripting.', 'indeed', 'in-010', true),
('Content Writer', 'Media Group', 'Bali', 'remote', 4000000, 7000000, 'IDR', 'Menulis artikel menarik untuk blog teknologi harian kami.', 'Kemampuan copywriting kuat, SEO basic.', 'glints', 'gl-011', true),
('HR Generalist', 'Corporate Corp', 'Jakarta', 'full-time', 8000000, 12000000, 'IDR', 'Menangani rekrutmen dan operasional HR sehari-hari.', 'Paham UU Ketenagakerjaan, komunikasi baik.', 'linkedin', 'li-012', true),
('Software QA Engineer', 'Test Lab', 'Surabaya', 'contract', 7000000, 11000000, 'IDR', 'Melakukan manual dan automated testing.', 'Selenium, Cypress, Teliti.', 'indeed', 'in-013', true),
('Graphic Designer', 'Agency Kreatif', 'Yogyakarta', 'full-time', 5000000, 9000000, 'IDR', 'Mendesain aset visual untuk social media klien.', 'Adobe Illustrator, Photoshop, Kreatif.', 'jobstreet', 'js-014', true),
('Machine Learning Engineer', 'AI Startup', 'Jakarta', 'remote', 20000000, 30000000, 'IDR', 'Mendeploy model LLM ke production.', 'Python, PyTorch, Docker.', 'linkedin', 'li-015', true),
('Business Analyst', 'Consulting Firm', 'Jakarta', 'full-time', 10000000, 18000000, 'IDR', 'Menganalisis kebutuhan bisnis klien dan membuat laporan terstruktur.', 'Excel tingkat lanjut, kemampuan presentasi.', 'glints', 'gl-016', true),
('Customer Support Agent', 'SaaS Startup', 'Remote', 'part-time', 3000000, 5000000, 'IDR', 'Menjawab tiket dukungan pelanggan.', 'Empati tinggi, komunikasi lancar.', 'manual', 'man-017', true),
('DevOps Engineer', 'Tech Innovators', 'Jakarta', 'full-time', 18000000, 30000000, 'IDR', 'Menjaga keandalan sistem CI/CD dan Kubernetes.', 'Kubernetes, GitLab CI, Terraform.', 'linkedin', 'li-018', true),
('Social Media Specialist', 'Retail Company', 'Bandung', 'full-time', 5000000, 8000000, 'IDR', 'Mengelola akun Instagram dan TikTok perusahaan.', 'Kreatif, update tren sosmed.', 'indeed', 'in-019', true),
('Technical Writer', 'CloudTech', 'Remote', 'contract', 6000000, 10000000, 'IDR', 'Menulis dokumentasi API dan panduan pengguna.', 'Bahasa Inggris aktif, familiar dengan Markdown dan API.', 'glints', 'gl-020', true);
