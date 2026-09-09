"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CVForm from "@/components/cv/CVForm";
import PDFUploader from "@/components/cv/PDFUploader";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CreateCVPage() {
  const router = useRouter();
  const [parsedData, setParsedData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleUploadSuccess = (data: any) => {
    setParsedData(data);
  };

  const handleSubmit = async (formData: any) => {
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

      <div>
        <h1 className="text-h2 text-ink mb-2">Buat CV Baru</h1>
        <p className="text-body text-text-muted">
          Upload CV PDF lama Anda untuk diurai oleh AI, atau isi form secara manual.
        </p>
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
