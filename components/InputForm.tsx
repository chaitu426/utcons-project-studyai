"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InputFormProps {
  onSubmit: (topic: string, grade: number) => void;
  loading: boolean;
}

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

export function InputForm({ onSubmit, loading }: InputFormProps) {
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState(6);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const trimmed = topic.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed, grade);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        <div
          className={cn(
            "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 rounded-xl border bg-neutral-900 p-3 sm:px-4 sm:py-3 transition-all duration-200",
            "border-neutral-700 focus-within:border-neutral-500 focus-within:ring-1 focus-within:ring-neutral-600"
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0 px-1 sm:px-0">
            <svg
              className="w-4 h-4 text-neutral-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a topic to learn about..."
              className="flex-1 bg-transparent text-neutral-100 placeholder:text-neutral-600 text-sm outline-none min-w-0"
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              disabled={loading}
              className="flex-1 sm:flex-none bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs rounded-md px-2 py-1.5 outline-none cursor-pointer hover:border-neutral-600 transition-colors"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>

            <Button
              onClick={handleSubmit}
              disabled={!topic.trim() || loading}
              size="sm"
              className="flex-1 sm:flex-none shrink-0"
            >
              {loading ? (
                <svg
                  className="w-3.5 h-3.5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              )}
              {loading ? "Generating" : "Generate"}
            </Button>
          </div>
        </div>

        <p className="text-xs text-neutral-600 text-center">
          Press{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono text-[10px]">
            Ctrl
          </kbd>{" "}
          +{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono text-[10px]">
            Enter
          </kbd>{" "}
          to submit
        </p>
      </div>
    </div>
  );
}
