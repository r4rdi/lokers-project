"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Briefcase,
  FileText,
  Bookmark,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/jobs", label: "Lowongan" },
  { href: "/pricing", label: "Harga" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [language, setLanguage] = useState("IDN");

  // TODO: Replace with real auth state
  const user = null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setLangMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-4">
      <nav 
        className={cn(
          "mx-auto flex items-center justify-between gap-4 transition-all duration-300 relative",
          scrolled
            ? "w-[95%] max-w-6xl bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-full py-2.5 px-6 shadow-2xl"
            : "container-max bg-transparent py-2 px-6"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          id="nav-logo"
        >
          <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Lokers<span className="text-blue-500">!</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                pathname === link.href
                  ? "text-white bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            /* Logged in state */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                id="nav-user-menu"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <ChevronDown className="w-4 h-4 text-white/60" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-[#141416]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2"
                  >
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Briefcase className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/cvs"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      CV Saya
                    </Link>
                    <Link
                      href="/dashboard/bookmarks"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Bookmark className="w-4 h-4" />
                      Tersimpan
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Pengaturan
                    </Link>
                    <div className="my-2 h-px bg-white/10" />
                    <button
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors w-full text-left"
                      id="nav-logout"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Logged out state */
            <>
              {/* Language Switcher */}
              <div className="relative mr-2">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 px-2 py-2 rounded-full hover:bg-white/5 transition-colors text-white/60 hover:text-white font-medium text-sm"
                >
                  <Globe className="w-4 h-4" />
                  {language}
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                <AnimatePresence>
                  {langMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-2 w-32 bg-[#141416]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 z-50"
                    >
                      <button
                        onClick={() => { setLanguage("IDN"); setLangMenuOpen(false); }}
                        className={cn(
                          "flex items-center w-full px-4 py-2 text-sm transition-colors",
                          language === "IDN" ? "text-blue-400 font-bold bg-white/5" : "text-white/70 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        IDN - Indonesia
                      </button>
                      <button
                        onClick={() => { setLanguage("EN"); setLangMenuOpen(false); }}
                        className={cn(
                          "flex items-center w-full px-4 py-2 text-sm transition-colors",
                          language === "EN" ? "text-blue-400 font-bold bg-white/5" : "text-white/70 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        EN - English
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/login"
                className="px-5 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                id="nav-login"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors shadow-lg shadow-blue-500/20 border border-blue-500/50"
                id="nav-register"
              >
                Mulai Gratis
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          id="nav-mobile-toggle"
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl md:hidden overflow-hidden rounded-2xl bg-[#111]/90 backdrop-blur-xl border border-white/10 shadow-2xl z-40"
          >
            <div className="px-5 py-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-3 h-px bg-white/10" />

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors">
                    Keluar
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/login"
                    className="block text-center px-4 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="block text-center px-4 py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors border border-blue-500/50"
                  >
                    Mulai Gratis
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
