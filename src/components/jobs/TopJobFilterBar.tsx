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
    <div className="bg-[#141416]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 w-full relative z-[60]" ref={containerRef}>
      
      {/* Left group */}
      <div className="flex flex-1 flex-col md:flex-row items-center gap-4 w-full divide-y md:divide-y-0 md:divide-x divide-white/10">
        
        {/* Search */}
        <div className="flex items-center gap-3 px-2 w-full md:w-auto flex-1 py-2 md:py-0 relative">
          <button 
            type="button"
            onClick={() => document.getElementById('search-profesi')?.focus()}
            className="w-8 h-8 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors group"
          >
            <Search className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </button>
          <input 
            id="search-profesi" 
            type="text" 
            placeholder="Profesi (Designer, Digital Marketing, etc.)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            className="bg-transparent text-white placeholder:text-white/40 text-sm outline-none focus:outline-none focus:ring-0 focus:border-transparent rounded-none shadow-none w-full font-medium pl-1"
            autoComplete="off"
          />
        </div>
        
        {/* Level Dropdown */}
        <div className={cn("flex items-center gap-3 px-4 w-full md:w-auto relative py-2 md:py-0", activeDropdown === "level" && "z-50")}>
          <button 
            type="button"
            onClick={() => toggleDropdown("level")}
            className="w-8 h-8 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors group"
          >
            <Briefcase className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </button>
          <button 
            onClick={() => toggleDropdown("level")}
            className="flex items-center justify-between gap-2 text-white/60 hover:text-white transition-colors text-sm w-full md:w-32 lg:w-40 font-medium text-left truncate"
          >
            <span className={cn("truncate", selectedLevel ? "text-white" : "")}>{selectedLevel || "Level Pengalaman"}</span>
            <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform", activeDropdown === "level" && "rotate-180")} />
          </button>

          <AnimatePresence>
            {activeDropdown === "level" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-4 w-64 bg-[#111] border border-border rounded-lg shadow-2xl z-50 py-2 overflow-hidden"
              >
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => { setSelectedLevel(level); setActiveDropdown(null); handleApplyFilters(); }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors",
                        selectedLevel === level ? "text-blue-400 font-medium bg-blue-500/10" : "text-white/80"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                  {selectedLevel && (
                    <button
                      onClick={() => { setSelectedLevel(""); setActiveDropdown(null); handleApplyFilters(); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors border-t border-white/10 mt-1"
                    >
                      Reset Level
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Location Dropdown */}
        <div className={cn("flex items-center gap-3 px-4 w-full md:w-auto relative py-2 md:py-0", activeDropdown === "lokasi" && "z-50")}>
          <button 
            type="button"
            onClick={() => toggleDropdown("lokasi")}
            className="w-8 h-8 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors group"
          >
            <MapPin className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </button>
          <button 
            onClick={() => toggleDropdown("lokasi")}
            className="flex items-center justify-between gap-2 text-white/60 hover:text-white transition-colors text-sm w-full md:w-28 font-medium text-left truncate"
          >
            <span className={cn("truncate", selectedLokasi ? "text-white" : "")}>{selectedLokasi || "Lokasi"}</span>
            <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform", activeDropdown === "lokasi" && "rotate-180")} />
          </button>

          <AnimatePresence>
            {activeDropdown === "lokasi" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 md:left-auto md:-right-10 mt-4 w-64 bg-[#111] border border-border rounded-lg shadow-2xl z-50 py-3"
              >
                <div className="px-3 pb-3">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-sm px-3 py-2">
                    <Search className="w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Cari lokasi"
                      className="bg-transparent text-sm text-white outline-none focus:outline-none focus:ring-0 focus:border-transparent rounded-none shadow-none w-full"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      autoFocus
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {filteredLocations.length > 0 ? filteredLocations.map(loc => (
                    <button
                      key={loc}
                      onClick={() => { setSelectedLokasi(loc); setActiveDropdown(null); handleApplyFilters(); }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors",
                        selectedLokasi === loc ? "text-blue-400 font-medium bg-blue-500/10" : "text-white/80"
                      )}
                    >
                      {loc}
                    </button>
                  )) : (
                    <div className="px-4 py-3 text-sm text-white/40 text-center">Lokasi tidak ditemukan</div>
                  )}
                  {selectedLokasi && (
                    <button
                      onClick={() => { setSelectedLokasi(""); setActiveDropdown(null); handleApplyFilters(); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors border-t border-white/10 mt-1"
                    >
                      Reset Lokasi
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Right group: Salary Slider & Apply Button */}
      <div className={cn("flex flex-col md:flex-row items-center gap-4 w-full md:w-auto px-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0", activeDropdown === "gaji" && "z-50")}>
        <div className="flex flex-col w-full md:w-48 relative">
          <button 
            onClick={() => toggleDropdown("gaji")}
            className="flex items-center justify-between text-sm w-full group"
          >
            <span className="text-white/60 group-hover:text-white transition-colors">Rentang Gaji</span>
            <span className="text-white font-medium">{salary > 1000000 ? `> ${formatRupiah(salary / 1000000)}Jt` : "Semua"}</span>
          </button>
          
          {/* Visual indicator bar */}
          <div className="w-full h-1 bg-white/20 rounded-full relative mt-1 overflow-hidden cursor-pointer" onClick={() => toggleDropdown("gaji")}>
            <div 
              className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" 
              style={{ width: `${Math.max(5, ((salary - 1000000) / 29000000) * 100)}%` }}
            ></div>
          </div>

          <AnimatePresence>
            {activeDropdown === "gaji" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-4 w-80 bg-[#111] border border-border rounded-lg shadow-2xl z-50 p-5"
              >
                <div className="text-sm font-semibold text-white/80 mb-6 flex justify-between items-center">
                  Minimal Gaji
                  {salary > 1000000 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSalary(1000000); handleApplyFilters(); }}
                      className="text-xs text-red-400 hover:text-red-300 font-normal"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="mb-4 text-center">
                  <span className="text-xl font-bold text-white">{formatRupiah(salary)}</span>
                </div>

                <input
                  type="range"
                  min="1000000"
                  max="30000000"
                  step="1000000"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-md appearance-none cursor-pointer accent-blue-500"
                />

                <div className="flex justify-between text-xs text-white/40 mt-2">
                  <span>Rp 1 Jt</span>
                  <span>Rp 30 Jt</span>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => { setActiveDropdown(null); handleApplyFilters(); }}
                    className="px-5 py-2.5 text-sm bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    Terapkan
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Quick search button */}
        <button 
          onClick={handleApplyFilters}
          className="w-full md:w-12 md:h-12 py-3 md:py-0 rounded-xl md:rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-400 transition-colors shrink-0 shadow-lg shadow-blue-500/20"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
