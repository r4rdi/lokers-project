"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toggleJobFeatured } from "./actions";

interface ToggleFeaturedButtonProps {
  jobId: string;
  isFeatured?: boolean;
}

export default function ToggleFeaturedButton({ jobId, isFeatured = false }: ToggleFeaturedButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [optimisticState, setOptimisticState] = useState(isFeatured);

  const handleToggle = async () => {
    setIsPending(true);
    setOptimisticState(!optimisticState);
    
    const result = await toggleJobFeatured(jobId, isFeatured);
    
    if (!result.success) {
      // Revert on error
      setOptimisticState(isFeatured);
      alert("Gagal memperbarui status prioritas");
    }
    
    setIsPending(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={optimisticState ? "Hapus dari prioritas" : "Jadikan prioritas"}
      className={`p-1.5 rounded-md transition-colors ${
        optimisticState 
          ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10" 
          : "text-white/40 hover:text-white hover:bg-white/10"
      }`}
    >
      <Star className={`w-5 h-5 ${optimisticState ? "fill-current" : ""}`} />
    </button>
  );
}
