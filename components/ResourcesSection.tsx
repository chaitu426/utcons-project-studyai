"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/types";

interface ResourcesSectionProps {
  resources: Resource[];
}

export function ResourcesSection({ resources }: ResourcesSectionProps) {
  if (!resources || resources.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Learning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {resources.map((res, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium text-neutral-200 leading-tight">
                  {res.title}
                </h4>
                <Badge variant="muted" className="shrink-0">
                  {res.type}
                </Badge>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {res.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
