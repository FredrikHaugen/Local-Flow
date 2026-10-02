import { USING } from "@/lib/content";

// 24 bars, like the real overlay (OverlayView.swift keeps 24 levels).
const OVERLAY_BARS = [
  0.3, 0.55, 0.9, 0.5, 1, 0.65, 0.4, 0.8, 0.45, 0.7, 0.35, 0.6, 0.85, 0.5, 0.95, 0.4, 0.7, 0.3, 0.6, 0.8, 0.45, 0.65,
  0.35, 0.5,
];

// The real overlay: a dark capsule with level bars and a status label. It is dark in both themes.
export function OverlayPill() {
  return (
    <div
      aria-hidden="true"
      className="inline-flex h-10 items-center gap-2.5 rounded-full bg-overlay px-4 font-sans text-overlay-foreground shadow-[0_14px_30px_-12px_rgb(0_0_0/0.5)]"
    >
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
    </div>
  );
}
