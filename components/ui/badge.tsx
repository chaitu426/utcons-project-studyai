"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "muted";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          default: "bg-neutral-800 text-neutral-300 border border-neutral-700",
          muted: "bg-neutral-900 text-neutral-500 border border-neutral-800",
        }[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
