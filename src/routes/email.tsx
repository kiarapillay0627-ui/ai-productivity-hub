import { createFileRoute } from "@tanstack/react-router";
import { Mail, Save, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { AiOutputPanel } from "@/components/ai-output-panel";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { streamAi } from "@/lib/ai-client";
import { buildStyleGuidance, useAppSettings } from "@/lib/app-settings";
import { readDrafts, writeDrafts, type EmailDraft } from "@/lib/drafts";

const TITLE = "Smart Email Generator | AI Workplace Productivity Assistant";
const DESCRIPTION =
  "Generate clear, professional business emails with a subject, greeting, body and closing in your chosen tone.";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: EmailGenerator,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;

function EmailGenerator() {
  const { settings } = useAppSettings();
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<string>("Formal");
  const [extra, setExtra] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);

  useEffect(() => {
    setDrafts(readDrafts());
  }, []);

  useEffect(() => {
    setTone(settings.defaultTone);
  }, [settings.defaultTone]);

  const generate = async () => {
    if (!recipient.trim() || !purpose.trim()) {
      toast.error("Add a recipient and a purpose first");
      return;
    }

    setLoading(true);
    setOutput("");
    try {
      await streamAi({
        feature: "email",
        extraSystem: buildStyleGuidance(settings),
        prompt: [
          `Recipient: ${recipient.trim()}`,
          `Purpose of the email: ${purpose.trim()}`,
          `Tone: ${tone}`,
          extra.trim() ? `Additional information: ${extra.trim()}` : null,
          "",
          "Write the complete email. Start with a 'Subject:' line, then the greeting, body paragraphs and closing.",
        ]
          .filter(Boolean)
          .join("\n"),
        onDelta: setOutput,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    if (!output.trim()) return;
    const draft: EmailDraft = {
      id: crypto.randomUUID(),
      recipient: recipient || "Untitled recipient",
      purpose: purpose || "No purpose noted",
      tone,
      content: output,
      savedAt: new Date().toISOString(),
    };
    const next = [draft, ...drafts].slice(0, 20);
    setDrafts(next);
    writeDrafts(next);
    toast.success("Draft saved in this browser");
  };

  const removeDraft = (id: string) => {
    const next = drafts.filter((draft) => draft.id !== id);
    setDrafts(next);
    writeDrafts(next);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the situation and get a ready-to-review business email."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Card className="card-elevated h-fit rounded-2xl border-border lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-base">Email details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Priya Sharma, Finance Manager"
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g. Request approval for the Q3 training budget"
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone" className="w-full">
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="extra">Additional information</Label>
              <Textarea
                id="extra"
                placeholder="Deadlines, numbers, links, context the reader needs…"
                className="min-h-[130px] resize-y"
                value={extra}
                onChange={(event) => setExtra(event.target.value)}
              />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full" size="lg">
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating…" : "Generate email"}
            </Button>
            <AiDisclaimer />
          </CardContent>
        </Card>

        <div className="flex min-w-0 flex-col gap-5">
          {output || loading ? (
            <AiOutputPanel
              title="Generated email"
              value={output}
              onChange={setOutput}
              onRegenerate={generate}
              isStreaming={loading}
              extraActions={
                <Button variant="outline" size="sm" onClick={saveDraft} disabled={!output.trim()}>
                  <Save className="h-4 w-4" /> Save draft
                </Button>
              }
            />
          ) : (
            <Card className="card-elevated grid min-h-[280px] place-items-center rounded-2xl border-dashed border-border">
              <CardContent className="max-w-sm text-center">
                <Mail className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Fill in the details and your email will appear here, ready to edit, copy or save.
                </p>
              </CardContent>
            </Card>
          )}

          {drafts.length > 0 && (
            <Card className="card-elevated rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="text-base">Saved drafts ({drafts.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-xl border border-border bg-secondary/40 p-3"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setOutput(draft.content);
                        setRecipient(draft.recipient);
                        setPurpose(draft.purpose);
                        setTone(draft.tone);
                        toast.success("Draft loaded");
                      }}
                      className="min-w-0 text-left"
                    >
                      <span className="block truncate text-sm font-semibold">
                        {draft.recipient}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {draft.tone} · {draft.purpose}
                      </span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete draft"
                      onClick={() => removeDraft(draft.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
