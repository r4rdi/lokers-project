import Link from "next/link";
import { Briefcase, ExternalLink, Globe, Mail } from "lucide-react";

const FOOTER_LINKS = {
  Produk: [
    { label: "Cari Lowongan", href: "/jobs" },
    { label: "AI Cover Letter", href: "/pricing" },
    { label: "Harga", href: "/pricing" },
  ],
  Perusahaan: [
    { label: "Pasang Lowongan", href: "/employer" },
    { label: "Tentang Kami", href: "/about" },
    { label: "Kontak", href: "/contact" },
  ],
  Legal: [
    { label: "Kebijakan Privasi", href: "/privacy" },
    { label: "Syarat & Ketentuan", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-border/40 text-white/80 mt-auto">
      <div className="container-content py-12 md:py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Lokers<span className="text-primary">!</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              AI Job Portal &quot;Anti Ribet&quot;. Temukan lowongan dan buat
              surat lamaran profesional dalam hitungan detik.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="mailto:hello@lokers.biz.id"
                className="w-9 h-9 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-label text-white/40 uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Lokers.biz.id. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
