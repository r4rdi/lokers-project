"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  FileText,
  Zap,
  Shield,
  ArrowRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import IntegrationMarquee from "@/components/home/IntegrationMarquee";
import JobFilterBar from "@/components/jobs/JobFilterBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

// --- HERO SECTION ---
function HeroSection() {
  return (
    <section className="relative text-white overflow-x-clip pt-20 z-20">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />

      <div className="container-max relative z-10 pt-4 pb-20 md:pt-18 md:pb-28">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-white/10 border border-white/10 text-sm font-semibold text-white/80 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              AI-Powered Job Portal
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-display text-white mb-6"
          >
            Temukan Lowongan,{" "}
            <span className="gradient-text">Buat Lamaran</span>{" "}
            dalam Hitungan Detik
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            className="text-sm md:text-base text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Upload CV sekali, AI buatkan surat lamaran profesional yang
            disesuaikan untuk setiap posisi. Hemat waktu hingga 80%.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 relative z-50">
            <JobFilterBar />
          </motion.div>

          {/* As seen on */}
          <motion.div variants={fadeUp} className="mt-20 text-center">
            <p className="text-base text-white/50 mb-10 font-medium tracking-wider">
              AS SEEN ON
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {/* LinkedIn */}
              <div className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="font-bold text-xl md:text-2xl tracking-tight">LinkedIn</span>
              </div>

              {/* JobStreet */}
              <div className="flex items-center text-white hover:text-white/80 transition-colors">
                <span className="font-extrabold text-xl md:text-2xl tracking-tighter">JobStreet</span>
              </div>

              {/* Dealls */}
              <div className="flex items-center text-white hover:text-white/80 transition-colors">
                <span className="font-bold text-xl md:text-2xl tracking-tight italic">Dealls</span>
              </div>

              {/* Glints */}
              <div className="flex items-center text-white hover:text-white/80 transition-colors">
                <span className="font-black text-xl md:text-2xl tracking-widest uppercase">GLINTS</span>
              </div>

              {/* Remotive */}
              <div className="flex items-center text-white hover:text-white/80 transition-colors">
                <span className="font-bold text-xl md:text-2xl tracking-tighter font-serif lowercase">remotive</span>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center items-center mt-16 pb-8"
          >
            {[
              { value: "10K+", label: "Lowongan Aktif" },
              { value: "50K+", label: "Pengguna" },
              { value: "100K+", label: "Lamaran Dibuat" },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="flex items-center">
                <div className="text-center px-6 md:px-12">
                  <div className="text-2xl md:text-3xl font-extrabold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/60 mt-1">{stat.label}</div>
                </div>
                {i < arr.length - 1 && (
                  <hr className="w-[1px] h-12 bg-white/20 border-0" />
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- FEATURES SECTION ---
const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Cover Letter Generator",
    description:
      "Surat lamaran profesional yang dipersonalisasi untuk setiap posisi. Cukup satu klik, AI sesuaikan dengan CV dan deskripsi pekerjaan.",
    color: "text-primary",
    bgColor: "bg-primary-soft",
  },
  {
    icon: FileText,
    title: "Smart CV Parser",
    description:
      "Upload PDF CV, AI akan mengekstrak data secara otomatis. Edit dan simpan beberapa versi untuk kebutuhan berbeda.",
    color: "text-secondary",
    bgColor: "bg-secondary-soft",
  },
  {
    icon: Zap,
    title: "Pencarian Cepat",
    description:
      "Filter lowongan berdasarkan lokasi, tipe pekerjaan, gaji, dan lainnya. Temukan pekerjaan impian dalam hitungan detik.",
    color: "text-accent",
    bgColor: "bg-accent-soft",
  },
  {
    icon: Shield,
    title: "ATS-Friendly",
    description:
      "Surat lamaran yang dihasilkan mengikuti standar ATS sehingga lolos screening awal secara otomatis.",
    color: "text-success",
    bgColor: "bg-[#E8F9F0]",
  },
];

function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="container-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-label text-primary mb-3 uppercase tracking-wider"
          >
            Fitur Utama
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-h2 text-ink mb-4 italic">
            Kenapa Lokers?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-body text-text-muted max-w-xl mx-auto"
          >
            Semua yang kamu butuhkan untuk melamar kerja, dalam satu platform
            yang didukung kecerdasan buatan.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="group p-8 bg-surface rounded-lg border border-border hover:shadow-card transition-all duration-300"
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-md flex items-center justify-center mb-5",
                  feature.bgColor
                )}
              >
                <feature.icon className={cn("w-6 h-6", feature.color)} />
              </div>
              <h3 className="text-h3 text-ink mb-3">{feature.title}</h3>
              <p className="text-body text-text-muted">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// --- HOW IT WORKS ---
const STEPS = [
  {
    step: "01",
    title: "UPLOAD",
    description:
      "Upload CV PDF. AI ekstrak data otomatis.",
    icon: FileText,
  },
  {
    step: "02",
    title: "TEMUKAN",
    description:
      "Filter ribuan lowongan dari sumber terpercaya.",
    icon: Search,
  },
  {
    step: "03",
    title: "GENERATE",
    description:
      "Klik satu tombol, AI buatkan surat personal.",
    icon: Sparkles,
  },
  {
    step: "04",
    title: "KIRIM",
    description:
      "Download format PDF/DOCX & langsung kirim.",
    icon: ArrowRight,
  },
];

function HowItWorksSection() {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="container-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center mb-16 md:mb-10"
        >
          <motion.p
            variants={fadeUp}
            className="text-label text-warning mb-3 uppercase tracking-wider"
          >
            Cara Kerja
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-h2 text-ink mb-4 italic">
            Semudah 4 Langkah
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-body text-text-muted max-w-xl mx-auto"
          >
            Proses yang biasanya memakan berjam-jam, kini selesai dalam hitungan
            menit.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="flex flex-col md:flex-row items-center md:items-start justify-center pt-8 md:pt-12 pb-16 md:pb-32"
        >
          {STEPS.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={step.step}
                variants={fadeUp}
                className={cn(
                  "relative w-56 h-56 lg:w-64 lg:h-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:bg-white/10 cursor-pointer",
                  "rotate-45",
                  index !== 0 ? "md:-ml-16 lg:-ml-[75px]" : "",
                  isEven ? "z-10" : "z-20 md:mt-40 lg:mt-[181px]",
                  "mb-12 md:mb-0"
                )}
              >
                {/* Yellow corner accent */}
                {index !== 0 && (
                  <div className="hidden md:block absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-warning rounded-tl-[2.5rem] -translate-x-[1px] -translate-y-[1px] z-30" />
                )}

                {/* Unrotate content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-45 p-6 lg:p-8">
                  {/* Icon */}
                  <div className="mb-3 lg:mb-4">
                    <step.icon className="w-6 h-6 lg:w-8 lg:h-8 text-ink" strokeWidth={1.5} />
                  </div>
                  {/* Content */}
                  <div className="flex items-center justify-center gap-2 lg:gap-3 w-full">
                    <span className="text-5xl lg:text-6xl font-black text-warning">
                      {index + 1}
                    </span>
                    <div className="text-left flex-1">
                      <h3 className="text-[11px] lg:text-sm font-bold text-ink uppercase tracking-widest mb-1">
                        {step.title}
                      </h3>
                      <p className="text-[9px] lg:text-[11px] text-text-muted leading-tight">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
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
      "3 cover letter per bulan",
      "Bookmark unlimited",
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
      "Cover letter unlimited",
      "Download PDF & DOCX",
      "Job alert harian",
      "Multiple CV",
      "Riwayat lamaran lengkap",
      "Prioritas support",
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
      "Dashboard analitik",
      "Branding perusahaan",
      "Support prioritas",
    ],
    cta: "Hubungi Kami",
    href: "/contact",
    highlighted: false,
  },
];

function PricingSection() {
  return (
    <section className="py-20 md:py-28 relative" id="pricing">
      <div className="container-content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-label text-accent mb-3 uppercase tracking-wider"
          >
            Harga
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-h2 text-ink mb-4 italic">
            Pilih Paket yang Tepat
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-body text-text-muted max-w-xl mx-auto"
          >
            Mulai gratis, upgrade kapan saja. Tanpa kontrak, bisa batal kapan
            saja.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={cn(
                "relative p-8 rounded-xl border transition-shadow duration-300",
                plan.highlighted
                  ? "bg-surface border-primary shadow-card scale-[1.02]"
                  : "bg-surface border-border hover:shadow-card"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-pill bg-primary text-on-primary text-xs font-bold">
                    Populer
                  </span>
                </div>
              )}

              <h3 className="text-h3 text-ink mb-1">{plan.name}</h3>
              <p className="text-sm text-text-muted mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-extrabold text-ink">
                  {plan.price}
                </span>
                <span className="text-sm text-text-muted">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-text-muted"
                  >
                    <Check
                      className={cn(
                        "w-4 h-4 mt-0.5 shrink-0",
                        plan.highlighted ? "text-primary" : "text-success"
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={cn(
                  "block text-center py-3 px-6 rounded-md text-sm font-bold transition-colors",
                  plan.highlighted
                    ? "bg-primary text-on-primary hover:bg-primary-hover"
                    : "bg-surface-muted text-text hover:bg-border"
                )}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// --- CTA SECTION ---
function CTASection() {
  return (
    <section className="py-20 md:py-28 relative border-t border-border/40">
      <div className="container-content text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-2xl mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-h1 text-white mb-6 italic">
            Siap Buat Lamaran Kerja yang Bikin Dilirik?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-lg text-white/60 mb-10"
          >
            Bergabung dengan ribuan pencari kerja yang sudah mempercayakan proses
            lamaran mereka ke Lokers.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              href="/register"
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors flex items-center justify-center gap-2"
              id="cta-register"
            >
              <Sparkles className="w-5 h-5" />
              Mulai Gratis Sekarang
            </Link>
            <Link
              href="/jobs"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-md transition-colors border border-white/10 flex items-center justify-center gap-2"
              id="cta-browse"
            >
              Lihat Lowongan
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
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
