"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import Image from "next/image";

const PLATFORMS = [
  { name: "LinkedIn", logo: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=128" },
  { name: "Jobstreet", logo: "https://www.google.com/s2/favicons?domain=jobstreet.co.id&sz=128" },
  { name: "Dealls", logo: "https://www.google.com/s2/favicons?domain=dealls.com&sz=128" },
  { name: "Glints", logo: "https://www.google.com/s2/favicons?domain=glints.com&sz=128" },
  { name: "Kalibrr", logo: "https://www.google.com/s2/favicons?domain=kalibrr.com&sz=128" },
  { name: "Tech in Asia", logo: "https://www.google.com/s2/favicons?domain=techinasia.com&sz=128" },
  { name: "Karir.com", logo: "https://www.google.com/s2/favicons?domain=karir.com&sz=128" },
];

const COMPANIES = [
  { name: "Gojek", logo: "https://www.google.com/s2/favicons?domain=gojek.com&sz=128" },
  { name: "Tokopedia", logo: "https://www.google.com/s2/favicons?domain=tokopedia.com&sz=128" },
  { name: "Traveloka", logo: "https://www.google.com/s2/favicons?domain=traveloka.com&sz=128" },
  { name: "Bukalapak", logo: "https://www.google.com/s2/favicons?domain=bukalapak.com&sz=128" },
  { name: "Shopee", logo: "https://www.google.com/s2/favicons?domain=shopee.co.id&sz=128" },
  { name: "Grab", logo: "https://www.google.com/s2/favicons?domain=grab.com&sz=128" },
  { name: "Tiket.com", logo: "https://www.google.com/s2/favicons?domain=tiket.com&sz=128" },
  { name: "Ruangguru", logo: "https://www.google.com/s2/favicons?domain=ruangguru.com&sz=128" },
  { name: "Bank BCA", logo: "https://www.google.com/s2/favicons?domain=bca.co.id&sz=128" },
  { name: "Bank Mandiri", logo: "https://www.google.com/s2/favicons?domain=bankmandiri.co.id&sz=128" },
  { name: "Telkomsel", logo: "https://www.google.com/s2/favicons?domain=telkomsel.com&sz=128" },
  { name: "Astra", logo: "https://www.google.com/s2/favicons?domain=astra.co.id&sz=128" },
];

// Combine and duplicate them to make it look full
const ALL_ITEMS = [...PLATFORMS, ...COMPANIES, ...PLATFORMS, ...COMPANIES];

// Split into 3 rows for zig zag effect
const ROW1 = ALL_ITEMS.slice(0, 12);
const ROW2 = ALL_ITEMS.slice(12, 24);
const ROW3 = ALL_ITEMS.slice(24, 36);

const MarqueeRow = ({ items, reverse = false, speed = 40 }: { items: typeof PLATFORMS, reverse?: boolean, speed?: number }) => {
  return (
    <div className="flex w-full overflow-hidden relative group py-2">
      <div
        className={`flex w-max min-w-full shrink-0 gap-4 pr-4 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3 bg-[#141416]/50 hover:bg-[#141416] backdrop-blur-sm border border-white/5 hover:border-white/20 rounded-2xl transition-all duration-300 shadow-card cursor-pointer group-hover:opacity-40 hover:!opacity-100">
            <div className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner p-1">
              <Image src={item.logo} alt={item.name} width={40} height={40} className="w-full h-full object-contain rounded-md" />
            </div>
            <span className="text-white/80 font-medium whitespace-nowrap text-sm">{item.name}</span>
          </div>
        ))}
      </div>
      {/* Duplicate for seamless infinite scrolling */}
      <div
        className={`flex w-max min-w-full shrink-0 gap-4 pr-4 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {items.map((item, i) => (
          <div key={i + items.length} className="flex items-center gap-3 px-5 py-3 bg-[#141416]/50 hover:bg-[#141416] backdrop-blur-sm border border-white/5 hover:border-white/20 rounded-2xl transition-all duration-300 shadow-card cursor-pointer group-hover:opacity-40 hover:!opacity-100">
            <div className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner p-1">
              <Image src={item.logo} alt={item.name} width={40} height={40} className="w-full h-full object-contain rounded-md" />
            </div>
            <span className="text-white/80 font-medium whitespace-nowrap text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function IntegrationMarquee() {
  return (
    <section className="py-24 relative overflow-hidden flex flex-col items-center justify-center" id="integrations">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-content relative z-10 text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-primary font-semibold mb-4 tracking-wider uppercase text-sm"
        >
          Terintegrasi
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-h2 text-white mb-6 italic"
        >
          Terkoneksi dengan <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">100+ Platform & Perusahaan</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/60 max-w-2xl mx-auto text-lg"
        >
          AI kami secara otomatis mengumpulkan (scraping) dan menyinkronkan data lowongan pekerjaan dari berbagai sumber terpercaya setiap harinya.
        </motion.p>
      </div>

      {/* Marquee Rows with Fade Masks */}
      <div className="relative w-full max-w-[100vw] flex flex-col gap-4 mt-8">
        {/* Left/Right Fade Masks */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-64 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-64 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

        <MarqueeRow items={ROW1} speed={60} />
        <MarqueeRow items={ROW2} reverse={true} speed={70} />
        <MarqueeRow items={ROW3} speed={60} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-16 z-10"
      >
        <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-semibold transition-all duration-300 hover:shadow-glow flex items-center gap-2 group">
          Eksplore
        </button>
      </motion.div>

    </section>
  );
}
