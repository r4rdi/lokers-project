"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, ArrowRight, Github, Mail, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push(next);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-ink text-white relative overflow-hidden">
        {/* Decor */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        
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
              Selamat datang kembali
            </h1>
            <p className="text-lg text-white/60 leading-relaxed mb-8">
              Pekerjaan impian Anda sudah menunggu. Lanjutkan proses melamar Anda dengan AI hari ini.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 glass-subtle max-w-sm">
            <p className="text-sm text-white/80 italic mb-4">
              "Lokers membuat proses melamar kerja yang tadinya membosankan menjadi sangat mudah. Saya dapat panggilan interview hanya dalam 3 hari!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/30" />
              <div>
                <p className="text-sm font-bold">Budi Santoso</p>
                <p className="text-xs text-white/50">Software Engineer</p>
              </div>
            </div>
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

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-h2 text-ink mb-3">Masuk ke Akun</h2>
            <p className="text-body text-text-muted">
              Masukkan email dan password Anda
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-md bg-error/10 border border-error/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
              <p className="text-sm text-error font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-label text-text"
                >
                  Password
                </label>
                <Link
                  href="/reset-password"
                  className="text-xs font-semibold text-primary hover:text-primary-hover"
                >
                  Lupa Password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-md border border-border bg-surface-muted text-text placeholder:text-text-subtle focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-text-muted">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-bold text-primary hover:text-primary-hover"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
