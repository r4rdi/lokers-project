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

  // In Mock env, allow it. In real env, check role.
  const isMockEnv = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");
  if (!isMockEnv && profile?.role !== "admin") {
    redirect("/dashboard"); // Non-admin users go to normal dashboard
  }

  return (
    <div className="flex min-h-screen bg-ink text-white">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-ink-soft border-r border-white/10 h-screen flex flex-col sticky top-0">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-md bg-error flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Lokers<span className="text-error">! Admin</span>
            </span>
          </Link>

          <nav className="space-y-1">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Overview
            </Link>
            <Link href="/admin/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors">
              <Database className="w-4 h-4" /> Manajemen Data Lowongan
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors text-text-subtle">
              <LogOut className="w-4 h-4" /> Keluar ke Dashboard
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
