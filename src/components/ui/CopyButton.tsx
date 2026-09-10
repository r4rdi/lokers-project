"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
}

export default function CopyButton({ textToCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium text-text-muted hover:text-primary hover:border-primary/50 transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          Tersalin!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Salin Teks
        </>
      )}
    </button>
  );
}
