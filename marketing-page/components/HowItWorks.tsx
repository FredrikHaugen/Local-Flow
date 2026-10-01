import { Marked, Marker } from "@/components/Brand";
import { Kbd } from "@/components/Kbd";
import { CONTROLS, HOW, KICKERS, STEPS } from "@/lib/site";

// Deterministic "speech" for the live waveform, so server and client render the same thing.
const VOICE = Array.from({ length: 34 }, (_, i) => {
  const h = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.63) * Math.cos(i * 0.21 + 0.4));
  return Math.round(h * 100) / 100;
});

// One giant keycap: the only key you need.
function KeyVisual() {
  return (
    <div className="key-press relative grid h-36 w-36 place-items-center rounded-[1.75rem] bg-accent text-accent-foreground sm:h-44 sm:w-44 sm:rounded-[2.25rem]">
      <span className="font-display text-8xl font-extrabold leading-none sm:text-9xl">⌥</span>
      <span className="absolute bottom-3.5 left-4 text-xs font-semibold opacity-80 sm:bottom-5 sm:left-5 sm:text-sm">
        {HOW.keyLegend}
      </span>
      <span className="absolute right-4 top-3.5 text-xs font-semibold opacity-80 sm:right-5 sm:top-5 sm:text-sm">
        {HOW.keySide}
      </span>
    </div>
  );
}

// The overlay LocalFlow shows while it listens, at storyboard scale.
function VoiceVisual() {
  return (
    <div className="surface-ink flex h-20 w-full max-w-xs items-center gap-4 rounded-full bg-ink px-6 text-ink-foreground shadow-[0_24px_48px_-24px_var(--ink)] sm:h-24">
      <span className="rec-dot h-2.5 w-2.5 shrink-0 rounded-full bg-ink-accent" />
      <span className="flex h-10 min-w-0 flex-1 items-center justify-between sm:h-12">
        {VOICE.map((h, i) => (
          <span
            key={i}
            className="wave-bar w-[2px] shrink-0 rounded-full bg-ink-foreground sm:w-[3px]"
            style={{ height: `${h * 100}%`, animationDelay: `${(i % 9) * 90}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

// The text, landed where the cursor was.
function TextVisual() {
  return (
    <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-5 text-left shadow-[0_24px_48px_-28px_var(--foreground)]">
      <span className="block h-2 w-2/3 rounded-full bg-border" />
      <span className="mt-2.5 block h-2 w-5/6 rounded-full bg-border" />
      <p className="font-display mt-4 text-xl font-extrabold leading-snug">
        <span className="just-pasted">{HOW.pasted}</span>
        <span className="caret ml-0.5 inline-block h-[1.1em] w-[3px] translate-y-[0.2em] rounded-full bg-accent" />
      </p>
    </div>
  );
}

const VISUALS = [KeyVisual, VoiceVisual, TextVisual];

// Not a row of cards: one storyboard. A rail runs through the key, the voice and the text,
// with the moment of each move stamped above it.
export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="scroll-mt-16 overflow-hidden pt-24 sm:pt-32">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <Marker label={KICKERS["how-it-works"]} />
        <h2
          id="how-it-works-title"
          className="font-display mx-auto mt-6 text-[clamp(4rem,19vw,10rem)] font-extrabold leading-[0.88] tracking-[-0.01em]"
        >
          <Marked text={HOW.title} mark={HOW.mark} />
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">{HOW.intro}</p>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl px-4 sm:mt-20 sm:px-6">
        {/* The rail: one continuous line through all three moves (desktop). */}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-[150px] hidden border-t-2 border-dashed border-accent/50 lg:block"
        />
        <ol className="relative grid gap-14 lg:grid-cols-3 lg:gap-8">
          {STEPS.map((step, i) => {
            const Visual = VISUALS[i];
            return (
              <li key={step.title} className="flex flex-col items-center text-center">
                <p
                  aria-hidden="true"
                  className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[0.7rem] text-muted"
                >
                  {HOW.moments[i]}
                </p>
                <div aria-hidden="true" className="mt-5 flex h-48 w-full items-center justify-center sm:h-52">
                  <Visual />
                </div>
                <div className="mt-8 max-w-xs">
                  <span aria-hidden="true" className="font-display text-base font-extrabold text-accent">
                    0{i + 1}
                  </span>
                  <h3 className="font-display mt-1 text-4xl font-extrabold sm:text-5xl">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mx-auto mt-20 max-w-5xl px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="flex flex-col gap-4 border-t border-border pt-6 lg:flex-row lg:items-center lg:gap-10">
          <h3 id="controls-title" className="shrink-0 text-sm font-semibold text-muted">
            Keyboard controls
          </h3>
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            {CONTROLS.map((control) => (
              <div key={control.action} data-control className="flex items-center gap-3">
                <dt className="text-sm font-semibold">{control.action}</dt>
                <dd>
                  <Kbd className="text-[0.75rem]">{control.keys}</Kbd>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
