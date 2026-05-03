"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { KeyPoint } from "@/types";

interface KeyPointsSectionProps {
  keyPoints: KeyPoint[];
}

export function KeyPointsSection({ keyPoints }: KeyPointsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Concepts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {keyPoints.map((point, i) => (
            <div key={i} className="space-y-2" style={{ animationDelay: `${i * 60}ms` }}>
              <h4 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
                {point.title}
              </h4>
              <ul className="pl-5 space-y-1.5">
                {point.details.map((detail, j) => (
                  <li key={j} className="text-sm text-neutral-400 relative before:content-[''] before:absolute before:-left-3.5 before:top-2 before:w-1 before:h-px before:bg-neutral-600">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
