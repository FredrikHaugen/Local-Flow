import { DEMO } from "@/lib/site";

// Relative bar heights for the decorative waveform.
const BARS = [0.35, 0.6, 1, 0.55, 0.85, 0.45, 0.95, 0.65, 0.4, 0.8, 0.5, 0.3, 0.7, 0.45];

const fillers = new Set<string>(DEMO.fillers);

export function OverlayMock() {
  const words = DEMO.raw.split(" ");
  return (
    <figure className="surface-ink relative overflow-hidden rounded-[1.75rem] bg-ink p-5 text-ink-foreground sm:rounded-[2.25rem] sm:p-10 lg:p-14">
      <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-70" />
      <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto_1.2fr] lg:gap-8">
        <div>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
            <span aria-hidden="true" className="rec-dot h-2 w-2 rounded-full bg-ink-accent" />
            {DEMO.sayLabel}
          </p>
          <p data-demo="raw" className="mt-4 font-mono text-lg leading-relaxed sm:text-xl">
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

        <svg
          aria-hidden="true"
          viewBox="0 0 48 24"
          className="h-6 w-12 rotate-90 justify-self-start text-ink-accent lg:rotate-0 lg:justify-self-center"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 12h42M34 3l10 9-10 9" />
        </svg>

        <div className="relative rounded-2xl bg-card text-foreground shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)]">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-border" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-border" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="ml-auto font-mono text-xs text-muted">{DEMO.app}</span>
          </div>
          <div className="p-5 sm:p-7">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">{DEMO.typesLabel}</p>
            <p className="font-display mt-3 text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
              <span data-demo="cleaned">{DEMO.cleaned}</span>
              <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[3px] translate-y-[0.18em] rounded-full bg-accent" />
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-10 flex flex-col items-center gap-3 sm:mt-14">
        <div
          aria-hidden="true"
          className="flex h-12 w-60 items-center justify-center gap-[5px] rounded-full bg-ink-foreground px-5 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.7)]"
        >
          <span className="rec-dot mr-2 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
          {BARS.map((height, i) => (
            <span
              key={i}
              className="wave-bar w-[3px] rounded-full bg-ink"
              style={{ height: `${height * 62}%`, animationDelay: `${i * 85}ms` }}
            />
          ))}
        </div>
        <p className="font-mono text-xs text-ink-muted">{DEMO.overlayCaption}</p>
      </div>
      <figcaption className="sr-only">
        Example of on-device cleanup: filler words removed, capitalization and punctuation fixed.
      </figcaption>
    </figure>
  );
}
