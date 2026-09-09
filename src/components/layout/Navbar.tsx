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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass py-3 shadow-subtle"
          : "bg-transparent py-5"
      )}
    >
      <nav className="container-max flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          id="nav-logo"
        >
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-on-primary" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-ink">
            Lokers<span className="text-primary">!</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200",
                pathname === link.href
                  ? "text-primary bg-primary-soft"
                  : "text-text-muted hover:text-text hover:bg-surface-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            /* Logged in state */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-muted transition-colors"
                id="nav-user-menu"
              >
                <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <ChevronDown className="w-4 h-4 text-text-muted" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-lg shadow-floating py-2"
                  >
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-muted transition-colors"
                    >
                      <Briefcase className="w-4 h-4 text-text-muted" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/cvs"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-muted transition-colors"
                    >
                      <FileText className="w-4 h-4 text-text-muted" />
                      CV Saya
                    </Link>
                    <Link
                      href="/dashboard/bookmarks"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-muted transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-text-muted" />
                      Tersimpan
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-muted transition-colors"
                    >
                      <Settings className="w-4 h-4 text-text-muted" />
                      Pengaturan
                    </Link>
                    <hr className="my-2 border-border" />
                    <button
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-muted transition-colors w-full text-left text-error"
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
                  className="flex items-center gap-1.5 px-2 py-2 rounded hover:bg-surface-muted transition-colors text-text-muted hover:text-text font-semibold text-sm"
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
                      className="absolute right-0 top-full mt-2 w-32 bg-[#111] border border-border rounded-md shadow-floating py-2 z-50"
                    >
                      <button
                        onClick={() => { setLanguage("IDN"); setLangMenuOpen(false); }}
                        className={cn(
                          "flex items-center w-full px-4 py-2 text-sm transition-colors",
                          language === "IDN" ? "text-primary font-bold bg-white/5" : "text-white/70 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        IDN - Indonesia
                      </button>
                      <button
                        onClick={() => { setLanguage("EN"); setLangMenuOpen(false); }}
                        className={cn(
                          "flex items-center w-full px-4 py-2 text-sm transition-colors",
                          language === "EN" ? "text-primary font-bold bg-white/5" : "text-white/70 hover:bg-white/5 hover:text-white"
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
                className="px-4 py-2.5 text-sm font-semibold text-text hover:text-white border border-white/10 hover:border-white/50 hover:bg-white/3 rounded transition-colors"
                id="nav-login"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-bold bg-primary text-on-primary rounded hover:bg-primary-hover transition-colors shadow-subtle flex items-center gap-2"
                id="nav-register"
              >
                <Sparkles className="w-4 h-4" />
                Mulai Gratis
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-surface-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          id="nav-mobile-toggle"
        >
          {mobileOpen ? (
            <X className="w-6 h-6 text-text" />
          ) : (
            <Menu className="w-6 h-6 text-text" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24 }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <div className="glass px-5 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-md text-sm font-semibold transition-colors",
                    pathname === link.href
                      ? "text-primary bg-primary-soft"
                      : "text-text-muted hover:text-text hover:bg-surface-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <hr className="my-3 border-border" />

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 rounded-md text-sm font-semibold text-text-muted hover:text-text hover:bg-surface-muted"
                  >
                    Dashboard
                  </Link>
                  <button className="block w-full text-left px-4 py-3 rounded-md text-sm font-semibold text-error hover:bg-surface-muted">
                    Keluar
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/login"
                    className="block text-center px-4 py-3 rounded-md text-sm font-semibold border border-border text-text hover:bg-surface-muted transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="block text-center px-4 py-3 rounded-md text-sm font-bold bg-primary text-on-primary hover:bg-primary-hover transition-colors"
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
