"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CVForm from "@/components/cv/CVForm";
import PDFUploader from "@/components/cv/PDFUploader";
import Link from "next/link";
import { ChevronLeft, Download } from "lucide-react";

// Define the type for parsed CV data (matches PDFUploader's output)
interface ParsedCVData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
}

export default function CreateCVPage() {
  const router = useRouter();
  const [parsedData, setParsedData] = useState<ParsedCVData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleUploadSuccess = (data: ParsedCVData) => {
    setParsedData(data);
  };

  const handleSubmit = async (formData: ParsedCVData) => {
    setIsSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Create new CV entry
      const { error } = await supabase.from("cvs").insert({
        user_id: user.id,
        name: formData.name,
        data: formData, // Store full JSON
      });

      if (!error) {
        router.push("/dashboard/cv");
        router.refresh();
      } else {
        console.error("Failed to save CV:", error);
        setIsSaving(false);
      }
    } else {
      // Local dev mock behaviour
      setTimeout(() => {
        setIsSaving(false);
        router.push("/dashboard/cv");
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Link 
        href="/dashboard/cv" 
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Kembali ke kelola CV
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-ink mb-2">Buat CV Baru</h1>
          <p className="text-body text-text-muted">
            Upload CV PDF lama Anda untuk diurai oleh AI, atau isi form secara manual.
          </p>
        </div>
        <a 
          href="/Contoh-Resume-Acuan-ATS.pdf"
          download="Contoh-Resume-Acuan-ATS.pdf"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-border text-text hover:text-primary hover:border-primary/50 font-semibold rounded-md transition-colors text-sm shadow-sm whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Unduh Contoh PDF Referensi
        </a>
      </div>

      {!parsedData ? (
        <div className="space-y-8">
          <PDFUploader onUploadSuccess={handleUploadSuccess} />
          
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative px-4 bg-background text-sm font-semibold text-text-muted">
              Atau isi secara manual
            </div>
          </div>

          <CVForm onSubmit={handleSubmit} isLoading={isSaving} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-success/10 border border-success/20 rounded-md text-success text-sm font-bold flex items-center gap-2">
            ✅ AI berhasil mengekstrak data dari CV Anda! Silakan periksa dan lengkapi data di bawah ini.
          </div>
          
          <CVForm 
            initialData={parsedData} 
            onSubmit={handleSubmit} 
            isLoading={isSaving} 
          />
        </div>
      )}
    </div>
  );
}
