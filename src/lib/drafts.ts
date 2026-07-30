export type EmailDraft = {
  id: string;
  recipient: string;
  purpose: string;
  tone: string;
  content: string;
  savedAt: string;
};

const KEY = "awpa.drafts";

export function readDrafts(): EmailDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as EmailDraft[]) : [];
  } catch {
    return [];
  }
}

export function writeDrafts(drafts: EmailDraft[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(drafts));
  } catch {
    /* storage unavailable */
  }
}
