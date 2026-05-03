"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/types";

interface SummarySectionProps {
  summary: string;
  resources?: Resource[];
}

export function SummarySection({ summary, resources }: SummarySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [view, setView] = useState<"summary" | "resources">("summary");
  
  const paragraphs = summary.split("\n").filter((p) => p.trim().length > 0);
  const displayParagraphs = isExpanded ? paragraphs : [paragraphs[0]];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Overview</CardTitle>
        <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
          <button
            onClick={() => setView("summary")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              view === "summary"
                ? "bg-neutral-800 text-neutral-200 shadow-sm"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setView("resources")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              view === "resources"
                ? "bg-neutral-800 text-neutral-200 shadow-sm"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Resources
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {view === "summary" ? (
          <>
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
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
            {resources && resources.length > 0 ? (
              resources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700 transition-all flex flex-col gap-2 group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-neutral-200 leading-tight group-hover:text-blue-400 transition-colors">
                      {res.title}
                    </h4>
                    <Badge variant="muted" className="shrink-0 text-[10px] bg-neutral-900 border-neutral-700">
                      {res.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed group-hover:text-neutral-400 transition-colors">
                    {res.description}
                  </p>
                </a>
              ))
            ) : (
              <p className="text-sm text-neutral-500 col-span-full italic">No additional resources could be curated for this topic.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
