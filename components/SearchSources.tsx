"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SearchSourcesProps {
  context: string;
}

export function SearchSources({ context }: SearchSourcesProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!context) return null;

  return (
    <div className="mb-6 rounded-xl border border-neutral-800 bg-neutral-900/30 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Searched Wikipedia
        </div>
        <svg
          className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 pt-1 text-sm text-neutral-500 leading-relaxed border-t border-neutral-800/50 bg-neutral-900/10">
          {context}
        </div>
      )}
    </div>
  );
}
