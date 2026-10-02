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

// The Mac's menu bar, with peluni's own template icon lit by the record light.
function MenuBar() {
  return (
    <div aria-hidden="true" className="flex h-8 items-center gap-5 border-b border-border/70 px-4 font-sans text-[0.8rem] sm:px-6">
      {DEMO.menuItems.map((item, i) => (
        <span key={item} className={`${i === 0 ? "font-bold" : "text-foreground/80"} ${i > 2 ? "hidden sm:inline" : ""}`}>
          {item}
        </span>
      ))}
      <span className="ml-auto flex items-center gap-4">
        <svg viewBox="10 26 90 68" className="h-3.5 w-auto" fill="none">
          <path d="M20 41H43.6522L68.7826 83H88" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="80" cy="41" r="12" className="rec-dot fill-rec" />
        </svg>
        <span className="tabular-nums">{DEMO.clock}</span>
      </span>
    </div>
  );
}

export function DesktopDemo() {
  const words = DEMO.raw.split(" ");
  return (
    <figure className="desk mt-14 sm:mt-20">
      <MenuBar />
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-12">
        <div>
          <p className="font-sans text-sm font-semibold text-muted">{DEMO.heardLabel}</p>
          <p data-demo="raw" className="demo-heard mt-2 font-mono text-[0.95rem] leading-relaxed">
            {words.map((word, i) => (
              <span key={i}>
                {i > 0 && " "}
                {fillers.has(word) ? <s className="text-muted decoration-foreground/50">{word}</s> : word}
              </span>
            ))}
          </p>
          <div className="mt-6">
            <OverlayPill />
          </div>
        </div>

        <MacWindow title={DEMO.subject} className="window-shadow">
          <dl className="text-[0.85rem]">
            <div className="flex gap-2 border-b border-border px-5 py-2.5">
              <dt className="text-muted">To:</dt>
              <dd className="font-medium">{DEMO.to}</dd>
            </div>
            <div className="hidden gap-2 border-b border-border px-5 py-2.5 sm:flex">
              <dt className="text-muted">Subject:</dt>
              <dd className="font-medium">{DEMO.subject}</dd>
            </div>
          </dl>
          <div className="px-5 pb-7 pt-5 sm:min-h-52 sm:px-7">
            <p className="text-sm font-semibold text-muted">{DEMO.typedLabel}</p>
            <p className="demo-paste mt-2 font-serif text-[1.1rem] leading-[1.7]">
              <span data-demo="cleaned" className="selected">
                {DEMO.cleaned}
              </span>
              <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-foreground" />
            </p>
          </div>
        </MacWindow>
      </div>
      <figcaption className="sr-only">
        Example in {DEMO.app}: a rambling spoken message becomes a clean, punctuated paragraph. Filler words are removed
        and nothing else is reworded.
      </figcaption>
    </figure>
  );
}
