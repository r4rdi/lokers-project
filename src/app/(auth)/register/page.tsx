"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {

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
    <div className="min-h-screen flex items-center justify-center bg-[#0B090F] relative overflow-hidden font-sans text-white p-4">
      {/* Decorative Blobs */}
      <div className="absolute top-[10%] right-[15%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] left-[10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[360px] flex flex-col">
        {/* Logo Outside Card */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-extrabold tracking-tight italic drop-shadow-lg">
              Lokers<span className="text-blue-500">!</span>
            </span>
          </Link>
        </div>

        {/* Glass Card */}
        <div className="w-full bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
          {success ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5 border border-green-500/30">
              <CheckCircle2 className="w-7 h-7 text-green-400" />
            </div>
            <h2 className="text-xl font-bold mb-3">Cek Email Anda</h2>
            <p className="text-xs text-white/60 mb-6">
              Kami telah mengirimkan link konfirmasi ke <strong>{email}</strong>. Silakan klik link tersebut untuk mengaktifkan akun Anda.
            </p>
            <Link
              href="/login"
              className="w-full block py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors text-center text-sm"
            >
              Kembali ke Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold mb-2">Sign up</h2>
              <p className="text-[11px] text-white/50 mt-1">Build your career. Find your opportunity.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-red-400 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3">
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <label
                  className={`cursor-pointer px-3 py-2 rounded-xl border text-center transition-all text-xs font-medium ${
                    role === "job_seeker"
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
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
                  className={`cursor-pointer px-3 py-2 rounded-xl border text-center transition-all text-xs font-medium ${
                    role === "employer"
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
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
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <div className="w-4 h-4 text-white/40 border border-white/20 rounded flex items-center justify-center text-[9px] font-bold">N</div>
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama Lengkap"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (Min. 8 Karakter)"
                    required
                    minLength={8}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed text-xs"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto block" />
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-[11px] text-white/50">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                Sign in
              </Link>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
}
