import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Resource } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateResources(
  topic: string,
  grade: number
): Promise<Resource[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Recommend 3 to 4 real, high-quality learning resources (with actual working URLs) to help a grade ${grade} student learn more deeply about "${topic}".
Include a mix of types if possible (e.g., Video, Article, Book, Course).

Return ONLY valid JSON in this exact format:
[
  {
    "title": "Resource Name",
    "description": "Why this resource is helpful and what it covers.",
    "url": "https://actual-working-url.com",
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
    
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      const resources: Resource[] = [];
      const titleMatches = [...text.matchAll(/"title"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g)];
      const descMatches = [...text.matchAll(/"description"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g)];
      const urlMatches = [...text.matchAll(/"url"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g)];
      const typeMatches = [...text.matchAll(/"type"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g)];
      
      const len = Math.min(titleMatches.length, descMatches.length, urlMatches.length, typeMatches.length);
      for(let i=0; i<len; i++) {
        resources.push({
          title: titleMatches[i][1],
          description: descMatches[i][1],
          url: urlMatches[i][1],
          type: typeMatches[i][1]
        });
      }
      if (resources.length > 0) return resources.slice(0, 4);
    }
    
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const values = Object.values(parsed);
      for (const val of values) {
        if (Array.isArray(val)) {
          parsed = val;
          break;
        }
      }
    }
    
    if (Array.isArray(parsed) && parsed.length > 0) {
      const valid = parsed.filter(p => p.title && p.description && p.url && p.type);
      if (valid.length > 0) return valid.slice(0, 4);
    }

    return [{
       title: `YouTube: ${topic}`,
       description: `Search YouTube for high-quality educational videos and visual explanations of ${topic}.`,
       url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`,
       type: "Video"
    }, {
       title: `Wikipedia Deep Dive`,
       description: `Read the full Wikipedia article on ${topic} to explore its history and advanced concepts.`,
       url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(topic)}`,
       type: "Article"
    }];
  } catch {
    return [{
       title: `YouTube Search: ${topic}`,
       description: `Search YouTube for high-quality educational videos on ${topic}.`,
       url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`,
       type: "Video"
    }];
  }
}
