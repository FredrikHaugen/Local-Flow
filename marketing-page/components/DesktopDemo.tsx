import { MacWindow } from "@/components/MacWindow";
import { DEMO, PROMISES, SPEED } from "@/lib/site";

const fillers = new Set<string>(DEMO.fillers);

// 24 bars, like the real overlay (OverlayView.swift keeps 24 levels).
const OVERLAY_BARS = [
  0.3, 0.55, 0.9, 0.5, 1, 0.65, 0.4, 0.8, 0.45, 0.7, 0.35, 0.6, 0.85, 0.5, 0.95, 0.4, 0.7, 0.3, 0.6, 0.8, 0.45, 0.65,
  0.35, 0.5,
];

// The wallpaper's skyline of bars: deterministic, so server and client render the same thing.
const SKYLINE = Array.from({ length: 96 }, (_, i) => {
  const h = 0.18 + 0.82 * Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11 + 1.3));
  return Math.round(h * 100) / 100;
});

// The real overlay: a near-black capsule with white level bars and a status label.
function OverlayPill() {
  return (
    <div
      aria-hidden="true"
      className="inline-flex h-11 items-center gap-2.5 rounded-full border border-white/15 bg-ink px-4 text-ink-foreground shadow-[0_14px_30px_-12px_rgb(0_0_0/0.6)]"
    >
      <span className="flex h-6 items-center gap-[2px]">
        {OVERLAY_BARS.map((h, i) => (
          <span
            key={i}
            className={`wave-bar w-[3px] rounded-[1px] bg-ink-foreground ${i >= 14 ? "hidden sm:block" : ""}`}
            style={{ height: `${20 + h * 80}%`, animationDelay: `${i * 60}ms` }}
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

function MenuBar() {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-8 items-center gap-5 bg-ink/15 px-4 text-[0.8rem] text-accent-foreground backdrop-blur-sm sm:px-6"
    >
      {DEMO.menuItems.map((item, i) => (
        <span key={item} className={`${i === 0 ? "font-bold" : "font-medium opacity-90"} ${i > 2 ? "hidden sm:inline" : ""}`}>
          {item}
        </span>
      ))}
      <span className="ml-auto flex items-center gap-4">
        {/* LocalFlow's menu-bar mic, lit while it listens. */}
        <span className="grid h-5 w-7 place-items-center rounded-md bg-accent-foreground text-accent">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </span>
        <span className="font-medium tabular-nums">{DEMO.clock}</span>
      </span>
    </div>
  );
}

export function DesktopDemo() {
  const words = DEMO.raw.split(" ");
  return (
    <figure className="surface-accent wallpaper relative overflow-hidden text-accent-foreground">
      {/* A skyline of waveform bars across the whole band — the page's signature. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 960 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-[38%] h-[46%] w-full opacity-[0.16]"
        fill="currentColor"
      >
        {SKYLINE.map((h, i) => (
          <rect key={i} x={i * 10 + 2} y={100 - h * 95} width="5" height={h * 190} rx="2.5" />
        ))}
      </svg>

      <MenuBar />

      <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-16">
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-0">
          {/* What you said, with the overlay that was on screen while you said it. */}
          <div className="relative z-10 rounded-2xl bg-ink p-5 text-ink-foreground shadow-[0_30px_60px_-24px_rgb(0_0_0/0.7)] sm:p-6 lg:-mr-10 lg:mt-36">
            <OverlayPill />
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-ink-muted">
              <span aria-hidden="true" className="rec-dot h-2 w-2 rounded-full bg-ink-accent" />
              {DEMO.heardLabel}
            </p>
            <p data-demo="raw" className="mt-2 font-mono text-[0.95rem] leading-relaxed">
              {words.map((word, i) => (
                <span key={i}>
                  {i > 0 && " "}
                  {fillers.has(word) ? (
                    <s className="text-ink-muted decoration-ink-accent decoration-2">{word}</s>
                  ) : (
                    word
                  )}
                </span>
              ))}
            </p>
          </div>

          <MacWindow
            title={DEMO.subject}
            className="window-shadow"
            toolbar={
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="currentColor">
                <path d="M3 11.5 21 3l-6.5 18-3-7.5L3 11.5Z" />
              </svg>
            }
          >
            <dl className="text-[0.85rem]">
              <div className="flex gap-2 border-b border-border px-5 py-2.5">
                <dt className="text-muted">To:</dt>
                <dd>
                  <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">{DEMO.to}</span>
                </dd>
              </div>
              <div className="flex gap-2 border-b border-border px-5 py-2.5">
                <dt className="text-muted">Subject:</dt>
                <dd className="font-medium">{DEMO.subject}</dd>
              </div>
            </dl>
            <div className="min-h-44 px-5 pb-6 pt-5 sm:min-h-52 sm:px-7 sm:pt-6 lg:pl-16">
              <p className="text-[1.05rem] leading-[1.7] sm:text-[1.15rem]">
                <span data-demo="cleaned" className="just-pasted">
                  {DEMO.cleaned}
                </span>
                <span
                  aria-hidden="true"
                  className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] rounded-full bg-accent"
                />
              </p>
            </div>
            <p className="flex items-center gap-2 border-t border-border px-5 py-3 text-xs font-semibold text-muted sm:px-7 lg:pl-16">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
              {SPEED.stamp}
            </p>
          </MacWindow>
        </div>

        <ul className="mt-14 sm:mt-20 flex flex-wrap gap-x-6 gap-y-2 border-t border-accent-foreground/25 pt-6 text-sm font-semibold">
          {PROMISES.map((promise) => (
            <li key={promise} className="flex items-center gap-2">
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 8.5 3 3 7-7" />
              </svg>
              {promise}
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="sr-only">
        Example in {DEMO.app}: a rambling spoken message becomes a clean, punctuated paragraph. Filler words are removed
        and nothing else is reworded.
      </figcaption>
    </figure>
  );
}
