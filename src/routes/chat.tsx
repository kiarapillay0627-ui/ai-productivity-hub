import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, MessagesSquare, Pencil, RefreshCw, SendHorizontal, Sparkle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { MarkdownBody } from "@/components/ai-output-panel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { streamAi, type ChatMessage } from "@/lib/ai-client";
import { buildStyleGuidance, useAppSettings } from "@/lib/app-settings";
import { cn } from "@/lib/utils";

const TITLE = "AI Workplace Chat | AI Workplace Productivity Assistant";
const DESCRIPTION =
  "Ask an AI workplace assistant about meetings, planning, processes and communication and get structured answers.";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: WorkplaceChat,
});

const SUGGESTIONS = [
  "Write an agenda for a 30-minute weekly team stand-up",
  "How do I give constructive feedback to a peer?",
  "Turn these notes into clear action items with owners",
  "Help me prioritise a busy week using an impact matrix",
] as const;

function WorkplaceChat() {
  const { settings } = useAppSettings();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const run = async (history: ChatMessage[]) => {
    setLoading(true);
    setMessages([...history, { role: "assistant", content: "" }]);
    try {
      await streamAi({
        feature: "chat",
        messages: history,
        extraSystem: buildStyleGuidance(settings),
        onDelta: (text) =>
          setMessages([...history, { role: "assistant", content: text }]),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "The chat request failed";
      toast.error(message);
      setMessages([...history, { role: "assistant", content: `⚠️ ${message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const send = (text: string) => {
    const value = text.trim();
    if (!value || loading) return;
    setInput("");
    void run([...messages.filter((m) => m.content.trim()), { role: "user", content: value }]);
  };

  const regenerate = (assistantIndex: number) => {
    if (loading) return;
    void run(messages.slice(0, assistantIndex));
  };

  const applyEdit = (index: number) => {
    const value = editValue.trim();
    setEditingIndex(null);
    if (!value) return;
    const history = messages.slice(0, index);
    void run([...history, { role: "user", content: value }]);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copying isn't available in this browser");
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8.5rem)] w-full max-w-4xl flex-col gap-4">
      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-border bg-card px-4 py-5 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
            <span
              className="grid h-14 w-14 place-items-center rounded-2xl text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <MessagesSquare className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AI Workplace Chat</h1>
              <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                Ask about planning, communication, meetings or process — answers come back clear
                and structured.
              </p>
            </div>
            {settings.showSuggestedPrompts && (
              <div className="grid w-full max-w-xl gap-2.5 sm:grid-cols-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="animate-rise grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2.5 rounded-xl border border-border bg-secondary/40 p-3 text-left text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-soft"
                  >
                    <Sparkle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="min-w-0">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "animate-rise flex flex-col gap-2",
                  message.role === "user" ? "items-end" : "items-start",
                )}
              >
                {message.role === "user" ? (
                  editingIndex === index ? (
                    <div className="w-full max-w-[85%] space-y-2">
                      <Textarea
                        value={editValue}
                        onChange={(event) => setEditValue(event.target.value)}
                        className="min-h-[90px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingIndex(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => applyEdit(index)}>
                          <Check className="h-4 w-4" /> Send edit
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-primary-foreground">
                        {message.content}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingIndex(index);
                            setEditValue(message.content);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => copy(message.content)}>
                          <Copy className="h-3.5 w-3.5" /> Copy
                        </Button>
                      </div>
                    </>
                  )
                ) : (
                  <div className="w-full max-w-[95%]">
                    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                      <span
                        className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-primary-foreground"
                        style={{ background: "var(--gradient-primary)" }}
                      >
                        <Sparkle className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        {message.content ? (
                          <MarkdownBody text={message.content} />
                        ) : (
                          <span className="animate-pulse text-sm text-muted-foreground">
                            Thinking…
                          </span>
                        )}
                      </div>
                    </div>
                    {message.content && !(loading && index === messages.length - 1) && (
                      <div className="mt-2 ml-10 flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => copy(message.content)}>
                          <Copy className="h-3.5 w-3.5" /> Copy
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => regenerate(index)}>
                          <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 rounded-2xl border border-border bg-card p-2.5 shadow-xs">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask a workplace question…"
            className="max-h-40 min-h-[46px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <Button
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl"
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <AiDisclaimer />
      </div>
    </div>
  );
}