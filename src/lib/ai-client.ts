export type ChatMessage = { role: "user" | "assistant"; content: string };

export type StreamAiOptions = {
  feature: "email" | "research" | "chat";
  prompt?: string;
  messages?: ChatMessage[];
  extraSystem?: string;
  onDelta: (fullText: string) => void;
  signal?: AbortSignal;
};

export async function streamAi({
  feature,
  prompt,
  messages,
  extraSystem,
  onDelta,
  signal,
}: StreamAiOptions): Promise<string> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feature, prompt, messages, extraSystem }),
    signal,
  });

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => "");
    if (response.status === 429) {
      throw new Error("Too many requests right now. Please wait a moment and try again.");
    }
    if (response.status === 402) {
      throw new Error(
        "AI credits have run out for this workspace. Please add credits to continue.",
      );
    }
    throw new Error(detail || "The AI request failed. Please try again.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    onDelta(text);
  }

  text += decoder.decode();
  onDelta(text);
  return text;
}
