"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { Loader2, ZoomIn, ZoomOut, Download } from "lucide-react";
import type { CVData, WorkExperience, Education } from "@/types/index";

export default function CVPrintPage() {
  const params = useParams();
  const id = params.id as string;
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    async function fetchCV() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          // If no session (e.g. mock env), just show mock data
          setCvData({
            fullName: "John Doe",
            email: "john@example.com",
            phone: "+62 812 3456 7890",
            location: "Jakarta, Indonesia",
            linkedin: "linkedin.com/in/johndoe",
            summary: "Seorang profesional dengan pengalaman lebih dari 5 tahun di bidang pengembangan perangkat lunak.",
            experience: [
              {
                title: "Senior Frontend Engineer",
                company: "Tech Corp",
                startDate: "Jan 2020",
                endDate: "Saat ini",
                description: "Mengembangkan aplikasi web menggunakan React dan Next.js. Meningkatkan performa aplikasi sebesar 30%."
              }
            ],
            education: [
              {
                institution: "Universitas Indonesia",
                degree: "S1",
                field: "Ilmu Komputer",
                startDate: "2015",
                endDate: "2019"
              }
            ],
            skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"]
          });
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("cvs")
          .select("*")
          .eq("id", id)
          .eq("user_id", session.user.id)
          .single();

        if (error || !data) {
          throw new Error("CV tidak ditemukan");
        }

        setCvData(data.data); // data is the JSON column containing the parsed info
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchCV();
  }, [id]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="mt-4 text-text-muted">Menyiapkan dokumen PDF...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold text-error mb-2">Error</h1>
        <p className="text-text-muted">{error}</p>
      </div>
    );
  }

  if (!cvData) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] md:h-[calc(100vh-2rem)] overflow-hidden">
      
      {/* Toolbar / Control Panel (Hidden during print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4 p-4 bg-surface border border-border rounded-xl mb-6 shadow-sm z-10 shrink-0">
        <div>
          <h2 className="text-h3 text-ink">Pratinjau CV (Kertas A4)</h2>
          <p className="text-xs text-text-muted mt-1">Dokumen ini telah dioptimalkan untuk sistem ATS.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
          <div className="flex items-center bg-surface-muted rounded-md border border-border overflow-hidden">
            <button 
              onClick={handleZoomOut}
              className="p-2 text-text hover:text-primary hover:bg-border transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="px-3 text-sm font-semibold text-ink border-x border-border min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button 
              onClick={handleZoomIn}
              className="p-2 text-text hover:text-primary hover:bg-border transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
          
          {/* Action Buttons */}
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-md transition-colors shadow-subtle"
          >
            <Download className="w-4 h-4" />
            <span>Simpan sebagai PDF</span>
          </button>
        </div>
      </div>

      {/* Viewing Canvas */}
      <div className="flex-1 overflow-auto bg-surface-muted rounded-xl border border-border relative print:bg-transparent print:border-none print:overflow-visible print:rounded-none">
        
        {/* The Paper Container */}
        <div 
          className="flex justify-center p-8 print:p-0 min-h-full"
          style={{ transformOrigin: 'top center' }}
        >
          {/* The Paper itself (A4) */}
          <div 
            className="bg-white text-black shadow-card transition-transform duration-200 ease-out print:shadow-none print:w-auto print:max-w-none print:transform-none"
            style={{ 
              width: '21cm',
              minHeight: '29.7cm',
              padding: '1.5cm',
              transform: `scale(${zoomLevel})` 
            }}
          >
            <div className="font-sans leading-relaxed">
              {/* Header */}
              <header className="text-center border-b-2 border-gray-800 pb-6 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">{cvData.fullName || "NAMA KANDIDAT"}</h1>
                <div className="text-sm flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-700">
                  {cvData.email && <span>{cvData.email}</span>}
                  {cvData.phone && <span>• {cvData.phone}</span>}
                  {cvData.location && <span>• {cvData.location}</span>}
                  {cvData.linkedin && <span>• {cvData.linkedin}</span>}
                  {cvData.github && <span>• {cvData.github}</span>}
                </div>
              </header>

              {/* Summary */}
              {cvData.summary && (
                <section className="mb-6">
                  <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3 text-gray-800 tracking-wider">
                    Ringkasan Profesional
                  </h2>
                  <p className="text-sm text-gray-700 text-justify">
                    {cvData.summary}
                  </p>
                </section>
              )}

              {/* Experience */}
              {cvData.experience && cvData.experience.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-4 text-gray-800 tracking-wider">
                    Pengalaman Kerja
                  </h2>
                  <div className="space-y-5">
                    {cvData.experience.map((exp: WorkExperience, index: number) => (
                      <div key={index}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-base font-bold text-gray-900">{exp.title}</h3>
                          <span className="text-sm font-semibold text-gray-600 whitespace-nowrap ml-4">
                            {exp.startDate} – {exp.endDate || 'Saat ini'}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-700 mb-2">{exp.company}</div>
                        {exp.description && (
                          <div className="text-sm text-gray-700 whitespace-pre-wrap pl-4 border-l-2 border-gray-200">
                            {exp.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {cvData.education && cvData.education.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-4 text-gray-800 tracking-wider">
                    Pendidikan
                  </h2>
                  <div className="space-y-4">
                    {cvData.education.map((edu: Education, index: number) => (
                      <div key={index}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-base font-bold text-gray-900">{edu.institution}</h3>
                          <span className="text-sm font-semibold text-gray-600 whitespace-nowrap ml-4">
                            {edu.startDate} – {edu.endDate || 'Saat ini'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">
                          {edu.degree} - {edu.field}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {cvData.skills && cvData.skills.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3 text-gray-800 tracking-wider">
                    Keahlian
                  </h2>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {Array.isArray(cvData.skills) ? cvData.skills.join(" • ") : cvData.skills}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print-specific styles to hide sidebar and layout wrappers */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            margin: 0;
            size: A4 portrait;
          }
          body {
            background-color: white !important;
          }
          /* Hide sidebar from layout */
          aside, nav {
            display: none !important;
          }
          /* Reset all fixed positioning and flex constraints in print mode */
          body, html, main {
            display: block !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            position: static !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Target NextJS layout structure if any */
          #__next, .container-content {
            display: block !important;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}} />
    </div>
  );
}
