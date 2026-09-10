"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Sparkles,
  FileText,
  Zap,
  Shield,
  ArrowRight,
  Check,
  Briefcase,
  Star,
  Clock,
  TrendingUp,
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

      <div className="container-max relative z-10 pt-32 pb-20 md:pt-40 md:pb-28">
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
            className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Upload CV sekali, AI buatkan surat lamaran profesional yang
            disesuaikan untuk setiap posisi. Hemat waktu hingga 80%.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 relative z-50">
            <JobFilterBar />
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            {[
              { value: "10K+", label: "Lowongan Aktif" },
              { value: "50K+", label: "Pengguna" },
              { value: "100K+", label: "Lamaran Dibuat" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 mt-1">{stat.label}</div>
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
          <motion.h2 variants={fadeUp} className="text-h2 text-ink mb-4">
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
    title: "Upload CV",
    description:
      "Upload CV dalam format PDF. AI akan mengekstrak data secara otomatis.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Temukan Lowongan",
    description:
      "Cari dan filter ribuan lowongan kerja dari berbagai sumber terpercaya.",
    icon: Search,
  },
  {
    step: "03",
    title: "Generate Lamaran",
    description:
      "Klik satu tombol, AI buatkan surat lamaran yang dipersonalisasi.",
    icon: Sparkles,
  },
  {
    step: "04",
    title: "Download & Kirim",
    description:
      "Download dalam format PDF/DOCX dan langsung kirim ke perusahaan.",
    icon: ArrowRight,
  },
];

function HowItWorksSection() {
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
            className="text-label text-secondary mb-3 uppercase tracking-wider"
          >
            Cara Kerja
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-h2 text-ink mb-4">
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {STEPS.map((step) => (
            <motion.div
              key={step.step}
              variants={fadeUp}
              className="relative p-6 bg-surface rounded-lg border border-border text-center"
            >
              <span className="text-5xl font-extrabold text-border/60 absolute top-4 right-4">
                {step.step}
              </span>
              <div className="w-14 h-14 rounded-md bg-primary-soft flex items-center justify-center mx-auto mb-5">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
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
          <motion.h2 variants={fadeUp} className="text-h2 text-ink mb-4">
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
          <motion.h2 variants={fadeUp} className="text-h1 text-white mb-6">
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
