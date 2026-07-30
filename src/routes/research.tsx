import { createFileRoute } from "@tanstack/react-router";
import { FileDown, ScanSearch, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AiDisclaimer, AI_DISCLAIMER } from "@/components/ai-disclaimer";
import { AiOutputPanel } from "@/components/ai-output-panel";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { streamAi } from "@/lib/ai-client";
import { buildStyleGuidance, useAppSettings } from "@/lib/app-settings";

const TITLE = "AI Research Assistant | AI Workplace Productivity Assistant";
const DESCRIPTION =
  "Summarise any topic or article into an executive summary, key insights and practical business recommendations.";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ResearchAssistant,
});

type Sections = { summary: string; insights: string; recommendations: string };

const EMPTY: Sections = { summary: "", insights: "", recommendations: "" };

function splitSections(text: string): Sections {
  const normalised = text.replace(/\r/g, "");
  const markers = [
    { key: "summary" as const, regex: /(^|\n)#*\s*\**\s*summary\b[^\n]*/i },
    { key: "insights" as const, regex: /(^|\n)#*\s*\**\s*key insights\b[^\n]*/i },
    { key: "recommendations" as const, regex: /(^|\n)#*\s*\**\s*(practical )?recommendations\b[^\n]*/i },
  ];

  const found = markers
    .map(({ key, regex }) => {
      const match = normalised.match(regex);
      return match?.index === undefined
        ? null
        : { key, start: match.index + match[0].length, headStart: match.index };
    })
    .filter((item): item is { key: keyof Sections; start: number; headStart: number } =>
      Boolean(item),
    )
    .sort((a, b) => a.headStart - b.headStart);

  if (found.length === 0) return { ...EMPTY, summary: normalised.trim() };

  const result: Sections = { ...EMPTY };
  found.forEach((item, index) => {
    const end = index + 1 < found.length ? found[index + 1].headStart : normalised.length;
    result[item.key] = normalised.slice(item.start, end).trim();
  });

  if (found[0].headStart > 0 && !result.summary) {
    result.summary = normalised.slice(0, found[0].headStart).trim();
  }
  return result;
}

function ResearchAssistant() {
  const { settings } = useAppSettings();
  const [input, setInput] = useState("");
  const [sections, setSections] = useState<Sections>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const generate = async () => {
    if (!input.trim()) {
      toast.error("Enter a topic or paste an article first");
      return;
    }

    setLoading(true);
    setHasResult(true);
    setSections(EMPTY);
    try {
      await streamAi({
        feature: "research",
        extraSystem: buildStyleGuidance(settings),
        prompt: [
          "Topic or article to analyse:",
          input.trim(),
          "",
          "Respond using exactly these three markdown headings, in this order and with no other top-level headings:",
          "## Summary",
          "## Key Insights",
          "## Recommendations",
          "Use bullet points under Key Insights and Recommendations.",
        ].join("\n"),
        onDelta: (text) => setSections(splitSections(text)),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Research failed");
    } finally {
      setLoading(false);
    }
  };

  const exportPdf = () => {
    const win = window.open("", "_blank", "width=900,height=1000");
    if (!win) {
      toast.error("Allow pop-ups to export the report");
      return;
    }
    const escape = (value: string) =>
      value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    win.document.write(`<!doctype html><html><head><title>Research report</title>
      <style>
        body{font-family:Arial,Helvetica,sans-serif;color:#1f2937;margin:48px;line-height:1.6}
        h1{font-size:22px} h2{font-size:16px;margin-top:28px;color:#2563eb}
        pre{white-space:pre-wrap;font-family:inherit;font-size:13px}
        .note{margin-top:36px;font-size:11px;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:12px}
      </style></head><body>
      <h1>Research Report</h1>
      <p><strong>Topic:</strong> ${escape(input.slice(0, 400))}</p>
      <h2>Summary</h2><pre>${escape(sections.summary)}</pre>
      <h2>Key Insights</h2><pre>${escape(sections.insights)}</pre>
      <h2>Recommendations</h2><pre>${escape(sections.recommendations)}</pre>
      <p class="note">${AI_DISCLAIMER}</p>
      </body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        icon={ScanSearch}
        title="AI Research Assistant"
        description="Paste an article or name a topic to get a business-ready briefing."
      />

      <Card className="card-elevated rounded-2xl border-border">
        <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <CardTitle className="truncate text-base">Topic or article</CardTitle>
          {hasResult && (
            <Button variant="outline" size="sm" onClick={exportPdf}>
              <FileDown className="h-4 w-4" /> Export PDF
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="e.g. Hybrid work policies in mid-sized companies — or paste the full article text here…"
            className="min-h-[170px] resize-y"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={generate} disabled={loading} size="lg">
              <Sparkles className="h-4 w-4" />
              {loading ? "Analysing…" : "Analyse"}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                setInput("");
                setSections(EMPTY);
                setHasResult(false);
              }}
            >
              Clear
            </Button>
          </div>
          <AiDisclaimer />
        </CardContent>
      </Card>

      {hasResult && (
        <div className="flex flex-col gap-5">
          <AiOutputPanel
            title="Summary"
            value={sections.summary}
            onChange={(summary) => setSections((s) => ({ ...s, summary }))}
            onRegenerate={generate}
            isStreaming={loading}
            minHeight="min-h-[160px]"
            showDisclaimer={false}
          />
          <AiOutputPanel
            title="Key Insights"
            value={sections.insights}
            onChange={(insights) => setSections((s) => ({ ...s, insights }))}
            onRegenerate={generate}
            isStreaming={loading}
            minHeight="min-h-[160px]"
            showDisclaimer={false}
          />
          <AiOutputPanel
            title="Recommendations"
            value={sections.recommendations}
            onChange={(recommendations) => setSections((s) => ({ ...s, recommendations }))}
            onRegenerate={generate}
            isStreaming={loading}
            minHeight="min-h-[160px]"
          />
        </div>
      )}
    </div>
  );
}