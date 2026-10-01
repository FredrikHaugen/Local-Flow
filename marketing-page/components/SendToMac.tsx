"use client";

import { useState } from "react";
import { PHONE } from "@/lib/site";

// A phone can't install a Mac app, so on small screens we offer the one useful thing: get this page
// onto the Mac. The share sheet (AirDrop, Messages, Mail) when there is one, otherwise copy the link.
// Nothing leaves the device except through the visitor's own share target.
export function SendToMac({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  async function send() {
    const url = window.location.href.split("#")[0];
    try {
      if (navigator.share) {
        await navigator.share({ title: PHONE.shareTitle, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Share sheet dismissed, or clipboard blocked: nothing to undo.
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={send}
        className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2.5 text-left"
      >
        <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-foreground text-background">
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="13" height="9" rx="1.5" />
            <path d="M6 18h5" />
            <rect x="17" y="8" width="5" height="11" rx="1.2" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs opacity-75">{PHONE.handoffLead}</span>
          <span className="block text-sm font-semibold">{PHONE.handoff}</span>
        </span>
        <span aria-hidden="true" className="text-lg">
          →
        </span>
      </button>
      <p role="status" className="mt-2 text-xs empty:hidden">
        {copied ? PHONE.copied : ""}
      </p>
    </div>
  );
}
