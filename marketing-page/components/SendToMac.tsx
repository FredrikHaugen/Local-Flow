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
        className="font-sans inline-flex min-h-11 flex-wrap items-center gap-x-1.5 text-left text-sm"
      >
        <span className="text-muted">{PHONE.handoffLead}</span>
        <span className="font-semibold underline decoration-foreground/40 decoration-2 underline-offset-4">{PHONE.handoff}</span>
        <span aria-hidden="true">→</span>
      </button>
      <p role="status" className="mt-2 text-xs empty:hidden">
        {copied ? PHONE.copied : ""}
      </p>
    </div>
  );
}
