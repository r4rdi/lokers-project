import { createServerClient } from "@/lib/supabase/server";
import { Users, Database, ShieldAlert, CheckCircle2 } from "lucide-react";

export default async function AdminDashboard() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isMockEnv = !supabaseUrl || supabaseUrl.includes("placeholder");
  
  let stats = {
    users: 0,
    jobs: 0,
    scraping_logs: 0
  };
  
  if (!isMockEnv) {
    const supabase = await createServerClient();
    
    // We would use COUNT queries in a real implementation for efficiency
    // But for MVP, we just fetch a small limit to see if there is data
    const [{ count: uCount }, { count: jCount }, { count: sCount }] = await Promise.all([
      supabase.from("profiles").select("*", { count: 'exact', head: true }),
      supabase.from("jobs").select("*", { count: 'exact', head: true }),
      supabase.from("scraping_logs").select("*", { count: 'exact', head: true })
    ]);
    
    stats.users = uCount || 0;
    stats.jobs = jCount || 0;
    stats.scraping_logs = sCount || 0;
  } else {
    stats = { users: 142, jobs: 54, scraping_logs: 12 };
  }

  const statCards = [
    { label: "Total Pengguna", value: stats.users, icon: Users, color: "text-blue-500" },
    { label: "Total Lowongan", value: stats.jobs, icon: Database, color: "text-green-500" },
    { label: "Scraping Selesai", value: stats.scraping_logs, icon: CheckCircle2, color: "text-green-500" },
    { label: "Laporan Error", value: "0", icon: ShieldAlert, color: "text-red-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/60">
          Ringkasan platform Lokers! dan data scraper.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-ink border border-white/10 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-white/60">{stat.label}</p>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-ink border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Status Sistem (AI Scraper)</h2>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <p className="text-sm text-green-500 font-medium">Scraper Engine berjalan normal. Scraping otomatis dijadwalkan setiap 6 jam.</p>
        </div>
      </div>
    </div>
  );
}
