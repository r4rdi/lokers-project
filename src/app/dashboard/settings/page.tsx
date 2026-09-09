import { createServerClient } from "@/lib/supabase/server";
import { User, Lock, CreditCard, Save } from "lucide-react";

export default async function SettingsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isMockEnv = !supabaseUrl || supabaseUrl.includes("placeholder");
  
  let profile = { full_name: "", email: "", role: "", phone: "", location: "" };
  let subscription = { plan_id: "free", status: "active", current_period_end: "" };
  
  if (!isMockEnv) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const [{ data: pData }, { data: sData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("subscriptions").select("*").eq("user_id", user.id).single()
      ]);
      
      if (pData) profile = pData;
      if (sData) subscription = sData;
    }
  } else {
    profile = { full_name: "Budi Santoso", email: "budi@example.com", role: "job_seeker", phone: "+62 812 3456 7890", location: "Jakarta" };
    subscription = { plan_id: "free", status: "active", current_period_end: new Date(Date.now() + 86400000 * 365 * 100).toISOString() };
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-h2 text-ink mb-2">Pengaturan Akun</h1>
        <p className="text-body text-text-muted">
          Kelola informasi profil, preferensi, dan langganan Anda di sini.
        </p>
      </div>

      {/* Profil Section */}
      <div className="bg-surface border border-border rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-h3 text-ink">Informasi Profil</h2>
        </div>
        
        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-label text-text mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                defaultValue={profile.full_name || ""}
                className="w-full px-4 py-2.5 rounded-md border border-border bg-surface-muted text-sm focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-label text-text mb-2">Email</label>
              <input 
                type="email" 
                defaultValue={profile.email || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-text-subtle text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-label text-text mb-2">Nomor Telepon</label>
              <input 
                type="text" 
                defaultValue={profile.phone || ""}
                className="w-full px-4 py-2.5 rounded-md border border-border bg-surface-muted text-sm focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-label text-text mb-2">Lokasi Domisili</label>
              <input 
                type="text" 
                defaultValue={profile.location || ""}
                className="w-full px-4 py-2.5 rounded-md border border-border bg-surface-muted text-sm focus:border-primary outline-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button type="button" className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle text-sm">
              <Save className="w-4 h-4" /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

      {/* Keamanan */}
      <div className="bg-surface border border-border rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-h3 text-ink">Keamanan & Password</h2>
        </div>
        
        <form className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-label text-text mb-2">Password Saat Ini</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full md:w-1/2 px-4 py-2.5 rounded-md border border-border bg-surface-muted text-sm focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-label text-text mb-2">Password Baru</label>
              <input 
                type="password" 
                placeholder="Minimal 8 karakter"
                className="w-full md:w-1/2 px-4 py-2.5 rounded-md border border-border bg-surface-muted text-sm focus:border-primary outline-none"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button type="button" className="px-5 py-2 border border-border bg-surface text-ink font-semibold rounded-md hover:bg-surface-muted transition-colors text-sm">
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Subscription */}
      <div className="bg-surface border border-border rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
          <CreditCard className="w-5 h-5 text-primary" />
          <h2 className="text-h3 text-ink">Paket Langganan (SaaS)</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-5 border border-primary/20 bg-primary-soft rounded-lg">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-bold text-ink uppercase">{subscription.plan_id.replace(/_/g, ' ')}</h3>
              <span className="px-2 py-0.5 bg-success/20 text-success text-xs font-bold rounded-md">Aktif</span>
            </div>
            <p className="text-sm text-text-muted">
              {subscription.plan_id === 'free' 
                ? "Anda menggunakan paket dasar. Batas 3 AI Cover Letter per bulan." 
                : "Nikmati akses tak terbatas untuk AI Cover Letter dan fitur premium lainnya."}
            </p>
          </div>
          
          {subscription.plan_id === 'free' ? (
            <button className="whitespace-nowrap px-6 py-2.5 bg-gradient-to-r from-primary to-[#60A5FA] hover:shadow-glow text-on-primary font-bold rounded-md transition-all">
              Upgrade Premium
            </button>
          ) : (
            <button className="whitespace-nowrap px-6 py-2.5 bg-surface border border-border text-error hover:bg-error/10 font-bold rounded-md transition-colors">
              Batalkan Langganan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
