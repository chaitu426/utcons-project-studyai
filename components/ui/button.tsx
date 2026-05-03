"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-lg cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none",
          {
            default:
              "bg-white text-neutral-950 hover:bg-neutral-100 active:scale-[0.98]",
            ghost:
              "bg-transparent text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800",
            outline:
              "border border-neutral-700 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:border-neutral-600",
            secondary:
              "bg-neutral-800 text-neutral-200 hover:bg-neutral-700 active:scale-[0.98]",
          }[variant],
          {
            sm: "text-xs px-3 py-1.5",
            md: "text-sm px-4 py-2",
            lg: "text-sm px-5 py-2.5",
          }[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
