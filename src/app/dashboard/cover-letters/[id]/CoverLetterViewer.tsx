"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut, Download } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";

interface CoverLetterViewerProps {
  content: string;
}

export default function CoverLetterViewer({ content }: CoverLetterViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-border bg-surface-muted flex flex-wrap justify-between items-center gap-4 shrink-0 print:hidden">
        <h3 className="text-sm font-semibold text-ink">Isi Surat Lamaran</h3>
        
        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
          <div className="flex items-center bg-surface rounded-md border border-border overflow-hidden">
            <button 
              onClick={handleZoomOut}
              className="p-1.5 text-text hover:text-primary hover:bg-border transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-semibold text-ink border-x border-border min-w-[2.5rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button 
              onClick={handleZoomIn}
              className="p-1.5 text-text hover:text-primary hover:bg-border transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          
          <CopyButton textToCopy={content} />
          
          {/* Print Button */}
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary-hover text-on-primary text-sm font-bold rounded-md transition-colors shadow-subtle"
          >
            <Download className="w-4 h-4" />
            <span>Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Viewing Canvas */}
      <div className="relative overflow-auto bg-gray-200/50 print:bg-transparent print:overflow-visible min-h-[500px]">
        {/* The Paper Container */}
        <div 
          className="flex justify-center p-6 md:p-8 print:p-0 min-w-max min-h-full"
          style={{ transformOrigin: 'top center' }}
        >
          {/* The Paper itself (A4) */}
          <div 
            className="bg-white text-black shadow-card transition-transform duration-200 ease-out print:shadow-none print:w-auto print:max-w-none print:transform-none"
            style={{ 
              width: '21cm',
              minHeight: '29.7cm',
              padding: '2cm',
              transform: `scale(${zoomLevel})` 
            }}
          >
            <div className="font-sans text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          </div>
        </div>
      </div>

      {/* Print-specific styles to hide sidebar and layout wrappers */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            margin: 1.5cm;
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
