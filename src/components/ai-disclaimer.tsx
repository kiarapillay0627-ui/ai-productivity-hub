import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export const AI_DISCLAIMER =
  "AI-generated content should always be reviewed for accuracy, completeness and organisational compliance before professional use.";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-border bg-primary-soft/60 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>{AI_DISCLAIMER}</span>
    </div>
  );
}