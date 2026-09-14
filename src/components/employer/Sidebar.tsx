"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Settings,
  LogOut,
  BarChart
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", href: "/employer", icon: LayoutDashboard },
  { name: "Kelola Lowongan", href: "/employer/jobs", icon: Briefcase },
  { name: "Pasang Lowongan", href: "/employer/jobs/new", icon: PlusCircle },
  { name: "Statistik", href: "/employer/analytics", icon: BarChart },
  { name: "Pengaturan", href: "/employer/settings", icon: Settings },
];

export default function EmployerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="w-64 bg-surface border-r border-border h-[calc(100vh-4rem)] lg:h-screen flex flex-col sticky top-0 lg:top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-md bg-warning flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-ink">
            Lokers<span className="text-warning">!</span> Employer
          </span>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-warning text-black shadow-subtle" 
                    : "text-text-muted hover:bg-surface-muted hover:text-ink"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border">
        <div className="mb-4 px-3 py-3 bg-surface-muted rounded-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center text-warning font-bold">
            E
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-ink truncate">Employer Profile</p>
            <p className="text-xs text-text-subtle truncate">Basic Plan</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-error hover:bg-error/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
