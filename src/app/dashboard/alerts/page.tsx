import { createServerClient } from "@/lib/supabase/server";
import { Bell, Plus, Search, MapPin, MoreVertical } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default async function JobAlertsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isMockEnv = !supabaseUrl || supabaseUrl.includes("placeholder");
  
  let alerts: any[] = [];
  
  if (!isMockEnv) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from("job_alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      alerts = data || [];
    }
  }

  // Mock data if empty for layout presentation
  if (alerts.length === 0 && isMockEnv) {
    alerts = [
      {
        id: "1",
        keyword: "Frontend Developer",
        location: "Jakarta",
        job_type: "full-time",
        frequency: "daily",
        is_active: true,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "2",
        keyword: "UI/UX Designer",
        location: null,
        job_type: "remote",
        frequency: "weekly",
        is_active: false,
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      }
    ];
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-ink mb-2">Job Alerts</h1>
          <p className="text-body text-text-muted">
            Terima pemberitahuan email saat ada lowongan baru yang sesuai dengan kriteria Anda.
          </p>
        </div>
        <button 
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Buat Alert Baru
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-surface border border-dashed border-border rounded-xl text-center min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-h3 text-ink mb-2">Belum ada Job Alert</h3>
          <p className="text-body text-text-muted max-w-sm mb-6">
            Pastikan Anda tidak ketinggalan peluang karir terbaru. Buat alert sekarang dan biarkan sistem bekerja untuk Anda.
          </p>
          <button 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle"
          >
            <Plus className="w-5 h-5" />
            Buat Alert
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.map((alert) => (
            <div key={alert.id} className={`bg-surface border rounded-xl p-5 flex flex-col transition-all ${alert.is_active ? 'border-primary shadow-subtle' : 'border-border opacity-70'}`}>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${alert.is_active ? 'bg-primary-soft text-primary' : 'bg-surface-muted text-text-subtle'}`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink leading-tight">{alert.keyword}</h3>
                    <p className="text-xs text-text-muted font-medium">
                      Dikirim {alert.frequency === 'daily' ? 'Setiap Hari' : 'Setiap Minggu'}
                    </p>
                  </div>
                </div>
                
                {/* Real app would use a client component with toggle/delete */}
                <button className="p-1.5 text-text-subtle hover:text-ink hover:bg-surface-muted rounded-md transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {alert.location && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-muted text-xs font-medium text-text-muted">
                    <MapPin className="w-3.5 h-3.5" /> {alert.location}
                  </span>
                )}
                {alert.job_type && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-muted text-xs font-medium text-text-muted capitalize">
                    {alert.job_type.replace('-', ' ')}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                <p className="text-xs text-text-subtle">
                  Dibuat {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true, locale: localeId })}
                </p>
                
                {/* Simple visual toggle (needs client interactivity) */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${alert.is_active ? 'text-primary' : 'text-text-muted'}`}>
                    {alert.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                  <div className={`w-10 h-5 rounded-full relative ${alert.is_active ? 'bg-primary' : 'bg-border'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${alert.is_active ? 'left-6' : 'left-1'}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
