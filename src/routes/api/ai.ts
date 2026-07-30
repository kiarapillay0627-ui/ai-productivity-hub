import { createFileRoute } from "@tanstack/react-router";
import { streamText, type ModelMessage } from "ai";
import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";

const SYSTEM_PROMPTS = {
  email:
    "You are a professional workplace communication assistant. Generate clear, concise business emails with a subject, greeting, body and closing.",
  research:
    "Summarise the content, identify key insights and provide practical recommendations using professional business language.",
  chat: "You are an intelligent workplace productivity assistant providing professional, well-structured workplace responses.",
} as const;

type Feature = keyof typeof SYSTEM_PROMPTS;

type ChatMessage = { role: "user" | "assistant"; content: string };

type RequestBody = {
  feature?: Feature;
  prompt?: string;
  messages?: ChatMessage[];
  extraSystem?: string;
};

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: RequestBody;
        try {
          body = (await request.json()) as RequestBody;
        } catch {
          return new Response("Invalid JSON body", { status: 400 });
        }

        const feature = body.feature;
        if (!feature || !(feature in SYSTEM_PROMPTS)) {
          return new Response("Unknown feature", { status: 400 });
        }

        const history: ChatMessage[] = Array.isArray(body.messages)
          ? body.messages.filter(
              (m) =>
                m &&
                (m.role === "user" || m.role === "assistant") &&
                typeof m.content === "string" &&
                m.content.trim().length > 0,
            )
          : [];

        if (history.length === 0) {
          const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
          if (!prompt) return new Response("Prompt is required", { status: 400 });
          history.push({ role: "user", content: prompt });
        }

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response("AI is not configured for this app.", { status: 500 });
        }

        const system = [SYSTEM_PROMPTS[feature], body.extraSystem?.trim()]
          .filter(Boolean)
          .join("\n\n");

        const initialRunId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(apiKey, initialRunId);

        const messages: ModelMessage[] = [
          { role: "system", content: system },
          ...history.map((m) => ({ role: m.role, content: m.content }) as ModelMessage),
        ];

        try {
          const result = streamText({
            model: gateway("google/gemini-3.6-flash"),
            messages,
            onError: ({ error }) => console.error("AI stream error", error),
          });

          return result.toTextStreamResponse({
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "AI request failed";
          const status = /rate limit|429/i.test(message)
            ? 429
            : /credit|402|payment/i.test(message)
              ? 402
              : 500;
          return new Response(message, { status });
        }
      },
    },
  },
});