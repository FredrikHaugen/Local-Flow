import { Marked, Marker } from "@/components/Brand";
import { SPEED } from "@/lib/site";

// Deterministic "speech" for the talk bar, so server and client render the same thing.
const TALK = Array.from({ length: 100 }, (_, i) => {
  const h = 0.2 + 0.8 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.17 + 0.9));
  return Math.round(h * 100) / 100;
});

// The talk bars as vertical strokes, each (20 + h·60)% of the pill's height, centred. The round
// caps add a little height, so each stroke is trimmed by 2 units at both ends. Even and odd bars
// are separate paths: phones draw the even half, wider screens both. Relative moves in whole units
// keep the paths short (they ship twice: in the HTML and in the RSC payload).
function talkPath(parity: 0 | 1) {
  let y = 0;
  return TALK.map((h, i) => [h, i] as const)
    .filter(([, i]) => i % 2 === parity)
    .map(([h, i], n) => {
      const half = Math.round((20 + h * 60) / 2 - 2);
      const top = 50 - half;
      const seg = n === 0 ? `M${i} ${top}v${half * 2}` : `m2 ${top - y}v${half * 2}`;
      y = 50 + half;
      return seg;
    })
    .join("");
}

// 16 one-second ticks under the bars: 15 s of talk, then the second after you let go.
const TICKS = Array.from({ length: 17 }, (_, i) => i);

// A full-bleed ink band whose payoff is speed: a giant "1 s" and two bars drawn to scale.
export function Speed() {
  return (
    <section
      id="speed"
      aria-labelledby="speed-title"
      className="surface-ink relative scroll-mt-16 overflow-hidden bg-ink py-16 text-ink-foreground sm:py-28"
    >
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-16">
          <p aria-hidden="true" className="font-display flex items-start leading-[0.78] text-ink-accent">
            <span className="text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold">≈</span>
            <span className="text-[clamp(13rem,52vw,26rem)] font-extrabold tracking-[-0.02em]">{SPEED.numeral}</span>
            <span className="self-end pb-[0.12em] text-[clamp(4.5rem,16vw,9rem)] font-extrabold">
              {SPEED.numeralUnit}
            </span>
          </p>
          <div className="lg:pb-3">
            <Marker label={SPEED.kicker} tone="ink" />
            <h2
              id="speed-title"
              className="font-display mt-6 text-[clamp(3.25rem,13vw,6.25rem)] font-extrabold leading-[0.9] tracking-[-0.01em] text-balance"
            >
              <Marked text={SPEED.title} mark={SPEED.mark} />
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-muted">{SPEED.intro}</p>
          </div>
        </div>

        <figure className="mt-12 sm:mt-20">
          <div className="grid gap-5">
            <div className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-6">
              <p className="flex items-baseline justify-between text-sm font-semibold sm:block">
                <span>{SPEED.talkLabel}</span>
                <span className="font-mono text-xs text-ink-muted sm:mt-1 sm:block">{SPEED.talkValue}</span>
              </p>
              <div
                aria-hidden="true"
                className="flex h-14 w-[calc(100%*15/16)] items-center rounded-full border border-ink-border px-4 sm:px-5"
              >
                {/* Bars spread to fit the pill; the odd half drops out on narrow screens. */}
                <svg viewBox={`0 0 ${TALK.length - 1} 100`} preserveAspectRatio="none" overflow="visible" className="h-full min-w-0 flex-1 text-ink-foreground/70">
                  <g stroke="currentColor" strokeLinecap="round" className="[stroke-width:2] sm:[stroke-width:3]">
                    <path d={talkPath(0)} vectorEffect="non-scaling-stroke" />
                    <path d={talkPath(1)} vectorEffect="non-scaling-stroke" className="hidden md:inline" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-6">
              <p className="flex items-baseline justify-between text-sm font-semibold sm:block">
                <span>{SPEED.transcribeLabel}</span>
                <span className="font-mono text-xs text-ink-accent sm:mt-1 sm:block">{SPEED.transcribeValue}</span>
              </p>
              <div aria-hidden="true" className="relative h-14">
                {/* The dashed wait you don't have, then the key-up mark and the <1 s that follows it. */}
                <span className="absolute left-0 right-[calc(100%/16)] top-1/2 border-t border-dashed border-ink-border" />
                <span className="absolute left-[calc(100%*15/16)] top-0 h-full -translate-x-1/2 border-l-2 border-ink-foreground" />
                <span className="absolute bottom-full left-[calc(100%*15/16)] hidden -translate-x-1/2 whitespace-nowrap pb-1 sm:block font-mono text-[0.65rem] text-ink-foreground">
                  {SPEED.keyUp}
                </span>
                {/* 1/16 of the scale: the >15× real-time ratio, drawn to scale. */}
                <span className="speed-fill absolute left-[calc(100%*15/16)] top-1/2 h-8 w-[calc(100%/16)] min-w-5 -translate-y-1/2 rounded-r-full bg-ink-accent shadow-[0_0_40px_-4px_var(--ink-accent)]" />
              </div>
            </div>
            <div aria-hidden="true" className="sm:grid sm:grid-cols-[9rem_1fr] sm:gap-6">
              <span className="hidden sm:block" />
              <div className="flex justify-between border-t border-ink-border pt-2 font-mono text-[0.65rem] text-ink-muted">
                {TICKS.map((t) => (
                  <span key={t} className={t % 5 === 0 || t === 16 ? "" : "hidden sm:inline"}>
                    {t % 5 === 0 || t === 16 ? `${t}s` : "·"}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="sm:grid sm:grid-cols-[9rem_1fr] sm:gap-6">
            <span className="hidden sm:block" />
            <div>
              {/* A wedge opening from the last 1/16 of the scale to the full width below it. */}
              <span className="block h-10 bg-ink-accent/15 [clip-path:polygon(calc(100%*15/16)_0,100%_0,100%_100%,0_100%)]" />
              <div className="rounded-2xl border border-ink-accent/40 bg-ink-accent/10 p-3 sm:p-4">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-accent">{SPEED.zoomLabel}</p>
                <ol className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold sm:flex sm:text-sm">
                  {SPEED.zoomStages.map((stage, i) => (
                    <li key={stage} className="rounded-full bg-ink px-3 py-2 sm:flex-1">
                      <span className="mr-2 text-ink-accent">0{i + 1}</span>
                      {stage}
                    </li>
                  ))}
                  <li className="col-span-2 rounded-full bg-ink-foreground px-3 py-2 text-ink">
                    <span className="caret mr-2 inline-block h-3.5 w-[2px] translate-y-0.5 bg-ink-accent" />
                    {SPEED.zoomDone}
                  </li>
                </ol>
              </div>
            </div>
          </div>
          <figcaption className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-muted">{SPEED.scaleNote}</figcaption>
        </figure>

      </div>
    </section>
  );
}
