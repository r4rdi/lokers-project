"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
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

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-32 pb-20 overflow-hidden relative">
        {/* N8N Inspired Background Gradients (Orange, Red, Blue) */}
        <div className="absolute top-[30%] left-0 right-0 h-[600px] bg-gradient-to-r from-orange-600/20 via-red-600/10 to-blue-600/20 blur-[120px] pointer-events-none opacity-80" />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[70%] h-[400px] bg-orange-500/10 blur-[150px] pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-content relative z-10">
          <div className="mx-auto max-w-6xl">
            
            {/* Header Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center mb-20"
            >
              <motion.div variants={fadeUp} className="mb-6 flex justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-bold text-white/70 tracking-widest uppercase bg-white/5 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                  PRICING
                </span>
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6">
                Pilih Paket Sesuai Kebutuhanmu
              </motion.h1>
              
              <motion.p
                variants={fadeUp}
                className="text-base text-white/60 max-w-2xl mx-auto"
              >
                Mulai gratis untuk mencoba platform kami, atau upgrade ke Premium 
                untuk membuka semua fitur canggih tanpa batasan.
              </motion.p>
              
              {/* Optional Toggle (Mock) */}
              <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mt-10">
                <span className="text-xs font-bold text-white/80">BULANAN</span>
                <div className="w-12 h-6 bg-white/10 rounded-full p-1 cursor-pointer border border-white/10">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
                <span className="text-xs font-bold text-white/40">TAHUNAN (HEMAT 10%)</span>
              </motion.div>
            </motion.div>

            {/* Pricing Grid */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16"
            >
              {PLANS.map((plan) => (
                <motion.div
                  key={plan.name}
                  variants={fadeUp}
                  className={cn(
                    "relative p-8 rounded-3xl flex flex-col transition-all duration-300",
                    plan.highlighted 
                      ? "bg-[#141416] border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.1)] md:-translate-y-2" 
                      : "bg-[#0F0F11]/80 backdrop-blur-md border border-white/10 hover:border-white/20"
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-5 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-white/20">
                        <Sparkles className="w-3 h-3" /> Paling Populer
                      </span>
                    </div>
                  )}

                  {/* Icon Mock */}
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                    {plan.highlighted ? (
                      <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-orange-400 to-red-500 blur-[1px]" />
                    ) : (
                      <div className="w-6 h-6 rounded-md bg-white/20" />
                    )}
                  </div>

                  <h3 className="text-xl font-medium text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-white/50 mb-8">{plan.description}</p>

                  <div className="mb-6 flex items-baseline">
                    <span className="text-4xl font-medium text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-white/40 text-sm ml-1 font-medium">{plan.period}</span>
                  </div>
                  
                  <div className="w-full h-px bg-white/10 mb-8" />

                  <div className="mb-6">
                    <p className="text-xs font-bold text-white/80 mb-5">Yang Anda dapatkan:</p>
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-white/70"
                        >
                          <div className={cn(
                            "mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                            plan.highlighted ? "bg-orange-500/20 text-orange-400" : "bg-white/10 text-white/60"
                          )}>
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-8">
                    <Link
                      href={plan.href}
                      className={cn(
                        "block text-center py-3.5 px-6 rounded-full text-sm font-semibold transition-all border",
                        plan.highlighted
                          ? "bg-white text-black border-white hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                          : "bg-transparent text-white border-white/20 hover:bg-white/10"
                      )}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Gradient CTA Banner - Dark Mode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative w-full rounded-[2rem] overflow-hidden p-10 md:p-14 text-center flex flex-col items-center justify-center bg-gradient-to-r from-orange-900/40 via-red-900/30 to-blue-900/40 border border-white/10"
            >
              {/* Avatar Mock */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-[#111] p-1 shadow-xl border border-white/10">
                  <div className="w-full h-full rounded-full bg-surface overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 to-blue-500/30" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black rounded-full shadow-lg flex items-center justify-center border border-white/20">
                  <span className="text-sm">📞</span>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-medium text-white mb-3">
                Masih ragu memilih paket?
              </h3>
              <p className="text-white/60 text-sm md:text-base mb-8 max-w-md">
                Jadwalkan sesi konsultasi gratis selama 30 menit bersama tim ahli kami.
              </p>

              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors shadow-xl"
              >
                Pesan Konsultasi Gratis <span>→</span>
              </Link>
            </motion.div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
