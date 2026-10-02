"use client";

import { useEffect, useState } from "react";
import { ANALYTICS } from "@/lib/site";

// Microsoft Clarity, strictly opt-in. Until the visitor clicks Allow, nothing from clarity.ms is
// requested and no cookie is set; the exported HTML carries no third-party script (pnpm check).
// The choice is kept in localStorage, and the footer's settings button reopens the banner.

const SETTINGS_EVENT = "lf-analytics-settings";

type Clarity = ((...args: unknown[]) => void) & { q?: unknown[][] };
declare global {
  interface Window {
    clarity?: Clarity;
  }
}

function readChoice(): string | null {
  try {
    return localStorage.getItem(ANALYTICS.storageKey);
  } catch {
    return null;
  }
}

function saveChoice(choice: "granted" | "denied") {
  try {
    localStorage.setItem(ANALYTICS.storageKey, choice);
  } catch {
    // Storage blocked: the choice holds for this page view only.
  }
}

// The official Clarity snippet, run only after consent.
function loadClarity() {
  if (document.querySelector('script[src*="clarity.ms/tag/"]')) return;
  const queue: Clarity = (...args) => {
    (queue.q = queue.q || []).push(args);
  };
  window.clarity = window.clarity || queue;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${ANALYTICS.clarityId}`;
  document.head.appendChild(script);
  window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
}

export function AnalyticsConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const choice = readChoice();
    if (choice === "granted") loadClarity();
    // Reading localStorage only exists after mount, so the banner can't be part of the static HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else if (choice === null) setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener(SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(SETTINGS_EVENT, reopen);
  }, []);

  function allow() {
    saveChoice("granted");
    loadClarity();
    setOpen(false);
  }

  function decline() {
    const wasGranted = readChoice() === "granted";
    saveChoice("denied");
    setOpen(false);
    if (wasGranted) {
      // Clarity can't be unloaded from a running page: tell it to stop, then start clean.
      window.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
      window.location.reload();
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={ANALYTICS.settings}
      // Phones: a slim bar flush with the bottom edge, so the hero stays visible. Wider: a corner card.
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_-24px_var(--foreground)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md sm:rounded-lg sm:border sm:p-5 sm:shadow-[0_24px_48px_-24px_var(--foreground)]"
    >
      <p className="text-sm leading-snug sm:leading-relaxed">{ANALYTICS.banner}</p>
      <div className="mt-2.5 flex gap-3 sm:mt-4">
        <button
          type="button"
          onClick={allow}
          className="min-h-11 flex-1 rounded-md bg-foreground px-4 text-sm font-semibold text-background"
        >
          {ANALYTICS.allow}
        </button>
        <button
          type="button"
          onClick={decline}
          className="min-h-11 flex-1 rounded-md border border-border px-4 text-sm font-semibold"
        >
          {ANALYTICS.decline}
        </button>
      </div>
    </div>
  );
}

export function AnalyticsSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))} className={className}>
      {ANALYTICS.settings}
    </button>
  );
}
