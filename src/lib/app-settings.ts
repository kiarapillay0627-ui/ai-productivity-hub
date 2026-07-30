import { useCallback, useEffect, useState } from "react";

export type AppSettings = {
  senderName: string;
  signature: string;
  defaultTone: "Formal" | "Friendly" | "Persuasive";
  responseLength: "Concise" | "Balanced" | "Detailed";
  showSuggestedPrompts: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  senderName: "",
  signature: "",
  defaultTone: "Formal",
  responseLength: "Balanced",
  showSuggestedPrompts: true,
};

const KEY = "awpa.settings";

export function readSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(readSettings());
  }, []);

  const update = useCallback((patch: Partial<AppSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
      window.localStorage.removeItem("awpa.drafts");
    } catch {
      /* storage unavailable */
    }
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return { settings, update, reset };
}

export function buildStyleGuidance(settings: AppSettings) {
  const parts: string[] = [];
  if (settings.responseLength === "Concise") {
    parts.push("Keep the response tight and skimmable — no filler.");
  } else if (settings.responseLength === "Detailed") {
    parts.push("Provide thorough, well-structured detail with clear headings.");
  }
  if (settings.senderName) parts.push(`The sender's name is ${settings.senderName}.`);
  if (settings.signature) parts.push(`Use this email signature verbatim:\n${settings.signature}`);
  return parts.join("\n");
}