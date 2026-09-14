"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Briefcase, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const LEVELS = [
  "SMA/K",
  "Sedang Kuliah (Non-Final Year)",
  "Sedang Kuliah (Final Year)",
  "Fresh Grad",
  "1-3 Years Experience",
  "3-5 Years Experience",
  "5+ Years Experience",
];

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

export default function TopJobFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get("level") || "");

  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLokasi, setSelectedLokasi] = useState(searchParams.get("location") || "");

  const [salary, setSalary] = useState<number>(Number(searchParams.get("salary")) || 1000000);

  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) params.set("search", searchQuery);
    else params.delete("search");

    if (selectedLokasi) params.set("location", selectedLokasi);
    else params.delete("location");

    if (selectedLevel) params.set("level", selectedLevel);
    else params.delete("level");

    if (salary > 1000000) params.set("salary", salary.toString());
    else params.delete("salary");

    router.push(`/jobs?${params.toString()}`);
  };

  const filteredLocations = LOKASI_MOCK.filter(loc =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className="bg-[#141416]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-start justify-between gap-3 w-full relative z-[60]" ref={containerRef}>

      {/* Search - Full width on mobile */}
      <div className="w-full mb-3 md:mb-0 md:w-auto">
        <label className="flex items-center gap-2 mb-1.5 text-sm font-medium text-white/60 block">
          <Search className="w-4 h-4 text-white/40" />
          <span>Cari Pekerjaan</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => document.getElementById('search-input-mobile')?.focus()}
            className="w-8 h-8 rounded-lg border border-white/20 hover:border-white/30 hover:bg-white/5 flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2"
          >
            <Search className="w-4 h-4 text-white/60" />
          </button>
          <input
            id="search-input-mobile"
            type="text"
            placeholder="Misal: Designer, Developer, Marketing"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder:text-white/40 text-sm outline-none focus:outline-none focus:ring-0 focus:border-transparent rounded-xl border border-white/10 font-medium"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Level Button - Full width on mobile */}
      <div className="w-full mb-3 md:mb-0 md:w-auto">
        <div className={cn("relative w-full group", activeDropdown === "level" && "z-20")}>
          <button
            type="button"
            onClick={() => toggleDropdown("level")}
            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium rounded-lg border border-white/10 hover:border-white/20 transition-colors"
          >
            <Briefcase className="w-4 h-4 text-white/50" />
            <span className={cn("truncate", selectedLevel ? "text-white" : "")}>{selectedLevel || "Pengalaman"}</span>
            <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform", activeDropdown === "level" && "rotate-180")} />
          </button>

          <AnimatePresence>
            {activeDropdown === "level" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 w-full max-w-xs bg-[#111] border border-white/10 rounded-xl shadow-lg z-20"
              >
                <div className="px-4 pt-3">
                  <p className="text-sm font-medium text-white/60 mb-2">Level Pengalaman</p>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 px-3 pb-3">
                  {LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => { setSelectedLevel(level); setActiveDropdown(null); handleApplyFilters(); }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors",
                        selectedLevel === level ? "text-primary font-medium bg-white/5" : "text-white/60"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                  {selectedLevel && (
                    <button
                      onClick={() => { setSelectedLevel(""); setActiveDropdown(null); handleApplyFilters(); }}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-white/5 transition-colors border-t border-white/10 mt-2"
                    >
                      Reset Level
                    </button>
                  )}
                </div>
                <div className="pt-3">
                  <button
                    onClick={() => { setActiveDropdown(null); handleApplyFilters(); }}
                    className="w-full text-center px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Terapkan
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Location Button - Full width on mobile */}
      <div className="w-full mb-3 md:mb-0 md:w-auto">
        <div className={cn("relative w-full group", activeDropdown === "lokasi" && "z-20")}>
          <button
            type="button"
            onClick={() => toggleDropdown("lokasi")}
            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium rounded-lg border border-white/10 hover:border-white/20 transition-colors"
          >
            <MapPin className="w-4 h-4 text-white/50" />
            <span className={cn("truncate", selectedLokasi ? "text-white" : "")}>{selectedLokasi || "Lokasi"}</span>
            <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform", activeDropdown === "lokasi" && "rotate-180")} />
          </button>

          <AnimatePresence>
            {activeDropdown === "lokasi" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 w-full max-w-xs bg-[#111] border border-white/10 rounded-xl shadow-lg z-20"
              >
                <div className="px-4 pt-3">
                  <p className="text-sm font-medium text-white/60 mb-2">Cari Lokasi</p>
                </div>
                <div className="space-y-2 px-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ketik nama kota..."
                      className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder:text-white/40 text-sm outline-none focus:outline-none focus:ring-0 focus:border-transparent rounded-xl border border-white/10 font-medium"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      autoFocus
                      autoComplete="off"
                    />
                  </div>
                  {filteredLocations.length > 0 ? (
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {filteredLocations.map(loc => (
                        <button
                          key={loc}
                          onClick={() => { setSelectedLokasi(loc); setActiveDropdown(null); handleApplyFilters(); }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors",
                            selectedLokasi === loc ? "text-primary font-medium bg-white/5" : "text-white/60"
                          )}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3 text-sm text-white/40">Lokasi tidak ditemukan</div>
                  )}
                  {selectedLokasi && (
                    <div className="mt-3">
                      <button
                        onClick={() => { setSelectedLokasi(""); setActiveDropdown(null); handleApplyFilters(); }}
                        className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-white/5 transition-colors border-t border-white/10"
                      >
                        Reset Lokasi
                      </button>
                    </div>
                  )}
                </div>
                <div className="pt-3">
                  <button
                    onClick={() => { setActiveDropdown(null); handleApplyFilters(); }}
                    className="w-full text-center px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Terapkan
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Salary Range - Full width on mobile */}
      <div className="w-full mb-3 md:mb-0 md:w-auto">
        <div className={cn("relative w-full group", activeDropdown === "gaji" && "z-20")}>
          <button
            type="button"
            onClick={() => toggleDropdown("gaji")}
            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium rounded-lg border border-white/10 hover:border-white/20 transition-colors"
          >
            <span className="flex-1">Rentang Gaji</span>
            <span className="text-white font-medium">{salary > 1000000 ? `> ${formatRupiah(salary / 1000000)}Jt` : "Semua"}</span>
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <AnimatePresence>
            {activeDropdown === "gaji" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 w-full max-w-xs bg-[#111] border border-white/10 rounded-xl shadow-lg z-20"
              >
                <div className="px-4 pt-3">
                  <p className="text-sm font-medium text-white/60 mb-2">Gaji Minimal</p>
                </div>
                <div className="space-y-3">
                  <div className="mb-3 text-center">
                    <span className="text-xl font-bold text-white">{formatRupiah(salary)}</span>
                  </div>

                  <div className="relative h-2 bg-white/10 rounded-full">
                    <div
                      className="absolute left-0 top-0 h-full bg-primary rounded-full"
                      style={{ width: `${Math.max(0, ((salary - 1000000) / 29000000) * 100)}%` }}
                    ></div>
                  </div>

                  <input
                    type="range"
                    min="1000000"
                    max="30000000"
                    step="500000"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full h-1 bg-transparent pointer-events-none appearance-none"
                  />

                  <div className="flex justify-between text-xs text-white/40 mt-2">
                    <span>Rp 1 Jt</span>
                    <span>Rp 30 Jt</span>
                  </div>
                </div>

                <div className="pt-3">
                  <div className="flex justify-between">
                    <button
                      onClick={() => { setSalary(1000000); handleApplyFilters(); }}
                      className="flex-1 text-center px-3 py-2 text-sm font-medium text-red-500 bg-white/5 rounded-lg hover:bg-white/8 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => { setActiveDropdown(null); handleApplyFilters(); }}
                      className="flex-1 text-center px-3 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
