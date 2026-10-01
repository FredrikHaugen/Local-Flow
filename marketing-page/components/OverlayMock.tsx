import { DEMO } from "@/lib/site";

// Relative bar heights for the decorative waveform.
const BARS = [0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.9, 0.65, 0.45, 0.8, 0.55, 0.3];

export function OverlayMock() {
  return (
    <figure className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div
        aria-hidden="true"
        className="mx-auto flex h-10 w-48 items-center justify-center gap-1 rounded-full bg-foreground px-4"
      >
        {BARS.map((height, i) => (
          <span
            key={i}
            className="wave-bar w-1 rounded-full bg-background"
            style={{ height: `${height * 70}%`, animationDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
      <dl className="mt-8 space-y-5">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-muted">You say</dt>
          <dd className="mt-1 font-mono text-sm text-muted">{DEMO.raw}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-muted">LocalFlow types</dt>
          <dd className="mt-1 text-lg">{DEMO.cleaned}</dd>
        </div>
      </dl>
      <figcaption className="sr-only">
        Example of on-device cleanup: filler words removed, capitalization and punctuation fixed.
      </figcaption>
    </figure>
  );
}
