"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SummarySectionProps {
  summary: string;
}

export function SummarySection({ summary }: SummarySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const paragraphs = summary.split("\n").filter((p) => p.trim().length > 0);
  
  const displayParagraphs = isExpanded ? paragraphs : [paragraphs[0]];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 animate-fade-in">
          {displayParagraphs.map((p, i) => (
            <p key={i} className="text-sm text-neutral-300 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
        
        {paragraphs.length > 1 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-1.5 pt-1"
          >
            {isExpanded ? "Show less" : "Read more"}
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </CardContent>
    </Card>
  );
}
