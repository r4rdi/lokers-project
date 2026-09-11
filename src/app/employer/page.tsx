import Link from "next/link";
import { Briefcase, Eye, MousePointerClick, PlusCircle } from "lucide-react";

export const metadata = {
  title: "Employer Dashboard - Lokers.biz.id",
};

export default function EmployerDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-ink tracking-tight mb-2">
          Employer Dashboard
        </h1>
        <p className="text-text-muted">
          Selamat datang di panel kontrol rekrutmen Anda. Kelola lowongan dan temukan kandidat terbaik.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-text-subtle mb-1">Lowongan Aktif</p>
              <h3 className="text-4xl font-bold text-ink">0</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-warning" />
            </div>
          </div>
          <div className="text-sm text-text-subtle">
            Batas paket Anda: 5 lowongan
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-text-subtle mb-1">Total Views</p>
              <h3 className="text-4xl font-bold text-ink">0</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Eye className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="text-sm text-text-subtle">
            Dari semua lowongan Anda
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-text-subtle mb-1">Total Klik / AI Generate</p>
              <h3 className="text-4xl font-bold text-ink">0</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
              <MousePointerClick className="w-6 h-6 text-success" />
            </div>
          </div>
          <div className="text-sm text-text-subtle">
            Kandidat tertarik dengan lowongan Anda
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-border p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-ink mb-2">Butuh kandidat baru?</h2>
          <p className="text-text-muted">
            Pasang lowongan sekarang dan jangkau ribuan pencari kerja di platform Lokers.biz.id.
          </p>
        </div>
        <Link 
          href="/employer/jobs/new"
          className="flex items-center gap-2 px-6 py-3 bg-warning text-black font-bold rounded-full hover:bg-warning/90 transition-all shadow-subtle shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          Pasang Lowongan
        </Link>
      </div>
      
    </div>
  );
}
