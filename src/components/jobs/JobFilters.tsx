"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const WORKING_SCHEDULE = [
  { id: "full-time", label: "Penuh Waktu" },
  { id: "part-time", label: "Paruh Waktu" },
  { id: "internship", label: "Magang" },
  { id: "contract", label: "Kontrak" },
  { id: "freelance", label: "Freelance/Berbasis Proyek" },
];

const EMPLOYMENT_TYPE = [
  { id: "remote", label: "Remote/WFH" },
  { id: "onsite", label: "On-Site/WFO" },
  { id: "hybrid", label: "Hybrid" },
];

export default function JobFilters({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mock states for UI testing
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>(["full-time", "part-time"]);
  const [selectedEmployment, setSelectedEmployment] = useState<string[]>(["full-day", "flexible", "distant"]);

  const toggleSchedule = (id: string) => {
    setSelectedSchedules(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleEmployment = (id: string) => {
    setSelectedEmployment(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/jobs`);
  };

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      
      {/* Promotional Banner */}
      <div className="relative rounded-2xl overflow-hidden p-8 bg-gradient-to-br from-blue-900/60 via-[#0F0F11] to-orange-900/60 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-6 text-center">
          <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">
            Dapatkan profesi terbaikmu bersama Lokers!
          </h3>
          <button className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/30">
            Pelajari lebih lanjut
          </button>
        </div>
      </div>

      {/* Filters Form */}
      <form onSubmit={handleApply} className="space-y-8 bg-transparent">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-medium text-white">Filters</h3>
          <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </div>

        {/* Working Schedule */}
        <div className="space-y-4 px-2">
          <h4 className="text-sm font-medium text-white/50">Jadwal kerja</h4>
          <div className="space-y-3">
            {WORKING_SCHEDULE.map(item => (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleSchedule(item.id)}>
                <div className={cn(
                  "w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                  selectedSchedules.includes(item.id) 
                    ? "bg-white border-white" 
                    : "border-white/20 group-hover:border-white/40"
                )}>
                  {selectedSchedules.includes(item.id) && (
                    <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  )}
                </div>
                <span className={cn(
                  "text-sm transition-colors",
                  selectedSchedules.includes(item.id) ? "text-white font-medium" : "text-white/70 group-hover:text-white"
                )}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Employment Type */}
        <div className="space-y-4 px-2">
          <h4 className="text-sm font-medium text-white/50">Tipe pekerjaan</h4>
          <div className="space-y-3">
            {EMPLOYMENT_TYPE.map(item => (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleEmployment(item.id)}>
                <div className={cn(
                  "w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                  selectedEmployment.includes(item.id) 
                    ? "bg-white border-white" 
                    : "border-white/20 group-hover:border-white/40"
                )}>
                  {selectedEmployment.includes(item.id) && (
                    <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  )}
                </div>
                <span className={cn(
                  "text-sm transition-colors",
                  selectedEmployment.includes(item.id) ? "text-white font-medium" : "text-white/70 group-hover:text-white"
                )}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

      </form>
    </div>
  );
}
