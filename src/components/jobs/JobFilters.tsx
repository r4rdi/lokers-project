"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

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

  // Initialize state from URL params or sensible defaults
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>(() => {
    const params = searchParams.getAll("schedule");
    return params.length > 0 ? params : ["full-time"];
  });

  const [selectedEmployment, setSelectedEmployment] = useState<string[]>(() => {
    const params = searchParams.getAll("employment");
    return params.length > 0 ? params : ["remote"];
  });

  // Update URL when filters change to make them shareable/bookmarkable
  useEffect(() => {
    const params = new URLSearchParams();
    selectedSchedules.forEach(schedule => params.append("schedule", schedule));
    selectedEmployment.forEach(employment => params.append("employment", employment));

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  }, [selectedSchedules, selectedEmployment, router, searchParams]);

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

  return (
    <div className={cn("space-y-6", className)}>

      {/* Mobile-optimized header */}
      <div className="flex justify-between items-center px-4 py-3 bg-surface/5">
        <h3 className="text-lg font-medium text-white">Filter Pekerjaan</h3>
        <button
          onClick={() => {
            // Reset to defaults
            setSelectedSchedules(["full-time"]);
            setSelectedEmployment(["remote"]);
          }}
          className="text-white/60 hover:text-white text-sm"
        >
          Reset
        </button>
      </div>

      {/* Working Schedule - Mobile-friendly grid */}
      <div className="space-y-4 px-4">
        <h4 className="text-base font-medium text-white/60 mb-3">Jadwal Kerja</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {WORKING_SCHEDULE.map(item => (
            <label
              key={item.id}
              className={cn(
                "flex items-center gap-2 cursor-pointer group rounded-lg border p-3",
                selectedSchedules.includes(item.id)
                  ? "bg-white/5 border-white/20"
                  : "border-white/10 hover:border-white/20"
              )}
              onClick={() => toggleSchedule(item.id)}
            >
              <div className="flex items-center justify-center w-6 h-6 shrink-0">
                {selectedSchedules.includes(item.id) && (
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={cn(
                "text-sm font-medium",
                selectedSchedules.includes(item.id) ? "text-white" : "text-white/60"
              )}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Employment Type - Mobile-friendly grid */}
      <div className="space-y-4 px-4">
        <h4 className="text-base font-medium text-white/60 mb-3">Tipe Pekerjaan</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {EMPLOYMENT_TYPE.map(item => (
            <label
              key={item.id}
              className={cn(
                "flex items-center gap-2 cursor-pointer group rounded-lg border p-3",
                selectedEmployment.includes(item.id)
                  ? "bg-white/5 border-white/20"
                  : "border-white/10 hover:border-white/20"
              )}
              onClick={() => toggleEmployment(item.id)}
            >
              <div className="flex items-center justify-center w-6 h-6 shrink-0">
                {selectedEmployment.includes(item.id) && (
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={cn(
                "text-sm font-medium",
                selectedEmployment.includes(item.id) ? "text-white" : "text-white/60"
              )}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply Filters Button - Full width on mobile */}
      <div className="px-4 pt-5">
        <button
          className="w-full py-3.5 bg-primary text-white font-medium rounded-lg transition-colors hover:bg-primary/90 flex items-center justify-center gap-2"
        >
          Terapkan Filter
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}