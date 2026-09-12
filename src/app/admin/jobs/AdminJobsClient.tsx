"use client";

import { useState } from "react";
import { Job } from "@/types";
import { Search, Filter, MoreVertical, MapPin, Building2, ExternalLink, Calendar, DollarSign, Clock, LayoutDashboard } from "lucide-react";
import ToggleFeaturedButton from "./ToggleFeaturedButton";
import Image from "next/image";

interface AdminJobsClientProps {
  initialJobs: Job[];
}

export default function AdminJobsClient({ initialJobs }: AdminJobsClientProps) {
  const [jobs] = useState<Job[]>(initialJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs.length > 0 ? jobs[0] : null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) || 
    job.company_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manajemen Lowongan</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 text-white/70 rounded-full text-sm font-medium hover:bg-white/10 transition-colors shadow-sm flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {jobs.length} Active Jobs
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            + Tambah Lowongan
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-[600px] max-h-[800px]">
        {/* Left Panel: Master List */}
        <div className="w-1/3 flex flex-col bg-[#141416]/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5 flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <input type="checkbox" className="w-4 h-4 rounded text-blue-600 bg-white/5 border-white/20 focus:ring-blue-500 focus:ring-offset-0" />
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  placeholder="Filter by Job Title or Company"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-black/40 border border-white/10 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-white/30"
                />
              </div>
              <button className="p-1.5 text-blue-400 font-medium text-sm hover:underline whitespace-nowrap">
                Sort By Date ▼
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-black/20">
            {filteredJobs.length === 0 ? (
              <div className="text-center p-8 text-white/40 text-sm">Belum ada data.</div>
            ) : (
              filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => setSelectedJob(job)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                    selectedJob?.id === job.id 
                      ? "bg-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-blue-500/50 ring-1 ring-blue-500/30" 
                      : "bg-transparent border-transparent hover:border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div className="pt-1">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-600 bg-black/40 border-white/20 focus:ring-offset-0" onClick={(e) => e.stopPropagation()} />
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 overflow-hidden border border-white/10">
                    {job.company_logo_url ? (
                      <Image src={job.company_logo_url} alt={job.company_name} width={40} height={40} className="object-cover" />
                    ) : (
                      <Building2 className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm truncate ${selectedJob?.id === job.id ? "text-blue-400" : "text-white"}`}>
                      {job.title}
                    </h3>
                    <p className="text-xs text-white/50 truncate mb-1">{job.company_name}</p>
                    <p className="text-[11px] text-white/30 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Posted {(job as any).formattedPostDate}
                    </p>
                  </div>
                  
                  <button className="p-1 text-white/40 hover:text-white hover:bg-white/10 rounded-md">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Detail View */}
        <div className="flex-1 bg-[#141416]/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/10 flex flex-col overflow-hidden">
          {selectedJob ? (
            <>
              {/* Detail Header */}
              <div className="p-6 border-b border-white/10 flex items-start justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                    {selectedJob.company_logo_url ? (
                      <Image src={selectedJob.company_logo_url} alt={selectedJob.company_name} width={64} height={64} className="object-cover" />
                    ) : (
                      <Building2 className="w-8 h-8 text-white/40" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedJob.title}</h2>
                    <p className="text-sm text-white/60 font-medium">{selectedJob.company_name}</p>
                    <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Posted {(selectedJob as any).formattedPostDate} from <span className="capitalize">{selectedJob.source}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-black/40 rounded-md border border-white/10 p-0.5">
                    <ToggleFeaturedButton jobId={selectedJob.id} isFeatured={selectedJob.is_featured} />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow-sm transition-colors">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm font-semibold rounded-md shadow-sm transition-colors hover:text-red-400 hover:border-red-500/50">
                    Delete
                  </button>
                </div>
              </div>

              {/* Detail Tabs */}
              <div className="px-6 flex gap-6 border-b border-white/10 bg-black/20">
                {['overview', 'activities', 'emails', 'my files'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${
                      activeTab === tab 
                        ? "border-blue-500 text-blue-400" 
                        : "border-transparent text-white/40 hover:text-white/70"
                    }`}
                  >
                    {tab === 'overview' ? 'Overview' : tab}
                  </button>
                ))}
              </div>

              {/* Detail Content */}
              <div className="p-6 flex-1 overflow-y-auto bg-black/10">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="bg-white/5 p-5 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
                      <h3 className="text-sm font-bold text-white mb-4">General Information</h3>
                      
                      <div className="grid grid-cols-3 gap-y-4 text-sm">
                        <div className="text-white/50">Tags</div>
                        <div className="col-span-2 flex gap-2">
                          <span className="px-2.5 py-1 bg-white/10 text-white/80 rounded-full text-xs font-medium border border-white/10">
                            {selectedJob.job_type}
                          </span>
                          {selectedJob.is_featured && (
                            <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-medium border border-yellow-500/30">
                              Prioritas
                            </span>
                          )}
                          <button className="px-2 py-0.5 text-xs font-semibold text-green-400 border border-green-400/30 rounded-full hover:bg-green-500/10">+ Add</button>
                        </div>
                        
                        <div className="text-white/50">Location</div>
                        <div className="col-span-2 font-medium text-white/80 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-white/40" />
                          {selectedJob.location}
                        </div>
                        
                        <div className="text-white/50">Salary</div>
                        <div className="col-span-2 font-medium text-white/80 flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-white/40" />
                          {selectedJob.salary_min && selectedJob.salary_max 
                            ? `${selectedJob.salary_min} - ${selectedJob.salary_max} ${selectedJob.salary_currency}`
                            : 'Dirahasiakan'}
                        </div>
                        
                        <div className="text-white/50">Sources</div>
                        <div className="col-span-2 flex gap-2">
                           <span className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-xs font-medium capitalize border border-white/10">
                             {selectedJob.source}
                           </span>
                        </div>

                        <div className="text-white/50">Apply Link</div>
                        <div className="col-span-2">
                          {selectedJob.apply_url ? (
                            <a href={selectedJob.apply_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-medium">
                              Link Eksternal <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-white/30 italic">Tidak ada</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-5 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
                      <h3 className="text-sm font-bold text-white mb-3">Job Description</h3>
                      <div 
                        className="text-sm text-white/70 prose prose-sm prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedJob.description || "Tidak ada deskripsi." }}
                      />
                    </div>
                  </div>
                )}
                {activeTab !== 'overview' && (
                  <div className="flex flex-col items-center justify-center h-40 text-white/30">
                    <LayoutDashboard className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-sm">Tab {activeTab} belum diimplementasi (TBA)</p>
                  </div>
                )}
              </div>
            </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-white/30">
               <Building2 className="w-12 h-12 mb-3 opacity-20" />
               <p>Pilih lowongan dari daftar di kiri untuk melihat detail.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
