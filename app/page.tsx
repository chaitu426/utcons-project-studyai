"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { InputForm } from "@/components/InputForm";
import { SearchSources } from "@/components/SearchSources";
import { SummarySection } from "@/components/SummarySection";
import { KeyPointsSection } from "@/components/KeyPointsSection";
import { QuizSection } from "@/components/QuizSection";
import { ResourcesSection } from "@/components/ResourcesSection";
import { RecentSearches } from "@/components/RecentSearches";
import { ResultSkeleton } from "@/components/ResultSkeleton";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import type { EnrichedResponse } from "@/types";

interface RecentSearch {
  topic: string;
  grade: number;
}

type AppState = "idle" | "loading" | "streaming" | "done" | "error";

const STORAGE_KEY = "ai_learn_recent";

function loadRecent(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecent(topic: string, grade: number) {
  const existing = loadRecent().filter((s) => s.topic !== topic);
  const updated = [{ topic, grade }, ...existing].slice(0, 3);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [result, setResult] = useState<EnrichedResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [streamText, setStreamText] = useState<string>("");
  const [searchContext, setSearchContext] = useState<string>("");
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [lastInput, setLastInput] = useState<{ topic: string; grade: number } | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  const generate = useCallback(async (topic: string, grade: number) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setAppState("loading");
    setResult(null);
    setError("");
    setStatus("Connecting...");
    setStreamText("");
    setSearchContext("");
    setLastInput({ topic, grade });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, grade }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Request failed");
      }

      setAppState("streaming");

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          let event: Record<string, unknown>;
          try {
            event = JSON.parse(jsonStr);
          } catch {
            continue;
          }

          if (event.type === "status") {
            setStatus(event.message as string);
          } else if (event.type === "search_context") {
            setSearchContext(event.context as string);
          } else if (event.type === "chunk") {
            setStreamText((prev) => prev + (event.text as string));
          } else if (event.type === "done") {
            const data = event.data as EnrichedResponse;
            setResult(data);
            setAppState("done");
            setRecent(saveRecent(topic, grade));
          } else if (event.type === "error") {
            throw new Error(event.message as string);
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setAppState("error");
    }
  }, []);

  function handleRegenerate() {
    if (lastInput) {
      generate(lastInput.topic, lastInput.grade);
    }
  }

  const isLoading = appState === "loading" || appState === "streaming";

  // Attempt to parse the partial summary for a clean typing effect
  let parsedSummary = "";
  const parsedKeyPoints: { title: string; details: string[] }[] = [];

  if (streamText) {
    const match = streamText.match(/"summary"\s*:\s*"([^]*)/);
    if (match) {
      let content = match[1];
      const endMatch = content.match(/([^\\])"\s*,/);
      if (endMatch) {
        content = content.substring(0, endMatch.index! + 1);
      }
      parsedSummary = content.replace(/\\n/g, "\n").replace(/\\"/g, '"');
    }

    const kpMatch = streamText.match(/"keyPoints"\s*:\s*\[([^]*)/);
    if (kpMatch) {
      const kpSection = kpMatch[1];
      const titleMatches = [...kpSection.matchAll(/"title"\s*:\s*"([^]*?)(?:(?<!\\)"\s*,|$)/g)];
      
      for (let i = 0; i < titleMatches.length; i++) {
        const title = titleMatches[i][1].replace(/\\n/g, "").replace(/\\"/g, '"');
        const nextTitleIndex = titleMatches[i+1] ? titleMatches[i+1].index : kpSection.length;
        const chunk = kpSection.substring(titleMatches[i].index, nextTitleIndex);
        
        const detailsMatch = chunk.match(/"details"\s*:\s*\[([^]*?)(?:\]|$)/);
        const details: string[] = [];
        
        if (detailsMatch) {
          const dString = detailsMatch[1];
          const dMatches = [...dString.matchAll(/"([^]*?)(?:(?<!\\)"|$)/g)];
          for (const d of dMatches) {
            if (d[1].trim()) {
              details.push(d[1].replace(/\\n/g, "").replace(/\\"/g, '"'));
            }
          }
        }
        
        parsedKeyPoints.push({ title, details });
      }
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <header className="mb-10 space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-100">
            Learn anything
          </h1>
          <p className="text-sm text-neutral-500">
            Enter a topic and grade level to get a structured explanation, key points, and an interactive quiz.
          </p>
        </header>

        <div className="space-y-3 mb-8">
          <InputForm onSubmit={generate} loading={isLoading} />
          <RecentSearches searches={recent} onSelect={generate} />
        </div>

        {isLoading && (
          <div className="space-y-4">
            {status && (
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-pulse" />
                {status}
              </div>
            )}
            {searchContext && <SearchSources context={searchContext} />}
            {parsedSummary && (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
                <p className="text-xs text-neutral-600 mb-3 uppercase tracking-wide">Writing Overview</p>
                <div className="space-y-3">
                  {parsedSummary.split("\n").map((p, i) => (
                    <p key={i} className="text-sm text-neutral-300 leading-relaxed animate-fade-in">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {parsedKeyPoints.length > 0 && (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
                <p className="text-xs text-neutral-600 mb-4 uppercase tracking-wide">Extracting Key Concepts</p>
                <div className="space-y-5">
                  {parsedKeyPoints.map((kp, i) => (
                    <div key={i} className="space-y-1.5 animate-fade-in">
                      <h4 className="text-sm font-medium text-neutral-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 shrink-0" />
                        {kp.title}
                      </h4>
                      {kp.details.length > 0 && (
                        <ul className="pl-5 space-y-1">
                          {kp.details.map((d, j) => (
                            <li key={j} className="text-sm text-neutral-400 relative before:content-[''] before:absolute before:-left-3.5 before:top-2 before:w-1 before:h-px before:bg-neutral-600">
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <ResultSkeleton />
          </div>
        )}

        {appState === "error" && (
          <ErrorState
            message={error}
            onRetry={() => lastInput && generate(lastInput.topic, lastInput.grade)}
          />
        )}

        {appState === "done" && result && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span className="text-xs text-neutral-600 uppercase tracking-wide">Results for</span>
                <span className="text-xs text-neutral-400 font-medium break-all">{lastInput?.topic}</span>
                <span className="text-xs text-neutral-600">· Grade {lastInput?.grade}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                className="gap-1.5 w-full sm:w-auto shrink-0"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Regenerate
              </Button>
            </div>


            <SummarySection summary={result.summary} />
            <KeyPointsSection keyPoints={result.keyPoints} />
            <ResourcesSection resources={result.resources} />
            <QuizSection quiz={result.quiz} />
          </div>
        )}
      </div>
    </div>
  );
}
