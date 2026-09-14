"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Save, Download, FileText, ChevronLeft, Briefcase, FileType2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CV, Job } from "@/types/index";

export default function CreateCoverLetterPage() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  
  const [selectedCv, setSelectedCv] = useState<string>("");
  const [jobInputType, setJobInputType] = useState<"saved" | "manual">("manual");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [manualJobData, setManualJobData] = useState<{ title: string; company: string; description: string }>({
    title: "",
    company: "",
    description: ""
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [cvsRes, jobsRes] = await Promise.all([
        supabase.from("cvs").select("id, name, is_primary, data").eq("user_id", user.id).order("is_primary", { ascending: false }),
        // For MVP, we fetch bookmarks or jobs created by employer. Let's just fetch all jobs to simulate selection.
        supabase.from("jobs").select("id, title, company_name, description").limit(10)
      ]);

      if (cvsRes.data) {
        setCvs(cvsRes.data);
        if (cvsRes.data.length > 0) setSelectedCv(cvsRes.data[0].id);
      }
      
      if (jobsRes.data) {
        setJobs(jobsRes.data);
      }
    }
    fetchData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedCv) return alert("Pilih CV terlebih dahulu.");
    
    let jobData;
    if (jobInputType === "saved") {
      if (!selectedJobId) return alert("Pilih lowongan tersimpan.");
      const job = jobs.find(j => j.id === selectedJobId);
      jobData = job;
    } else {
      if (!manualJobData.title || !manualJobData.company) return alert("Isi judul pekerjaan dan nama perusahaan.");
      jobData = manualJobData;
    }

    const cv = cvs.find(c => c.id === selectedCv);

    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const res = await fetch("/api/generate/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv_data: cv?.data || { name: "Dummy CV Data" },
          job_data: jobData
        })
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedContent(data.content);
      } else {
        alert(data.error || "Gagal membuat cover letter.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent) return;
    setIsSaving(true);
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase.from("cover_letters").insert({
        user_id: user.id,
        cv_id: selectedCv || null,
        job_id: jobInputType === "saved" ? selectedJobId : null,
        content: generatedContent,
      });

      if (!error) {
        alert("Cover letter berhasil disimpan ke riwayat!");
        router.push("/dashboard/cover-letters");
      } else {
        // Fallback if job_id constraint fails because it's required in schema but we used manual
        console.error("Save error:", error);
        alert("Gagal menyimpan. Pastikan skema database mengizinkan job_id null jika manual.");
      }
    }
    setIsSaving(false);
  };

  const handleDownloadTxt = () => {
    if (!generatedContent) return;
    const blob = new Blob([generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cover_Letter_${manualJobData.company || "Company"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link 
        href="/dashboard/cover-letters" 
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary transition-colors mb-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Riwayat Cover Letters
      </Link>

      <div className="mb-6">
        <h1 className="text-h2 text-ink flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Cover Letter Generator
        </h1>
        <p className="text-body text-text-muted">
          Hasilkan surat lamaran kerja yang sangat personal dan ATS-friendly dalam hitungan detik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Configuration */}
        <div className="lg:col-span-5 space-y-6">
          {/* CV Selection */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-text-subtle" /> 1. Pilih Profil CV
            </h3>
            
            {cvs.length === 0 ? (
              <div className="p-4 bg-surface-muted rounded-md text-sm text-text-muted text-center border border-dashed border-border">
                Anda belum memiliki CV tersimpan. AI akan menggunakan template kosong (kurang optimal).
                <Link href="/dashboard/cv/create" className="text-primary block mt-2 font-semibold">Buat CV Sekarang</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cvs.map(cv => (
                  <label 
                    key={cv.id} 
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedCv === cv.id ? "border-primary bg-primary-soft" : "border-border hover:bg-surface-muted"
                    )}
                  >
                    <input 
                      type="radio" 
                      name="cvSelect" 
                      value={cv.id}
                      checked={selectedCv === cv.id}
                      onChange={() => setSelectedCv(cv.id)}
                      className="accent-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold text-ink">{cv.name}</p>
                      {cv.is_primary && <p className="text-xs text-primary font-medium">CV Utama</p>}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Job Selection */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-text-subtle" /> 2. Target Lowongan
            </h3>
            
            <div className="flex bg-surface-muted rounded-lg p-1 mb-5">
              <button
                onClick={() => setJobInputType("manual")}
                className={cn(
                  "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors",
                  jobInputType === "manual" ? "bg-surface shadow-sm text-ink" : "text-text-muted hover:text-ink"
                )}
              >
                Input Manual
              </button>
              <button
                onClick={() => setJobInputType("saved")}
                className={cn(
                  "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors",
                  jobInputType === "saved" ? "bg-surface shadow-sm text-ink" : "text-text-muted hover:text-ink"
                )}
              >
                Dari Tersimpan
              </button>
            </div>

            {jobInputType === "manual" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-subtle mb-1">Posisi Pekerjaan</label>
                  <input 
                    type="text" 
                    value={manualJobData.title}
                    onChange={(e) => setManualJobData(p => ({ ...p, title: e.target.value }))}
                    placeholder="Software Engineer"
                    className="w-full px-3 py-2 rounded-md border border-border bg-surface text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-subtle mb-1">Nama Perusahaan</label>
                  <input 
                    type="text" 
                    value={manualJobData.company}
                    onChange={(e) => setManualJobData(p => ({ ...p, company: e.target.value }))}
                    placeholder="PT Teknologi Modern"
                    className="w-full px-3 py-2 rounded-md border border-border bg-surface text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-subtle mb-1">Deskripsi & Syarat (Opsional namun disarankan)</label>
                  <textarea 
                    value={manualJobData.description}
                    onChange={(e) => setManualJobData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Copy-paste deskripsi pekerjaan di sini agar AI bisa mencocokkan skill Anda secara akurat."
                    rows={4}
                    className="w-full px-3 py-2 rounded-md border border-border bg-surface text-sm outline-none focus:border-primary resize-y"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.length === 0 ? (
                  <p className="text-sm text-text-muted text-center py-4">Belum ada lowongan tersimpan.</p>
                ) : (
                  <select 
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md border border-border bg-surface text-sm outline-none focus:border-primary"
                  >
                    <option value="" disabled>Pilih Lowongan</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>{job.title} di {job.company_name}</option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-primary to-[#60A5FA] hover:shadow-glow text-on-primary font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Meracik Surat Lamaran...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate dengan AI
              </>
            )}
          </button>
        </div>

        {/* Right Panel: Editor Preview */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-xl flex flex-col h-[700px]">
          <div className="p-4 border-b border-border flex items-center justify-between bg-surface-muted rounded-t-xl">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <FileType2 className="w-4 h-4 text-primary" />
              Hasil & Editor
            </h3>
            
            <div className="flex gap-2">
              <button 
                onClick={handleDownloadTxt}
                disabled={!generatedContent}
                className="p-2 bg-surface border border-border rounded-md text-text-muted hover:text-ink hover:bg-surface-muted transition-colors disabled:opacity-50"
                title="Download TXT"
              >
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={handleSave}
                disabled={!generatedContent || isSaving}
                className="flex items-center gap-2 px-3 py-1.5 bg-ink hover:bg-ink-soft text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50"
              >
                {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan
              </button>
            </div>
          </div>

          <div className="flex-1 p-0 relative">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/50 backdrop-blur-sm z-10">
                <Sparkles className="w-12 h-12 text-primary animate-pulse mb-4" />
                <p className="text-ink font-semibold animate-pulse">Menghasilkan draf terbaik untuk Anda...</p>
              </div>
            ) : !generatedContent ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-text-subtle p-8 text-center">
                <FileType2 className="w-16 h-16 mb-4 opacity-20" />
                <p>Pilih CV dan lowongan di samping, lalu klik Generate untuk melihat keajaiban AI.</p>
              </div>
            ) : null}

            <textarea 
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              className="w-full h-full p-6 lg:p-8 resize-none outline-none text-ink bg-surface font-sans text-sm md:text-base leading-relaxed"
              placeholder="Hasil Cover Letter akan muncul di sini. Anda bebas mengedit teks ini sebelum menyimpannya."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
