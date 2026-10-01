import { MacWindow } from "@/components/MacWindow";
import { DEMO, PROMISES, SPEED } from "@/lib/site";

const fillers = new Set<string>(DEMO.fillers);

// 24 bars, like the real overlay (OverlayView.swift keeps 24 levels).
const OVERLAY_BARS = [
  0.3, 0.55, 0.9, 0.5, 1, 0.65, 0.4, 0.8, 0.45, 0.7, 0.35, 0.6, 0.85, 0.5, 0.95, 0.4, 0.7, 0.3, 0.6, 0.8, 0.45, 0.65,
  0.35, 0.5,
];

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
      <MenuBar />

      <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12">
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.3fr)] lg:gap-0">
          {/* What you said, with the key you're holding and the overlay that was on screen while you said it. */}
          <div className="relative z-10 rounded-2xl bg-ink p-4 text-ink-foreground shadow-[0_30px_60px_-24px_rgb(0_0_0/0.7)] sm:p-6 lg:-mr-10 lg:mt-32">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="hold-key grid h-11 min-w-11 shrink-0 place-items-center whitespace-nowrap rounded-lg border border-ink-border bg-ink-accent px-2 font-mono text-[0.7rem] font-semibold leading-none text-ink shadow-[0_2px_0_var(--ink-border)]"
              >
                {DEMO.holdKey}
              </span>
              <OverlayPill />
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-ink-muted sm:mt-5">
              <span aria-hidden="true" className="rec-dot h-2 w-2 rounded-full bg-ink-accent" />
              {DEMO.heardLabel}
            </p>
            <p data-demo="raw" className="demo-heard mt-2 font-mono text-[0.85rem] leading-relaxed sm:text-[0.95rem]">
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
              <div className="flex gap-2 border-b border-border px-4 py-2.5 sm:px-5">
                <dt className="text-muted">To:</dt>
                <dd>
                  <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">{DEMO.to}</span>
                </dd>
              </div>
              <div className="hidden gap-2 border-b border-border px-5 py-2.5 sm:flex">
                <dt className="text-muted">Subject:</dt>
                <dd className="font-medium">{DEMO.subject}</dd>
              </div>
            </dl>
            <div className="px-4 pb-5 pt-4 sm:min-h-56 sm:px-7 sm:pt-6 lg:pl-16">
              <p className="flex items-center gap-2 text-xs font-semibold text-muted">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
                {DEMO.typedLabel}
              </p>
              <p className="demo-paste mt-2 text-[1rem] leading-[1.65] sm:text-[1.15rem] sm:leading-[1.7]">
                <span data-demo="cleaned" className="just-pasted">
                  {DEMO.cleaned}
                </span>
                <span
                  aria-hidden="true"
                  className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] rounded-full bg-accent"
                />
              </p>
            </div>
            <p className="flex items-center gap-2 border-t border-border px-4 py-3 text-xs font-semibold text-muted sm:px-7 lg:pl-16">
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="8" cy="8" r="6.25" />
                <path d="M8 4.5V8l2.25 1.5" />
              </svg>
              {SPEED.stamp}
            </p>
          </MacWindow>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-accent-foreground/25 pt-5 text-sm font-semibold sm:mt-14 sm:pt-6">
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
