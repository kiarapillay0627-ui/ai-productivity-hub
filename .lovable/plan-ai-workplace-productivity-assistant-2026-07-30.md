# AI Workplace Productivity Assistant

A responsive, light-theme SaaS app with a sticky sidebar and seven pages, powered by Google Gemini through Lovable AI. No login, no database — everything runs in the browser session (drafts and settings kept in local browser storage).

## Pages

- **Dashboard** (`/`) — welcome message plus three rounded feature cards linking to Email Generator, Research Assistant and Workplace Chat, with quick stats and the responsible-AI disclaimer.
- **Smart Email Generator** (`/email`) — form with Recipient, Purpose, Tone (Formal / Friendly / Persuasive) and Additional Information. Output panel is editable, with Edit, Copy, Regenerate and Save Draft (saved drafts listed below, stored locally).
- **AI Research Assistant** (`/research`) — Topic or pasted article input. Output split into Summary, Key Insights and Recommendations, each editable, with Edit, Copy, Regenerate and Export PDF (browser print-to-PDF of a clean report layout).
- **AI Workplace Chat** (`/chat`) — ChatGPT-style streaming conversation: sticky composer, suggested starter prompts, message actions for Edit (resend a user message), Copy and Regenerate. History lives in the session only.
- **Responsible AI** (`/responsible-ai`) — eight cards: Human Oversight, Privacy, Fairness & Bias, Accuracy, Transparency, Ethical Use, Security, User Responsibility.
- **Help & Support** (`/help`) — getting-started steps, FAQ accordion, tips for better prompts, contact block.
- **Settings** (`/settings`) — default email tone, default response length, sender name/signature, suggested-prompt toggle, and clear-local-data action. Applied to AI requests.

## AI behaviour

All three AI features call Gemini via Lovable AI with the exact system prompts requested:

- Email: professional workplace communication assistant producing subject, greeting, body, closing.
- Research: summarise, identify key insights, provide practical recommendations in professional business language.
- Chat: intelligent workplace productivity assistant giving professional, well-structured responses.

Responses stream so text appears progressively. Rate limit (429) and credit (402) errors surface as clear in-app messages.

## Design

Light theme with a professional blue/slate token palette in `src/styles.css`, rounded cards, soft shadows, subtle fade/slide animations, sticky sidebar that collapses to a mobile sheet, and generous whitespace. Every AI output surface shows:
"AI-generated content should always be reviewed for accuracy, completeness and organisational compliance before professional use."

## Technical notes

- Routes as TanStack Start route files under `src/routes/`; shared app shell (sidebar + header) in `__root.tsx`, each page with its own SEO `head()` metadata.
- One streaming server route `src/routes/api/chat.ts` handles all three features via the AI SDK with the Lovable AI Gateway provider (`google/gemini-3.6-flash`), keeping `LOVABLE_API_KEY` server-side only. Provisioned via the AI gateway key tool.
- Client uses the AI SDK React chat hook for chat, and a small streaming helper for the email/research one-shot generations.
- shadcn/ui components (card, button, select, textarea, tabs, accordion, switch, sonner toasts) plus lucide icons; markdown rendering for AI output via `react-markdown`.
- Drafts and settings persist in `localStorage` only — no backend storage.
