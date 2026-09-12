"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"job_seeker" | "employer" | "admin">("job_seeker");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    
    // Check if URL is local dev
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-ink text-white relative overflow-hidden">
        {/* Decor */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              Lokers<span className="text-primary">!</span>
            </span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-extrabold mb-6 leading-tight">
              Langkah awal karir impianmu
            </h1>
            <p className="text-lg text-white/60 leading-relaxed mb-8">
              Bergabunglah dengan ribuan pencari kerja lainnya yang telah menghemat 80% waktu mereka dengan AI Cover Letter Generator.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-12 justify-center">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-ink">
              Lokers<span className="text-primary">!</span>
            </span>
          </Link>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-h2 text-ink mb-4">Cek Email Anda</h2>
              <p className="text-body text-text-muted mb-8">
                Kami telah mengirimkan link konfirmasi ke <strong>{email}</strong>. Silakan klik link tersebut untuk mengaktifkan akun Anda.
              </p>
              <Link
                href="/login"
                className="w-full block py-3.5 px-4 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle"
              >
                Kembali ke halaman Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-h2 text-ink mb-3">Buat Akun Gratis</h2>
                <p className="text-body text-text-muted">
                  Dapatkan 3 AI cover letter gratis setiap bulan!
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-md bg-error/10 border border-error/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                  <p className="text-sm text-error font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                {/* Role Selection */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <label
                    className={`cursor-pointer px-4 py-3 rounded-md border text-center transition-all ${
                      role === "job_seeker"
                        ? "border-primary bg-primary-soft text-primary font-bold"
                        : "border-border bg-surface text-text-muted hover:bg-surface-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="job_seeker"
                      checked={role === "job_seeker"}
                      onChange={() => setRole("job_seeker")}
                      className="sr-only"
                    />
                    Pencari Kerja
                  </label>
                  <label
                    className={`cursor-pointer px-4 py-3 rounded-md border text-center transition-all ${
                      role === "employer"
                        ? "border-primary bg-primary-soft text-primary font-bold"
                        : "border-border bg-surface text-text-muted hover:bg-surface-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="employer"
                      checked={role === "employer"}
                      onChange={() => setRole("employer")}
                      className="sr-only"
                    />
                    Perusahaan
                  </label>
                  <label
                    className={`cursor-pointer px-4 py-3 rounded-md border text-center transition-all ${
                      role === "admin"
                        ? "border-primary bg-primary-soft text-primary font-bold"
                        : "border-border bg-surface text-text-muted hover:bg-surface-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === "admin"}
                      onChange={() => setRole("admin")}
                      className="sr-only"
                    />
                    Admin
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-label text-text mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Budi Santoso"
                    required
                    className="w-full px-4 py-3 rounded-md border border-border bg-surface-muted text-text placeholder:text-text-subtle focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-label text-text mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full px-4 py-3 rounded-md border border-border bg-surface-muted text-text placeholder:text-text-subtle focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-label text-text mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 rounded-md border border-border bg-surface-muted text-text placeholder:text-text-subtle focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Daftar Sekarang
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-text-muted">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-bold text-primary hover:text-primary-hover"
                >
                  Masuk di sini
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
