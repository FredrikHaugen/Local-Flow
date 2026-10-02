import { MacWindow } from "@/components/MacWindow";
import { DEMO } from "@/lib/site";

const fillers = new Set<string>(DEMO.fillers);

// 24 bars, like the real overlay (OverlayView.swift keeps 24 levels).
const OVERLAY_BARS = [
  0.3, 0.55, 0.9, 0.5, 1, 0.65, 0.4, 0.8, 0.45, 0.7, 0.35, 0.6, 0.85, 0.5, 0.95, 0.4, 0.7, 0.3, 0.6, 0.8, 0.45, 0.65,
  0.35, 0.5,
];

// The real overlay: a dark capsule with level bars and a status label. It is dark in both themes.
function OverlayPill() {
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
        <span className="sm:hidden">{DEMO.overlayLabel.split("  ")[0]}</span>
        <span className="hidden sm:inline">{DEMO.overlayLabel}</span>
      </span>
    </div>
  );
}

// The product doing its one job: what you said, in the margin, and the paste, in a full-size
// window, with the overlay where the real one sits, near the bottom of the screen.
export function DesktopDemo() {
  const words = DEMO.raw.split(" ");
  return (
    <figure className="relative mt-10 grid gap-6 pb-8 sm:mt-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
      <div className="relative lg:pt-8">
        <p className="font-sans text-sm font-semibold">{DEMO.heardLabel}</p>
        <p data-demo="raw" className="demo-heard mt-1.5 font-mono text-[0.85rem] leading-relaxed text-muted">
          {words.map((word, i) => (
            <span key={i}>
              {i > 0 && " "}
              {fillers.has(word) ? <s className="decoration-foreground/60">{word}</s> : <span className="text-foreground">{word}</span>}
            </span>
          ))}
        </p>
        {/* The take on the left becomes the paragraph on the right. */}
        <span aria-hidden="true" className="absolute -right-8 top-8 hidden font-sans text-2xl text-muted lg:block">
          →
        </span>
      </div>

      <MacWindow title={DEMO.subject} className="window-shadow">
        <div className="px-6 pb-14 pt-6 sm:px-10 sm:pb-16 sm:pt-7">
          <p className="sr-only">{DEMO.typedLabel}</p>
          <p className="demo-paste font-serif text-[1.1rem] leading-[1.75] sm:text-[1.3rem]">
            <span data-demo="cleaned" className="selected">
              {DEMO.cleaned}
            </span>
            <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-foreground" />
          </p>
        </div>
      </MacWindow>

      <div className="absolute bottom-0 right-0 flex justify-center lg:left-[16.5rem]">
        <OverlayPill />
      </div>
      <figcaption className="sr-only">
        Example in {DEMO.app}: a rambling spoken message becomes a clean, punctuated paragraph. Filler words are removed
        and nothing else is reworded.
      </figcaption>
    </figure>
  );
}
