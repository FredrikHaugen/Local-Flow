import { USING } from "@/lib/content";

// 24 bars, like the real overlay (OverlayView.swift keeps 24 levels).
const OVERLAY_BARS = [
  0.3, 0.55, 0.9, 0.5, 1, 0.65, 0.4, 0.8, 0.45, 0.7, 0.35, 0.6, 0.85, 0.5, 0.95, 0.4, 0.7, 0.3, 0.6, 0.8, 0.45, 0.65,
  0.35, 0.5,
];

// The real overlay: a dark capsule with a faint white hairline, dark in both themes. While recording it shows level bars and
// "Listening…"; once you let go it shows a small progress ring and the step it is on.
export function OverlayPill({ phase = "listening" }: { phase?: "listening" | "cleaning" }) {
  return (
    <div
      aria-hidden="true"
      className="inline-flex h-10 items-center gap-2.5 rounded-full bg-overlay px-4 font-sans ring-1 ring-inset ring-white/15 text-overlay-foreground shadow-[0_14px_30px_-12px_rgb(0_0_0/0.5)]"
    >
      {phase === "listening" ? (
        <>
          <span className="flex h-5 items-center gap-[2px]">
            {OVERLAY_BARS.map((h, i) => (
              <span
                key={i}
                className={`wave-bar w-[3px] rounded-[1px] bg-overlay-foreground ${i >= 14 ? "hidden sm:block" : ""}`}
                style={{ height: `${Math.round(20 + h * 80)}%` }}
              />
            ))}
          </span>
          <span className="whitespace-pre text-[0.8rem] font-medium">
            <span className="sm:hidden">{USING.overlayLabel.split("  ")[0]}</span>
            <span className="hidden sm:inline">{USING.overlayLabel}</span>
          </span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="8" cy="8" r="6" className="opacity-25" />
            <path d="M8 2a6 6 0 0 1 6 6" />
          </svg>
          <span className="text-[0.8rem] font-medium">{USING.cleaningLabel}</span>
        </>
      )}
    </div>
  );
}
