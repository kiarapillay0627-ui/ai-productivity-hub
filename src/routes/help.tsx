import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, Lightbulb, Mail, MessagesSquare, ScanSearch } from "lucide-react";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TITLE = "Help & Support | AI Workplace Productivity Assistant";
const DESCRIPTION =
  "Getting started guides, prompt tips and answers to common questions about the AI workplace assistant.";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Help,
});

const GUIDES = [
  {
    icon: Mail,
    title: "Smart Email Generator",
    steps: [
      "Name the recipient and their role so the tone lands correctly.",
      "Describe the purpose in one sentence — what should happen next?",
      "Pick Formal, Friendly or Persuasive, then add any facts or deadlines.",
      "Edit the draft, copy it into your mail client, or save it for later.",
    ],
  },
  {
    icon: ScanSearch,
    title: "AI Research Assistant",
    steps: [
      "Enter a topic, or paste the full text of an article or report.",
      "Review the Summary, Key Insights and Recommendations separately.",
      "Edit any section inline, then export the briefing as a PDF.",
    ],
  },
  {
    icon: MessagesSquare,
    title: "AI Workplace Chat",
    steps: [
      "Start from a suggested prompt or ask your own question.",
      "Follow up in the same conversation to refine the answer.",
      "Use Edit to reword your question, or Regenerate for a fresh reply.",
    ],
  },
] as const;

const FAQS = [
  {
    q: "Do I need an account?",
    a: "No. There is no sign-up, login or user profile. Open the app and start working.",
  },
  {
    q: "Where is my data stored?",
    a: "Nothing is stored on a server. Saved email drafts and your settings live only in your own browser's local storage, and chat history clears when you reload the page.",
  },
  {
    q: "Which AI model powers the app?",
    a: "Google Gemini, accessed securely through Lovable AI. The API credentials stay on the server and are never exposed to your browser.",
  },
  {
    q: "Why does an answer look incomplete?",
    a: "Responses stream in live. If a response stops early or an error appears, press Regenerate — usually a transient rate limit.",
  },
  {
    q: "Can I trust the output as-is?",
    a: "No. Always review AI-generated content for accuracy, completeness and organisational compliance before professional use.",
  },
  {
    q: "How do I clear everything?",
    a: "Open Settings and use 'Clear local data' to remove saved drafts and preferences from this browser.",
  },
] as const;

const TIPS = [
  "Give the assistant context: audience, goal and any constraints.",
  "Ask for a format — bullet points, a table, or a short paragraph.",
  "Iterate: ask it to shorten, soften or sharpen the result.",
  "Never paste passwords, secrets or regulated personal data.",
] as const;

function Help() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        icon={LifeBuoy}
        title="Help & Support"
        description="Everything you need to get great results from the assistant."
      />
      <AiDisclaimer />

      <div className="grid gap-4 md:grid-cols-3">
        {GUIDES.map((guide) => (
          <Card key={guide.title} className="card-elevated animate-rise rounded-2xl border-border">
            <CardHeader className="gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <guide.icon className="h-5 w-5" />
              </span>
              <CardTitle className="text-base">{guide.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2.5 text-sm text-muted-foreground">
                {guide.steps.map((step, index) => (
                  <li key={step} className="grid grid-cols-[auto_minmax(0,1fr)] gap-2.5">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-bold text-foreground">
                      {index + 1}
                    </span>
                    <span className="min-w-0 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <Card className="card-elevated rounded-2xl border-border">
          <CardHeader>
            <CardTitle className="text-base">Frequently asked questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger className="text-left text-sm">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="card-elevated h-fit rounded-2xl border-border">
          <CardHeader className="gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <Lightbulb className="h-5 w-5" />
            </span>
            <CardTitle className="text-base">Prompting tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm leading-relaxed text-muted-foreground">
              {TIPS.map((tip) => (
                <li key={tip} className="grid grid-cols-[auto_minmax(0,1fr)] gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="min-w-0">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}