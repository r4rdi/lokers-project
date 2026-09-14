import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Briefcase, LayoutDashboard, Database, LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Hardcode admin access for specific email
  if (user.email !== "rardiansyah3421@gmail.com") {
    redirect("/dashboard"); 
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans relative overflow-hidden">
      {/* Decorative Gradients (Orange & Blue) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Admin Sidebar */}
      <aside className="w-64 bg-white/[0.02] backdrop-blur-xl border-r border-white/10 h-screen flex flex-col sticky top-0 z-10">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8 px-2">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white drop-shadow-md">
              Lokers<span className="text-blue-500">!</span>
            </span>
          </Link>

          {/* User Profile Snippet */}
          <div className="mb-8 px-2 flex flex-col items-center border-b border-white/10 pb-6">
            <div className="w-16 h-16 rounded-full bg-white/10 mb-3 overflow-hidden border-2 border-white/20 shadow-sm flex items-center justify-center backdrop-blur-md">
              <span className="text-xl font-bold text-white/50">
                {user.email?.[0].toUpperCase() || "A"}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white line-clamp-1">{user.email}</h3>
            <p className="text-xs text-white/40 mt-1">Super Administrator</p>
          </div>

          <nav className="space-y-1">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link href="/admin/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium bg-blue-500/10 text-blue-400 transition-colors relative border border-blue-500/20">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <Database className="w-4 h-4" /> Manajemen Lowongan
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" /> Exit to App
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden z-10">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
