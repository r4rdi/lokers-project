"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Helper to generate page numbers with ellipsis
  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  if (totalPages <= 1) return null;

  const pages = getPages();

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link 
          href={createPageURL(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-colors font-medium mr-2"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-white/30 cursor-not-allowed font-medium mr-2">
          <ChevronLeft className="w-4 h-4" /> Previous
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="w-10 text-center text-white/50 font-bold tracking-widest">
              ...
            </span>
          );
        }

        const isActive = page === currentPage;
        
        return (
          <Link
            key={`page-${page}`}
            href={createPageURL(page)}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold transition-all duration-200",
              isActive 
                ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/30" 
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            {page}
          </Link>
        );
      })}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link 
          href={createPageURL(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-colors font-medium ml-2"
        >
          Next <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-white/30 cursor-not-allowed font-medium ml-2">
          Next <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </div>
  );
}
