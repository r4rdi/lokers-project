"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const LEVELS = [
  "SMA/K",
  "Sedang Kuliah (Non-Final)",
  "Sedang Kuliah (Final Year)",
  "Fresh Grad",
  "1-3 Years Experience",
  "3-5 Years Experience",
  "5+ Years Experience",
];

const JENIS = [
  "Penuh waktu",
  "Magang",
  "Paruh waktu",
  "Kontrak",
  "Freelance",
];

const TIPE = ["Remote", "On-Site", "Hybrid"];

const LOKASI_MOCK = [
  "Jakarta Selatan",
  "Jakarta Pusat",
  "Jakarta Barat",
  "Jakarta Timur",
  "Jakarta Utara",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Semarang",
  "Medan",
  "Bali",
];

export default function JobFilterBar() {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Selected States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedJenis, setSelectedJenis] = useState<string>("");
  const [selectedTipe, setSelectedTipe] = useState<string>("");

  // Location specific
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLokasi, setSelectedLokasi] = useState<string>("");

  // Salary specific
  const [salary, setSalary] = useState<number>(5000000);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedLokasi) params.set("location", selectedLokasi);
    if (selectedJenis) params.set("job_type", selectedJenis);
    
    // Additional parameters if needed by the JobsPage later
    if (selectedLevel) params.set("level", selectedLevel);
    if (selectedTipe) params.set("work_type", selectedTipe);
    
    router.push(`/jobs?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredLocations = LOKASI_MOCK.filter(loc =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3" ref={containerRef}>
      {/* Primary Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2 bg-surface/40 backdrop-blur-md border border-border p-2 rounded-lg shadow-card">
        <div className="flex-1 flex items-center gap-3 bg-white/5 rounded-md px-4 py-3">
          <Search className="w-5 h-5 text-white/50 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari berdasarkan posisi, perusahaan, & skill"
            className="w-full bg-transparent text-white placeholder:text-white/40 text-sm outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-md transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <Search className="w-4 h-4" />
          Cari Pekerjaan
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Level Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("level")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 bg-surface/40 hover:bg-surface/60 border rounded-md text-sm transition-colors",
              activeDropdown === "level" || selectedLevel ? "border-primary/50 text-white" : "border-border text-white/70"
            )}
          >
            {selectedLevel || "Level"}
            <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === "level" && "rotate-180")} />
          </button>

          <AnimatePresence>
            {activeDropdown === "level" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 w-64 bg-[#111] border border-border rounded-lg shadow-floating z-50 py-2 overflow-hidden"
              >
                <div className="px-3 pb-2 mb-2 border-b border-white/10 text-xs font-semibold text-white/50 uppercase tracking-wider">Level Pengalaman</div>
                <div className="max-h-60 overflow-y-auto">
                  {LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => { setSelectedLevel(level); setActiveDropdown(null); }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors",
                        selectedLevel === level ? "text-primary font-medium bg-primary/10" : "text-white/80"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Jenis Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("jenis")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 bg-surface/40 hover:bg-surface/60 border rounded-md text-sm transition-colors",
              activeDropdown === "jenis" || selectedJenis ? "border-primary/50 text-white" : "border-border text-white/70"
            )}
          >
            {selectedJenis || "Jenis"}
            <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === "jenis" && "rotate-180")} />
          </button>

          <AnimatePresence>
            {activeDropdown === "jenis" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 w-48 bg-[#111] border border-border rounded-lg shadow-floating z-50 py-2"
              >
                <div className="px-3 pb-2 mb-2 border-b border-white/10 text-xs font-semibold text-white/50 uppercase tracking-wider">Jenis Pekerjaan</div>
                {JENIS.map(jenis => (
                  <button
                    key={jenis}
                    onClick={() => { setSelectedJenis(jenis); setActiveDropdown(null); }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors",
                      selectedJenis === jenis ? "text-primary font-medium bg-primary/10" : "text-white/80"
                    )}
                  >
                    {jenis}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tipe Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("tipe")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 bg-surface/40 hover:bg-surface/60 border rounded-md text-sm transition-colors",
              activeDropdown === "tipe" || selectedTipe ? "border-primary/50 text-white" : "border-border text-white/70"
            )}
          >
            {selectedTipe || "Tipe"}
            <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === "tipe" && "rotate-180")} />
          </button>

          <AnimatePresence>
            {activeDropdown === "tipe" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 w-40 bg-[#111] border border-border rounded-lg shadow-floating z-50 py-2"
              >
                <div className="px-3 pb-2 mb-2 border-b border-white/10 text-xs font-semibold text-white/50 uppercase tracking-wider">Tipe Kerja</div>
                {TIPE.map(tipe => (
                  <button
                    key={tipe}
                    onClick={() => { setSelectedTipe(tipe); setActiveDropdown(null); }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors",
                      selectedTipe === tipe ? "text-primary font-medium bg-primary/10" : "text-white/80"
                    )}
                  >
                    {tipe}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Lokasi Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("lokasi")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 bg-surface/40 hover:bg-surface/60 border rounded-md text-sm transition-colors",
              activeDropdown === "lokasi" || selectedLokasi ? "border-primary/50 text-white" : "border-border text-white/70"
            )}
          >
            {selectedLokasi || "Lokasi"}
            <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === "lokasi" && "rotate-180")} />
          </button>

          <AnimatePresence>
            {activeDropdown === "lokasi" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 w-64 bg-[#111] border border-border rounded-lg shadow-floating z-50 py-3"
              >
                <div className="px-3 pb-3">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-3 py-2">
                    <Search className="w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Cari lokasi"
                      className="bg-transparent text-sm text-white outline-none w-full"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredLocations.length > 0 ? filteredLocations.map(loc => (
                    <button
                      key={loc}
                      onClick={() => { setSelectedLokasi(loc); setActiveDropdown(null); }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors",
                        selectedLokasi === loc ? "text-primary font-medium bg-primary/10" : "text-white/80"
                      )}
                    >
                      {loc}
                    </button>
                  )) : (
                    <div className="px-4 py-3 text-sm text-white/40 text-center">Lokasi tidak ditemukan</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gaji Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("gaji")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 bg-surface/40 hover:bg-surface/60 border rounded-md text-sm transition-colors",
              activeDropdown === "gaji" || salary > 1000000 ? "border-primary/50 text-white" : "border-border text-white/70"
            )}
          >
            Gaji {salary > 1000000 ? `(Min ${formatRupiah(salary).replace(',00', '')})` : ""}
            <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === "gaji" && "rotate-180")} />
          </button>

          <AnimatePresence>
            {activeDropdown === "gaji" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 w-80 bg-[#111] border border-border rounded-lg shadow-floating z-50 p-5"
              >
                <div className="text-sm font-semibold text-white/80 mb-6">Minimal Gaji yang Diharapkan</div>

                <div className="mb-4 text-center">
                  <span className="text-xl font-bold text-white">{formatRupiah(salary).replace(',00', '')}</span>
                </div>

                <input
                  type="range"
                  min="1000000"
                  max="50000000"
                  step="500000"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-md appearance-none cursor-pointer accent-primary"
                />

                <div className="flex justify-between text-xs text-white/40 mt-2">
                  <span>Rp 1 Jt</span>
                  <span>Rp 50 Jt+</span>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setActiveDropdown(null)}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-md font-semibold hover:bg-primary-hover"
                  >
                    Terapkan
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clear Filters (if any selected) */}
        {(selectedLevel || selectedJenis || selectedTipe || selectedLokasi || salary > 1000000) && (
          <button
            onClick={() => {
              setSelectedLevel("");
              setSelectedJenis("");
              setSelectedTipe("");
              setSelectedLokasi("");
              setSalary(1000000);
            }}
            className="text-xs text-white/50 hover:text-white transition-colors underline ml-2"
          >
            Hapus Filter
          </button>
        )}
      </div>
    </div>
  );
}
