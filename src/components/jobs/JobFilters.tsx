"use client";

import { useState } from "react";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type JobType } from "@/types";
import { cn } from "@/lib/utils";
export default function JobFilters({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobType, setJobType] = useState<JobType | "all">(
    (searchParams.get("job_type") as JobType) || "all"
  );
  
  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    if (jobType !== "all") params.set("job_type", jobType);
    
    router.push(`/jobs?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("all");
    router.push("/jobs");
  };

  return (
    <div className={cn("bg-surface border border-border rounded-xl p-5", className)}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-h3 text-ink flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Filter Lowongan
        </h3>
        <button 
          onClick={clearFilters}
          className="text-xs font-semibold text-text-subtle hover:text-primary transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" /> Reset
        </button>
      </div>

      <form onSubmit={handleApply} className="space-y-5">
        {/* Keyword Search */}
        <div>
          <label className="block text-label text-text mb-2">Kata Kunci</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Posisi atau perusahaan..."
              className="w-full pl-9 pr-4 py-2.5 rounded-md border border-border bg-surface-muted text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-label text-text mb-2">Lokasi</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
            <input 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Kota atau provinsi..."
              className="w-full pl-9 pr-4 py-2.5 rounded-md border border-border bg-surface-muted text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-label text-text mb-2">Tipe Pekerjaan</label>
          <select 
            value={jobType}
            onChange={(e) => setJobType(e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-md border border-border bg-surface-muted text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
          >
            <option value="all">Semua Tipe</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Kontrak</option>
            <option value="internship">Magang</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        {/* Submit */}
        <button 
          type="submit"
          className="w-full py-2.5 bg-ink text-white font-semibold rounded-md hover:bg-ink-soft transition-colors text-sm"
        >
          Terapkan Filter
        </button>
      </form>
    </div>
  );
}
