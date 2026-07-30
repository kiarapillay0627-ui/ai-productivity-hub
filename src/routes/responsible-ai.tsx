import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpenCheck,
  Eye,
  Lock,
  Scale,
  ShieldCheck,
  Target,
  UserCheck,
  Users,
  HeartHandshake,
} from "lucide-react";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TITLE = "Responsible AI | AI Workplace Productivity Assistant";
const DESCRIPTION =
  "How this workplace assistant handles human oversight, privacy, fairness, accuracy, transparency, ethics and security.";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ResponsibleAi,
});

const PRINCIPLES = [
  {
    icon: Eye,
    title: "Human Oversight",
    body: "Every output is a draft. A person must review, edit and approve AI content before it is sent, published or used in a decision.",
  },
  {
    icon: Lock,
    title: "Privacy",
    body: "No accounts and no database. Your inputs are sent to the AI model only to produce a response; drafts and settings stay in your own browser storage.",
  },
  {
    icon: Scale,
    title: "Fairness & Bias",
    body: "Language models can reflect bias in their training data. Check that tone, examples and recommendations are inclusive and appropriate for your audience.",
  },
  {
    icon: Target,
    title: "Accuracy",
    body: "AI can state incorrect facts confidently. Verify figures, names, dates, citations and policy claims against trusted sources before use.",
  },
  {
    icon: Users,
    title: "Transparency",
    body: "This app clearly labels AI-generated content, names the model in use (Google Gemini) and shows a review disclaimer wherever output appears.",
  },
  {
    icon: HeartHandshake,
    title: "Ethical Use",
    body: "Use the assistant to support honest, respectful workplace communication — not to mislead, impersonate, pressure or discriminate against anyone.",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    body: "AI requests run through a secured server route so credentials are never exposed to the browser. Avoid entering credentials, secrets or regulated personal data.",
  },
  {
    icon: UserCheck,
    title: "User Responsibility",
    body: "You remain accountable for anything you send. Follow your organisation's AI, data-handling and compliance policies at all times.",
  },
] as const;

function ResponsibleAi() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        icon={BookOpenCheck}
        title="Responsible AI"
        description="The principles that guide how this assistant should be used at work."
      />
      <AiDisclaimer />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PRINCIPLES.map((principle) => (
          <Card
            key={principle.title}
            className="card-elevated animate-rise rounded-2xl border-border transition-transform duration-300 hover:-translate-y-1"
          >
            <CardHeader className="gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <principle.icon className="h-5 w-5" />
              </span>
              <CardTitle className="text-base">{principle.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
