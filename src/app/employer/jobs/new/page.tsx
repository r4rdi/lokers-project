"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Briefcase, Building2, MapPin, DollarSign, Calendar, Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Job form schema
const jobSchema = z.object({
  title: z.string().min(5, "Posisi pekerjaan minimal 5 karakter"),
  company_name: z.string().min(3, "Nama perusahaan minimal 3 karakter"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  job_type: z.enum(["full-time", "part-time", "contract", "internship", "remote"]),
  salary_min: z.string().optional(),
  salary_max: z.string().optional(),
  description: z.string().min(50, "Deskripsi pekerjaan minimal 50 karakter"),
  requirements: z.string().min(50, "Persyaratan minimal 50 karakter"),
  apply_url: z.string().url("URL lamaran tidak valid").or(z.literal("")).optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      job_type: "full-time",
    }
  });

  const onSubmit = async (data: JobFormValues) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan lowongan");
      }

      router.push("/employer/jobs");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
      setErrorMsg(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col gap-4">
        <Link 
          href="/employer/jobs"
          className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-ink transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Lowongan
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight mb-1">
            Pasang Lowongan Baru
          </h1>
          <p className="text-text-muted">
            Lengkapi detail pekerjaan di bawah ini untuk dipublikasikan.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-error/10 text-error border border-error/20 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-surface border border-border p-6 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold text-ink border-b border-border pb-4">Info Dasar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-text-muted" />
                Posisi Pekerjaan <span className="text-error">*</span>
              </label>
              <input
                {...register("title")}
                type="text"
                placeholder="Misal: Senior Frontend Engineer"
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-ink"
              />
              {errors.title && <p className="text-xs text-error">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink flex items-center gap-2">
                <Building2 className="w-4 h-4 text-text-muted" />
                Nama Perusahaan <span className="text-error">*</span>
              </label>
              <input
                {...register("company_name")}
                type="text"
                placeholder="Misal: PT Teknologi Nusantara"
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-ink"
              />
              {errors.company_name && <p className="text-xs text-error">{errors.company_name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink flex items-center gap-2">
                <MapPin className="w-4 h-4 text-text-muted" />
                Lokasi <span className="text-error">*</span>
              </label>
              <input
                {...register("location")}
                type="text"
                placeholder="Misal: Jakarta Selatan (atau Remote)"
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-ink"
              />
              {errors.location && <p className="text-xs text-error">{errors.location.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink flex items-center gap-2">
                <Calendar className="w-4 h-4 text-text-muted" />
                Tipe Pekerjaan <span className="text-error">*</span>
              </label>
              <select
                {...register("job_type")}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-ink"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
              {errors.job_type && <p className="text-xs text-error">{errors.job_type.message}</p>}
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold text-ink border-b border-border pb-4 flex items-center justify-between">
            Kompensasi 
            <span className="text-xs font-normal text-text-muted bg-surface-muted px-2 py-1 rounded-md">Opsional</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-text-muted" />
                Gaji Minimum (IDR)
              </label>
              <input
                {...register("salary_min")}
                type="number"
                placeholder="Misal: 5000000"
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-ink"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-text-muted" />
                Gaji Maksimum (IDR)
              </label>
              <input
                {...register("salary_max")}
                type="number"
                placeholder="Misal: 10000000"
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-ink"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold text-ink border-b border-border pb-4">Deskripsi &amp; Syarat</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">
                Deskripsi Pekerjaan <span className="text-error">*</span>
              </label>
              <textarea
                {...register("description")}
                rows={5}
                placeholder="Jelaskan peran dan tanggung jawab dari pekerjaan ini..."
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-ink resize-y"
              ></textarea>
              {errors.description && <p className="text-xs text-error">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">
                Persyaratan <span className="text-error">*</span>
              </label>
              <textarea
                {...register("requirements")}
                rows={5}
                placeholder="Sebutkan kualifikasi, skill, atau pengalaman yang dibutuhkan..."
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-ink resize-y"
              ></textarea>
              {errors.requirements && <p className="text-xs text-error">{errors.requirements.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink flex items-center gap-2">
                Link Formulir Lamaran Eksternal
                <span className="text-xs font-normal text-text-muted bg-surface-muted px-2 py-1 rounded-md">Opsional</span>
              </label>
              <input
                {...register("apply_url")}
                type="url"
                placeholder="https://company.com/careers/apply/123"
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-ink"
              />
              <p className="text-xs text-text-muted">
                Jika diisi, pelamar akan diarahkan ke link ini saat menekan tombol &apos;Lamar&apos;. Jika dikosongkan, fitur &apos;Lamar dengan Lokers.biz.id&apos; akan digunakan (segera hadir).
              </p>
              {errors.apply_url && <p className="text-xs text-error">{errors.apply_url.message}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex items-center gap-2 px-8 py-3 bg-warning text-black font-bold rounded-lg transition-all shadow-subtle",
              isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-warning/90"
            )}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Publikasikan Lowongan
          </button>
        </div>
      </form>
    </div>
  );
}
