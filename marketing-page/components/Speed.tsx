import { Glyph } from "@/components/MacWindow";
import { SPEED } from "@/lib/site";

// Deterministic "speech" for the talk bar, so server and client render the same thing.
const TALK = Array.from({ length: 160 }, (_, i) => {
  const h = 0.2 + 0.8 * Math.abs(Math.sin(i * 0.41) * Math.cos(i * 0.13 + 0.9));
  return Math.round(h * 100) / 100;
});

// 15 one-second ticks under the bars: the scale both bars are drawn against.
const TICKS = Array.from({ length: 16 }, (_, i) => i);

// A full-bleed ink band whose payoff is speed: a giant "1 s" and two bars drawn to scale.
export function Speed() {
  return (
    <section
      id="speed"
      aria-labelledby="speed-title"
      className="surface-ink relative scroll-mt-16 overflow-hidden bg-ink py-20 text-ink-foreground sm:py-28"
    >
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-16">
          <p aria-hidden="true" className="font-display flex items-start leading-[0.78] text-ink-accent">
            <span className="text-[clamp(1.75rem,5vw,3.5rem)] font-bold tracking-tight">≈</span>
            <span className="text-[clamp(10rem,38vw,20rem)] font-bold tracking-[-0.08em]">{SPEED.numeral}</span>
            <span className="self-end pb-[0.12em] text-[clamp(3.5rem,12vw,7rem)] font-bold tracking-tight">
              {SPEED.numeralUnit}
            </span>
          </p>
          <div className="lg:pb-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-accent">
              <Glyph />
              {SPEED.kicker}
            </p>
            <h2
              id="speed-title"
              className="font-display mt-4 text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-balance sm:text-6xl"
            >
              {SPEED.title}
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-muted">{SPEED.intro}</p>
          </div>
        </div>

        <figure className="mt-16 sm:mt-20">
          <div className="grid gap-5">
            <div className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-6">
              <p className="flex items-baseline justify-between text-sm font-semibold sm:block">
                <span>{SPEED.talkLabel}</span>
                <span className="font-mono text-xs text-ink-muted sm:mt-1 sm:block">{SPEED.talkValue}</span>
              </p>
              <div
                aria-hidden="true"
                className="flex h-14 items-center gap-[3px] overflow-hidden rounded-full border border-ink-border px-5"
              >
                {TALK.map((h, i) => (
                  <span
                    key={i}
                    className={`w-[3px] shrink-0 rounded-full bg-ink-foreground/70 `}
                    style={{ height: `${20 + h * 60}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-6">
              <p className="flex items-baseline justify-between text-sm font-semibold sm:block">
                <span>{SPEED.transcribeLabel}</span>
                <span className="font-mono text-xs text-ink-accent sm:mt-1 sm:block">{SPEED.transcribeValue}</span>
              </p>
              <div aria-hidden="true" className="relative flex h-14 items-center">
                {/* 1/15 of the talk bar: the >15× real-time ratio, drawn to scale. */}
                <span className="h-8 w-[calc(100%/15)] min-w-6 rounded-full bg-ink-accent shadow-[0_0_40px_-4px_var(--ink-accent)]" />
              </div>
            </div>
            <div aria-hidden="true" className="sm:grid sm:grid-cols-[9rem_1fr] sm:gap-6">
              <span className="hidden sm:block" />
              <div className="flex justify-between border-t border-ink-border pt-2 font-mono text-[0.65rem] text-ink-muted">
                {TICKS.map((t) => (
                  <span key={t} className={t % 5 === 0 ? "" : "hidden sm:inline"}>
                    {t % 5 === 0 ? `${t}s` : "·"}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <figcaption className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-muted">{SPEED.scaleNote}</figcaption>
        </figure>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-border bg-ink-border sm:grid-cols-3">
          {SPEED.facts.map((fact) => (
            <li key={fact.label} className="bg-ink px-6 py-5">
              <p className="font-display text-3xl font-bold tracking-tight">{fact.value}</p>
              <p className="mt-1 text-sm text-ink-muted">{fact.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
