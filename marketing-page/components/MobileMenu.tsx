"use client";

import { useEffect, useState } from "react";
import { SendToMac } from "@/components/SendToMac";
import { HERO_REQUIREMENT, NAV, PHONE, SITE } from "@/lib/site";


// Phones get the header's section links as a full-height sheet under the bar. It closes on a tap,
// on Escape, and when the viewport grows into the desktop layout.
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onWide = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onWide);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onWide);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? PHONE.close : PHONE.menu}
        onClick={() => setOpen((o) => !o)}
        className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card md:hidden"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          {open ? <path d="m5 5 10 10M15 5 5 15" /> : <path d="M3.5 7h13M3.5 13h13" />}
        </svg>
      </button>
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background px-4 pb-10 pt-6 md:hidden"
        >
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{PHONE.menuTitle}</p>
          <ul className="mt-3 border-b border-border">
            {NAV.map((item, i) => (
              <li key={item.href} className="border-t border-border">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-display flex min-h-16 items-center gap-4 text-4xl font-extrabold"
                >
                  <span aria-hidden="true" className="w-6 font-sans text-xs font-semibold text-accent">
                    0{i + 1}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  <span aria-hidden="true" className="text-2xl text-muted">
                    ↓
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={SITE.releasesUrl}
            className="mt-8 flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-accent px-6 font-semibold text-accent-foreground"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v12M6 11l6 6 6-6M5 20h14" />
            </svg>
            Download for Mac
          </a>
          <p className="mt-3 text-center text-xs font-semibold">Requires {HERO_REQUIREMENT}</p>
          <SendToMac className="mt-8" />
        </div>
      )}
    </>
  );
}
