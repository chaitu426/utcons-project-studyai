import { z } from "zod";
import type { LearningResponse, KeyPoint } from "@/types";

const QuizItemSchema = z.object({
  question: z.string().min(5),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  correctAnswer: z.string().min(1),
});

const KeyPointSchema = z.object({
  title: z.string().min(3),
  details: z.array(z.string().min(3)).min(1),
});

export const LearningResponseSchema = z.object({
  summary: z.string().min(10),
  keyPoints: z.array(KeyPointSchema).min(3).max(5),
  quiz: z.array(QuizItemSchema).length(5),
});

export function safeParseResponse(raw: string): LearningResponse {
  let cleaned = raw.trim();

  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI response is not valid JSON");
  }

  const result = LearningResponseSchema.safeParse(parsed);

  if (result.success) {
    return result.data;
  }

  const repaired = repairResponse(parsed as Record<string, unknown>);
  const retryResult = LearningResponseSchema.safeParse(repaired);

  if (retryResult.success) {
    return retryResult.data;
  }

  throw new Error(
    `Schema validation failed: ${result.error.issues.map((i) => i.message).join(", ")}`
  );
}

function repairResponse(data: Record<string, unknown>): Record<string, unknown> {
  const repaired = { ...data };

  if (!repaired.summary || typeof repaired.summary !== "string") {
    repaired.summary = "No summary available.";
  }

  if (!Array.isArray(repaired.keyPoints)) {
    repaired.keyPoints = [];
  }

  const kp = repaired.keyPoints as Record<string, unknown>[];
  const validKp = kp.filter(k => k && typeof k.title === 'string' && Array.isArray(k.details)).slice(0, 5);

  while (validKp.length < 3) {
    validKp.push({
      title: "Key point not provided.",
      details: ["No additional details available."],
    });
  }
  repaired.keyPoints = validKp;

  if (!Array.isArray(repaired.quiz)) {
    repaired.quiz = [];
  }

  const quiz = repaired.quiz as Record<string, unknown>[];
  const validQuiz = quiz
    .filter(
      (q) =>
        q.question &&
        Array.isArray(q.options) &&
        (q.options as string[]).length === 4 &&
        q.correctAnswer
    )
    .slice(0, 5);

  while (validQuiz.length < 5) {
    validQuiz.push({
      question: "Question not available.",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
    });
  }

  repaired.quiz = validQuiz;

  return repaired;
}
