"use client";

import { useState, useRef } from "react";
import { UploadCloud, File as FileIcon, X, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PDFUploaderProps {
  onUploadSuccess: (parsedData: any) => void;
}

export default function PDFUploader({ onUploadSuccess }: PDFUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setError(null);
    if (selectedFile.type !== "application/pdf") {
      setError("Hanya file PDF yang didukung.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setError("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUploadAndParse = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);

    // In MVP, we would normally send to an API Route: 
    // const formData = new FormData();
    // formData.append("file", file);
    // const res = await fetch("/api/parse-cv", { method: "POST", body: formData });
    
    // Simulate AI parsing delay
    setTimeout(() => {
      setIsUploading(false);
      // Mock parsed data
      onUploadSuccess({
        fullName: "Budi Santoso",
        email: "budi.santoso@example.com",
        phone: "+62 812 3456 7890",
        summary: "Software Engineer berpengalaman dengan fokus pada pengembangan web modern.",
        experience: [
          {
            title: "Senior Frontend Engineer",
            company: "Tech Corp",
            startDate: "2020-01",
            endDate: "Present",
            description: "Memimpin tim frontend untuk aplikasi SaaS utama."
          }
        ]
      });
    }, 2500);
  };

  const resetSelection = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-h3 text-ink mb-2">Upload CV Anda (Smart Parser)</h2>
        <p className="text-body text-text-muted">
          AI kami akan mengekstrak informasi dari PDF Anda secara otomatis untuk mempercepat proses.
        </p>
      </div>

      {!file ? (
        <div 
          className={cn(
            "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer",
            isDragging ? "border-primary bg-primary-soft" : "border-border bg-surface-muted hover:border-primary/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInput} 
            accept="application/pdf" 
            className="hidden" 
          />
          <div className="w-16 h-16 rounded-full bg-surface shadow-sm flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm font-bold text-ink mb-1">Klik untuk upload atau seret file ke sini</p>
          <p className="text-xs text-text-muted">Format PDF (Maks. 5MB)</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl p-6 bg-surface-muted">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-soft flex items-center justify-center shrink-0">
                <FileIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-ink truncate">{file.name}</p>
                <p className="text-xs text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!isUploading && (
              <button onClick={resetSelection} className="p-2 text-text-subtle hover:text-error transition-colors rounded-full hover:bg-surface">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <button 
            onClick={handleUploadAndParse}
            disabled={isUploading}
            className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI sedang membaca CV...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Ekstrak Data dengan AI
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 rounded-md bg-error/10 border border-error/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <p className="text-sm text-error font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
