import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Resource } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateResources(
  topic: string,
  grade: number
): Promise<Resource[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Recommend 3 to 4 high-quality learning resources to help a grade ${grade} student learn more deeply about "${topic}".
Include a mix of types if possible (e.g., Video, Article, Book, Course).

Return ONLY valid JSON in this exact format:
[
  {
    "title": "Resource Name",
    "description": "Why this resource is helpful and what it covers.",
    "type": "Video"
  }
]

No markdown, no explanation outside the JSON.`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      text = fenceMatch[1].trim();
    }
    
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 4);
    }
    return [];
  } catch {
    return [];
  }
}
