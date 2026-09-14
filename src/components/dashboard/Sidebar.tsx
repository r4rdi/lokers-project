"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Bookmark,
  Bell,
  Settings,
  LogOut,
  Briefcase
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Kelola CV", href: "/dashboard/cv", icon: FileText },
  { name: "Cover Letters", href: "/dashboard/cover-letters", icon: Sparkles },
  { name: "Lowongan Tersimpan", href: "/dashboard/bookmarks", icon: Bookmark },
  { name: "Job Alerts", href: "/dashboard/alerts", icon: Bell },
  { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
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
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-ink">
            Lokers<span className="text-primary">!</span>
          </span>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-on-primary shadow-subtle" 
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
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            U
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-ink truncate">User Profile</p>
            <p className="text-xs text-text-subtle truncate">Free Plan</p>
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
