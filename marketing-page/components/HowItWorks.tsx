import { Kbd } from "@/components/Kbd";
import { Section } from "@/components/Section";
import { CONTROLS, KICKERS, STEPS } from "@/lib/site";

// Decorative vignettes, one per step: the key, the voice, the text landing.
function StepVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="flex items-end gap-2">
        {["⌘", "⌥"].map((key, i) => (
          <span
            key={key}
            className={`keycap grid h-14 w-14 place-items-center rounded-xl border font-mono text-xl ${
              i === 1 ? "border-accent bg-accent text-accent-foreground shadow-[0_10px_24px_-10px_var(--accent)]" : "border-border bg-card text-muted"
            }`}
          >
            {key}
          </span>
        ))}
        <span className="keycap grid h-14 w-24 place-items-center rounded-xl border border-border bg-card font-mono text-xs text-muted">
          ⏎
        </span>
      </div>
    );
  }
  if (index === 1) {
    const bars = [0.3, 0.55, 0.9, 0.5, 1, 0.65, 0.4, 0.8, 0.45, 0.7, 0.35, 0.6, 0.25];
    return (
      <div className="flex h-14 items-center gap-1">
        {bars.map((h, i) => (
          <span
            key={i}
            className="wave-bar w-1.5 rounded-full bg-foreground"
            style={{ height: `${h * 100}%`, animationDelay: `${i * 70}ms` }}
          />
        ))}
      </div>
    );
  }
  return (
    <p className="font-display text-xl font-bold tracking-tight">
      if nothing breaks.
      <span className="caret ml-0.5 inline-block h-[1.1em] w-[3px] translate-y-[0.2em] rounded-full bg-accent" />
    </p>
  );
}

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      kicker={KICKERS["how-it-works"]}
      title="How it works"
      intro="No app to switch to, no window to click. It works wherever your cursor is."
    >
      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col rounded-3xl border border-border bg-card p-3">
            <div
              aria-hidden="true"
              className="dot-grid-light grid h-36 place-items-center rounded-2xl border border-border bg-background"
            >
              <StepVisual index={i} />
            </div>
            <div className="px-4 pb-4 pt-6">
              <span aria-hidden="true" className="font-display text-sm font-bold text-accent">
                0{i + 1}
              </span>
              <h3 className="font-display mt-2 text-2xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 grid gap-4 rounded-3xl border border-border bg-card p-5 sm:p-6 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
        <h3 id="controls-title" className="font-display text-xl font-bold tracking-tight">
          Keyboard controls
        </h3>
        <dl className="grid gap-2 sm:grid-cols-3">
          {CONTROLS.map((control) => (
            <div key={control.action} data-control className="flex flex-col items-start gap-2 rounded-2xl bg-background px-4 py-3">
              <dt className="text-xs font-semibold text-muted">{control.action}</dt>
              <dd>
                <Kbd className="text-[0.75rem]">{control.keys}</Kbd>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
