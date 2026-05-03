import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function buildPrompt(topic: string, grade: number, context: string): string {
  const contextBlock = context
    ? `Use this factual context about the topic:\n"${context}"\n\n`
    : "";

  return `${contextBlock}You are an educational content generator. Generate a highly detailed, comprehensive learning package for a grade ${grade} student about: "${topic}".

Return ONLY valid JSON. No markdown. No explanation. No text outside the JSON object.

The JSON must follow this exact structure:
{
  "summary": "A deep, comprehensive, multi-paragraph explanation of ${topic} appropriate for grade ${grade}. This should cover the 'what', 'why', and 'how' in detail, providing a strong foundational understanding.",
  "keyPoints": [
    {
      "title": "First major concept or theme",
      "details": [
        "In-depth detail 1",
        "In-depth detail 2"
      ]
    },
    {
      "title": "Second major concept or theme",
      "details": [
        "In-depth detail 1",
        "In-depth detail 2",
        "In-depth detail 3"
      ]
    },
    {
      "title": "Third major concept or theme",
      "details": [
        "In-depth detail 1"
      ]
    }
  ],
  "quiz": [
    {
      "question": "Deep understanding question about ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    },
    {
      "question": "Second question about ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B"
    },
    {
      "question": "Third question about ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option C"
    },
    {
      "question": "Fourth question about ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option D"
    },
    {
      "question": "Fifth question about ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    }
  ]
}

Rules:
- summary must be long and detailed (3-5 paragraphs)
- keyPoints must have exactly 3 to 5 objects, each with a title and an array of 1-3 details
- quiz must have exactly 5 questions
- each question must have exactly 4 options
- correctAnswer must exactly match one of the options
- grade ${grade} appropriate language
- no markdown, no extra text, return raw JSON only`;
}

export async function streamLearningContent(
  topic: string,
  grade: number,
  context: string
): Promise<ReadableStream<Uint8Array>> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = buildPrompt(topic, grade, context);

  const result = await model.generateContentStream(prompt);

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let accumulated = "";

      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          accumulated += text;

          const event = JSON.stringify({ type: "chunk", text });
          controller.enqueue(encoder.encode(`data: ${event}\n\n`));
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "raw", text: accumulated })}\n\n`
          )
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Stream error";
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", message })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });
}

export async function generateLearningContent(
  topic: string,
  grade: number,
  context: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = buildPrompt(topic, grade, context);

  const result = await model.generateContent(prompt);
  return result.response.text();
}
