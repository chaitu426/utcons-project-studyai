"use client";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 flex flex-col items-center gap-4 text-center">
      <div className="w-9 h-9 rounded-full border border-neutral-700 bg-neutral-800 flex items-center justify-center">
        <svg
          className="w-4 h-4 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-neutral-300">
          Failed to generate content
        </p>
        <p className="text-xs text-neutral-600 max-w-xs">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
