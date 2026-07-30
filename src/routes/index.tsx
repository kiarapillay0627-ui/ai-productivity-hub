import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, Mail, MessagesSquare, ScanSearch, Sparkle } from "lucide-react";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TITLE = "Dashboard | AI Workplace Productivity Assistant";
const DESCRIPTION =
  "Your AI workspace for drafting business emails, summarising research and answering everyday workplace questions.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description:
      "Turn a few notes into a polished business email with the right subject, tone and closing.",
    action: "Draft an email",
  },
  {
    to: "/research",
    icon: ScanSearch,
    title: "AI Research Assistant",
    description:
      "Summarise a topic or long article into an executive summary, key insights and recommendations.",
    action: "Start research",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Workplace Chat",
    description:
      "Ask anything about meetings, planning, processes or communication and get structured answers.",
    action: "Open chat",
  },
] as const;

const STATS = [
  { label: "Model", value: "Google Gemini" },
  { label: "Sign-in required", value: "None" },
  { label: "Data stored", value: "In your browser" },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section
        className="animate-rise overflow-hidden rounded-3xl px-6 py-8 text-primary-foreground sm:px-9 sm:py-11"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-float)" }}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
          <Sparkle className="h-3.5 w-3.5" /> Powered by Google Gemini
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl">
          Welcome back — let's get your work moving
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
          Write sharper emails, digest research in minutes and get clear answers to everyday
          workplace questions — all in one assistant.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Button asChild size="lg" variant="secondary">
            <Link to="/email">
              Generate an email <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
          >
            <Link to="/chat">Open workplace chat</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <Card key={stat.label} className="card-elevated rounded-2xl border-border py-4">
            <CardContent className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <Clock3 className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">{stat.label}</span>
                <span className="block truncate text-sm font-semibold">{stat.value}</span>
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card
            key={feature.to}
            className="card-elevated group rounded-2xl border-border transition-all duration-300 hover:-translate-y-1"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <CardHeader className="gap-3">
              <span
                className="grid h-11 w-11 place-items-center rounded-2xl text-primary-foreground transition-transform duration-300 group-hover:scale-105"
                style={{ background: "var(--gradient-primary)" }}
              >
                <feature.icon className="h-5 w-5" />
              </span>
              <CardTitle className="text-base">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              <Button asChild variant="outline" className="w-full justify-between">
                <Link to={feature.to}>
                  {feature.action} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <AiDisclaimer />
    </div>
  );
}
