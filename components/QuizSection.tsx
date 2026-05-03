"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QuizItem } from "@/types";

interface QuizSectionProps {
  quiz: QuizItem[];
}

interface QuizState {
  selected: string | null;
  revealed: boolean;
}

export function QuizSection({ quiz }: QuizSectionProps) {
  const [states, setStates] = useState<QuizState[]>(
    quiz.map(() => ({ selected: null, revealed: false }))
  );

  function handleSelect(qIndex: number, option: string) {
    if (states[qIndex].revealed) return;
    setStates((prev) =>
      prev.map((s, i) =>
        i === qIndex ? { selected: option, revealed: true } : s
      )
    );
  }

  function resetQuiz() {
    setStates(quiz.map(() => ({ selected: null, revealed: false })));
  }

  const score = states.filter(
    (s, i) => s.revealed && s.selected === quiz[i].correctAnswer
  ).length;

  const allAnswered = states.every((s) => s.revealed);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quiz</CardTitle>
          {allAnswered && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">
                {score}/{quiz.length} correct
              </span>
              <button
                onClick={resetQuiz}
                className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {quiz.map((item, qIndex) => {
            const state = states[qIndex];
            return (
              <div key={qIndex} className="space-y-2.5">
                <p className="text-sm font-medium text-neutral-200">
                  <span className="text-neutral-600 mr-2">{qIndex + 1}.</span>
                  {item.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.options.map((option, oIndex) => {
                    const isSelected = state.selected === option;
                    const isCorrect = option === item.correctAnswer;
                    const isRevealed = state.revealed;

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleSelect(qIndex, option)}
                        disabled={isRevealed}
                        className={cn(
                          "w-full text-left px-3.5 py-2.5 rounded-lg text-sm border transition-all duration-150",
                          !isRevealed &&
                            "border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200 hover:bg-neutral-800/50 cursor-pointer",
                          isRevealed && isCorrect &&
                            "border-emerald-800 bg-emerald-950/50 text-emerald-300",
                          isRevealed && isSelected && !isCorrect &&
                            "border-red-800 bg-red-950/50 text-red-400",
                          isRevealed && !isSelected && !isCorrect &&
                            "border-neutral-800 text-neutral-600",
                          "disabled:cursor-default"
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "w-5 h-5 rounded-full border text-[10px] flex items-center justify-center shrink-0 font-medium",
                              !isRevealed && "border-neutral-700 text-neutral-600",
                              isRevealed && isCorrect && "border-emerald-600 text-emerald-400",
                              isRevealed && isSelected && !isCorrect && "border-red-700 text-red-500",
                              isRevealed && !isSelected && !isCorrect && "border-neutral-800 text-neutral-700"
                            )}
                          >
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          {option}
                          {isRevealed && isCorrect && (
                            <svg className="w-3.5 h-3.5 ml-auto text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {isRevealed && isSelected && !isCorrect && (
                            <svg className="w-3.5 h-3.5 ml-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
