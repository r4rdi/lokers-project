import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lokers! - AI Job Portal Anti Ribet",
    template: "%s | Lokers!",
  },
  description:
    "Temukan lowongan kerja dan buat surat lamaran profesional dalam hitungan detik dengan AI.",
  keywords: [
    "lamaran kerja",
    "cover letter",
    "AI",
    "job portal",
    "cari kerja",
    "surat lamaran",
  ],
  authors: [{ name: "Lokers" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://lokers.biz.id",
    siteName: "Lokers!",
    title: "Lokers! — AI Job Portal Anti Ribet",
    description:
      "Temukan lowongan kerja dan buat surat lamaran profesional dalam hitungan detik dengan AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lokers! — AI Job Portal Anti Ribet",
    description:
      "Temukan lowongan kerja dan buat surat lamaran profesional dalam hitungan detik dengan AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
