"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import IntegrationMarquee from "@/components/home/IntegrationMarquee";
import JobFilterBar from "@/components/jobs/JobFilterBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


// --- HERO SECTION ---
function HeroSection() {
  return (
    <section className="relative text-white overflow-x-clip pt-16 z-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0.9)_40%,_rgba(0,0,0,1)_80%)] z-[-1]" />

      <div className="container-max relative z-10 pt-4 pb-20 md:pt-18 md:pb-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/5 text-xs font-medium text-white/70 backdrop-blur-sm">
              Portal Pencarian Kerja
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-display text-white mb-4">
            Temukan Lowongan yang Sesuai
          </h1>

          {/* Subheading */}
          <p className="text-base text-white/70 mb-6 max-w-2xl mx-auto leading-relaxed">
            Daftarkan CV Anda sekali dan dapatkan surat lamaran yang
            disesuaikan untuk setiap posisi yang Anda inginkan.
          </p>

          <div className="mt-6 relative z-10">
            <JobFilterBar />
          </div>

          {/* As seen on */}
          <div className="mt-12 text-center">
            <p className="text-sm text-white/50 mb-4 font-medium tracking-wider">
              TERPERCAYA OLEH
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
              {/* LinkedIn */}
              <div className="flex items-center gap-1.5 text-white/60 hover:text-white/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="font-medium">LinkedIn</span>
              </div>

              {/* JobStreet */}
              <div className="flex items-center gap-1.5 text-white/60 hover:text-white/80 transition-colors">
                <span className="font-medium">JobStreet</span>
              </div>

              {/* Dealls */}
              <div className="flex items-center gap-1.5 text-white/60 hover:text-white/80 transition-colors">
                <span className="font-medium italic">Dealls</span>
              </div>

              {/* Glints */}
              <div className="flex items-center gap-1.5 text-white/60 hover:text-white/80 transition-colors">
                <span className="font-medium text-uppercase tracking-widest">GLINTS</span>
              </div>

              {/* Remotive */}
              <div className="flex items-center gap-1.5 text-white/60 hover:text-white/80 transition-colors">
                <span className="font-medium">Remotive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- FEATURES SECTION ---
const FEATURES = [
  {
    title: "Surat Lamaran Personalizada",
    description:
      "Buat surat lamaran yang sesuai dengan CV dan posisi yang Anda inginkan.",
    bgColor: "bg-surface-muted",
  },
  {
    title: "Ekstraksi CV Otomatis",
    description:
      "Upload PDF CV dan biarkan sistem mengekstrak informasi penting secara otomatis.",
    bgColor: "bg-surface-muted",
  },
  {
    title: "Pencarian yang Relevan",
    description:
      "Dapatkan rekomendasi lowongan yang sesuai dengan keterampilan dan pengalaman Anda.",
    bgColor: "bg-surface-muted",
  },
  {
    title: "Siap untuk ATS",
    description:
      "Format surat lamaran yang lolos sistem pelacakan lamaran kerja (ATS).",
    bgColor: "bg-surface-muted",
  },
];

function FeaturesSection() {
  return (
    <section className="py-16">
      <div className="container-content">
        <div className="text-center mb-8">
          <p className="text-label text-white/50 mb-2 uppercase tracking-wider text-sm">
            Fitur Utama
          </p>
          <h2 className="text-h2 text-ink mb-4">
            Kenapa Lokers?
          </h2>
          <p className="text-body text-text-muted max-w-xl mx-auto">
            Semua yang Anda butuhkan untuk melamar kerja, dalam satu platform yang sederhana dan efisien.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-surface rounded-lg border border-white/5 p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                {index === 0 && (
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m4-8c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm0 8c0 1.1.9 2 2 2s2-.9 2-2-1.1-2-2-2z" />
                  </svg>
                )}
                {index === 1 && (
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                {index === 2 && (
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15l-4-3-5 7-3-4-3 5" />
                  </svg>
                )}
                {index === 3 && (
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.029 9-11.622 0-1.533-.285-3.023-.754-4.162" />
                  </svg>
                )}
              </div>
              <h3 className="text-h3 text-ink mb-2">{feature.title}</h3>
              <p className="text-sm text-text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- HOW IT WORKS ---
const STEPS = [
  {
    step: "01",
    title: "UPLOAD",
    description: "Upload PDF CV Anda.",
  },
  {
    step: "02",
    title: "CARI",
    description: "Temukan lowongan yang sesuai dengan profil Anda.",
  },
  {
    step: "03",
    title: "BUAT",
    description: "Buat surat lamaran yang personal dan profesional.",
  },
  {
    step: "04",
    title: "KIRIM",
    description: "Download surat lamaran dan kirim ke perusahaan.",
  },
];

function HowItWorksSection() {
  return (
    <section className="py-16">
      <div className="container-content">
        <div className="text-center mb-6">
          <p className="text-label text-white/50 mb-2 uppercase tracking-wider text-sm">
            Cara Kerja
          </p>
          <h2 className="text-h2 text-ink mb-4">
            Cara Kerja Lokers
          </h2>
          <p className="text-body text-text-muted max-w-xl mx-auto">
            Proses yang biasanya memakan berjam-jam, kini selesai dalam hitungan menit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {STEPS.map((step) => (
            <div key={step.step}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                {step.step === "01" && (
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                {step.step === "02" && (
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15l-4-3-5 7-3-4-3 5" />
                  </svg>
                )}
                {step.step === "03" && (
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m4-8c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm0 8c0 1.1.9 2 2 2s2-.9 2-2-1.1-2-2-2z" />
                  </svg>
                )}
                {step.step === "04" && (
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
              <h3 className="text-h3 text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- PRICING SECTION ---
const PLANS = [
  {
    name: "Gratis",
    price: "Rp 0",
    period: "/selamanya",
    description: "Untuk mulai mencoba",
    features: [
      "3 surat lamaran per bulan",
      "Bookmark tidak terbatas",
      "Pencarian lowongan dasar",
      "1 CV tersimpan",
    ],
    cta: "Mulai Gratis",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "Rp 29.000",
    period: "/bulan",
    description: "Untuk pencari kerja serius",
    features: [
      "Surat lamaran tidak terbatas",
      "Unduh PDF & DOCX",
      "Notifikasi lowongan harian",
      "Beberapa CV",
      "Riwayat lamaran lengkap",
      "Support prioritas",
    ],
    cta: "Langganan Premium",
    href: "/register?plan=premium",
    highlighted: true,
  },
  {
    name: "Employer",
    price: "Rp 89.000",
    period: "/bulan",
    description: "Untuk perusahaan",
    features: [
      "5 lowongan aktif",
      "Dashboard analitik sederhana",
      "Branding perusahaan dasar",
      "Support standar",
    ],
    cta: "Hubungi Kami",
    href: "/contact",
    highlighted: false,
  },
];

function PricingSection() {
  return (
    <section className="py-16" id="pricing">
      <div className="container-content">
        <div className="text-center mb-6">
          <p className="text-label text-white/50 mb-2 uppercase tracking-wider text-sm">
            Harga
          </p>
          <h2 className="text-h2 text-ink mb-4">
            Pilih Paket yang Tepat
          </h2>
          <p className="text-body text-text-muted max-w-xl mx-auto">
            Mulai gratis, upgrade kapan saja. Tanpa kontrak, bisa batal kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "bg-surface rounded-lg border border-white/5 p-6",
                plan.highlighted ? "border-primary/50" : ""
              )}
            >
              {plan.highlighted && (
                <div className="mb-3 flex items-center gap-2 rounded bg-primary/10 px-3 py-1 text-xs">
                  <span className="text-primary">Direkomendasikan</span>
                </div>
              )}

              <h3 className="text-h3 text-ink mb-3">{plan.name}</h3>
              <p className="text-sm text-text-muted mb-4">{plan.description}</p>

              <div className="mb-4">
                <span className="text-2xl font-bold text-ink">
                  {plan.price}
                </span>
                <span className="text-xs text-text-muted ml-2">{plan.period}</span>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-muted">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className="w-full block text-center py-3 px-4 rounded-md text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: plan.highlighted ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: plan.highlighted ? 'var(--color-on-primary)' : 'var(--color-text)',
                  border: plan.highlighted ? 'none' : '1px solid var(--color-border)'
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- CTA SECTION ---
function CTASection() {
  return (
    <section className="py-12 border-t border-white/5">
      <div className="container-content text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-h1 text-white mb-4">
            Siap Mulai Pencarian Kerja Anda?
          </h2>
          <p className="text-lg text-white/60 mb-6">
            Bergabung dengan pencari kerja yang sudah menggunakan Lokers untuk
            menemukan lowongan yang sesuai.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-3 rounded-md text-sm font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                border: 'none'
              }}
            >
              Mulai Gratis Sekarang
            </Link>
            <Link
              href="/jobs"
              className="w-full sm:w-auto px-6 py-3 rounded-md text-sm font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)'
              }}
            >
              Lihat Lowongan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- MAIN PAGE ---
export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Persistent Flowing Gradient Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 30%, rgba(220, 38, 38, 0.25) 0%, rgba(37, 99, 235, 0.1) 40%, rgba(0, 0, 0, 1) 80%)'
      }} />

      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <PricingSection />
          <IntegrationMarquee />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
