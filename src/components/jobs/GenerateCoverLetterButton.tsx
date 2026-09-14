"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";

interface GenerateCoverLetterButtonProps {
  jobId: string;
}

export default function GenerateCoverLetterButton({ jobId }: GenerateCoverLetterButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "NO_CV") {
          throw new Error("Anda belum memiliki CV. Silakan buat profil CV di Dashboard Anda terlebih dahulu.");
        }
        if (response.status === 401) {
          throw new Error("Anda harus login terlebih dahulu untuk menggunakan fitur ini.");
        }
        throw new Error(data.message || data.error || "Terjadi kesalahan saat membuat cover letter.");
      }

      // Success, redirect to the viewer page
      router.push(`/dashboard/cover-letters/${data.coverLetterId}`);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      <button 
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full py-2.5 px-4 bg-primary-soft text-primary font-bold rounded-md transition-colors hover:bg-primary/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Membuat Cover Letter...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Buat AI Cover Letter
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-xs text-error text-center">{error}</p>
      )}
    </div>
  );
}
