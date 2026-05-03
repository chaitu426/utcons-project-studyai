export interface QuizItem {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface KeyPoint {
  title: string;
  details: string[];
}

export interface Resource {
  title: string;
  description: string;
  url: string;
  type: "Article" | "Video" | "Book" | "Course" | string;
}

export interface LearningResponse {
  summary: string;
  keyPoints: KeyPoint[];
  quiz: QuizItem[];
}

export interface EnrichedResponse extends LearningResponse {
  searchContext: string;
  resources: Resource[];
}

export interface GenerateRequest {
  topic: string;
  grade: number;
}

export type StreamEvent =
  | { type: "chunk"; text: string }
  | { type: "search_context"; context: string }
  | { type: "done"; data: EnrichedResponse }
  | { type: "error"; message: string };
