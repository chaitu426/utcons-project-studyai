"use client";

export function ResultSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-3">
        <div className="h-3 w-16 rounded bg-neutral-800" />
        <div className="space-y-2">
          <div className="h-3 rounded bg-neutral-800/80 w-full" />
          <div className="h-3 rounded bg-neutral-800/80 w-5/6" />
          <div className="h-3 rounded bg-neutral-800/80 w-4/6" />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-3">
        <div className="h-3 w-20 rounded bg-neutral-800" />
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 shrink-0" />
              <div
                className="h-3 rounded bg-neutral-800/80"
                style={{ width: `${60 + i * 10}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4">
        <div className="h-3 w-10 rounded bg-neutral-800" />
        {[1, 2, 3].map((q) => (
          <div key={q} className="space-y-2">
            <div className="h-3 rounded bg-neutral-800/80 w-3/4" />
            <div className="space-y-1.5">
              {[1, 2, 3, 4].map((o) => (
                <div
                  key={o}
                  className="h-9 rounded-lg bg-neutral-800/40 border border-neutral-800"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
