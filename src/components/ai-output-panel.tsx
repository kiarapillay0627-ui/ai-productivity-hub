import { Check, Copy, Pencil, RefreshCw } from "lucide-react";
import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function MarkdownBody({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-foreground [&_h1]:text-base [&_h1]:font-bold [&_h2]:text-sm [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:whitespace-pre-wrap [&_strong]:font-semibold">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}

export function AiOutputPanel({
  title,
  value,
  onChange,
  onRegenerate,
  isStreaming,
  extraActions,
  minHeight = "min-h-[240px]",
  showDisclaimer = true,
}: {
  title: string;
  value: string;
  onChange: (next: string) => void;
  onRegenerate?: () => void;
  isStreaming?: boolean;
  extraActions?: ReactNode;
  minHeight?: string;
  showDisclaimer?: boolean;
}) {
  const [editing, setEditing] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copying isn't available in this browser");
    }
  };

  return (
    <Card className="card-elevated animate-rise gap-4 rounded-2xl border-border">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle className="shrink-0 text-base">{title}</CardTitle>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant={editing ? "default" : "outline"}
            size="sm"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {editing ? "Done" : "Edit"}
          </Button>
          <Button variant="outline" size="sm" onClick={copy}>
            <Copy className="h-4 w-4" /> Copy
          </Button>
          {onRegenerate && (
            <Button variant="outline" size="sm" onClick={onRegenerate} disabled={isStreaming}>
              <RefreshCw className={cn("h-4 w-4", isStreaming && "animate-spin")} /> Regenerate
            </Button>
          )}
          {extraActions}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {editing ? (
          <Textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={cn("resize-y font-mono text-sm leading-relaxed", minHeight)}
          />
        ) : (
          <div className={cn("rounded-xl bg-secondary/40 p-4", minHeight)}>
            <MarkdownBody text={value} />
            {isStreaming && (
              <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse rounded-sm bg-primary" />
            )}
          </div>
        )}
        {showDisclaimer && <AiDisclaimer className="no-print" />}
      </CardContent>
    </Card>
  );
}
