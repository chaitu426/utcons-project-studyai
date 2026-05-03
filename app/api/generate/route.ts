import { NextRequest } from "next/server";
import { z } from "zod";
import { fetchWikipediaContext } from "@/lib/search/wikipedia";
import { streamLearningContent } from "@/lib/ai/gemini";
import { generateResources } from "@/lib/ai/resources";
import { safeParseResponse } from "@/lib/validation/schema";

const RequestSchema = z.object({
  topic: z.string().min(1).max(200).trim(),
  grade: z.number().int().min(1).max(12),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON in request body", 400);
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      parsed.error.issues.map((i) => i.message).join(", "),
      400
    );
  }

  const { topic, grade } = parsed.data;

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: object) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(obj)}\n\n`)
        );
      };

      try {
        send({ type: "status", message: "Searching for context..." });

        const context = await fetchWikipediaContext(topic);

        send({ 
          type: "search_context", 
          context: context || `No exact Wikipedia match found for "${topic}". Using internal knowledge base.` 
        });

        if (context) {
          send({ type: "status", message: "Context found. Generating deep content..." });
        } else {
          send({ type: "status", message: "Generating deep content..." });
        }

        const aiStream = await streamLearningContent(topic, grade, context);
        const reader = aiStream.getReader();

        let rawAccumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = new TextDecoder().decode(value);
          const lines = text.split("\n\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const jsonStr = line.slice(6);
            try {
              const event = JSON.parse(jsonStr);
              if (event.type === "chunk") {
                send({ type: "chunk", text: event.text });
                rawAccumulated += event.text;
              } else if (event.type === "raw") {
                rawAccumulated = event.text;
              } else if (event.type === "error") {
                throw new Error(event.message);
              }
            } catch {
            }
          }
        }

        send({ type: "status", message: "Validating content..." });

        let learningData;
        try {
          learningData = safeParseResponse(rawAccumulated);
        } catch {
          send({
            type: "error",
            message:
              "The AI response could not be validated. Please try again.",
          });
          controller.close();
          return;
        }

        send({ type: "status", message: "Curating learning resources..." });

        const resources = await generateResources(topic, grade);

        const enriched = {
          ...learningData,
          searchContext: context,
          resources,
        };

        send({ type: "done", data: enriched });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
