"use client";

interface RecentSearch {
  topic: string;
  grade: number;
}

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSelect: (topic: string, grade: number) => void;
}

export function RecentSearches({ searches, onSelect }: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-neutral-600 shrink-0">Recent:</span>
      {searches.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s.topic, s.grade)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300 transition-all duration-150 bg-neutral-900/50"
        >
          {s.topic}
          <span className="text-neutral-700">G{s.grade}</span>
        </button>
      ))}
    </div>
  );
}
