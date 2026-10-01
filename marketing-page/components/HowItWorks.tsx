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
    <p className="font-display text-xl font-medium tracking-tight">
      ship it Friday.
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
              <span aria-hidden="true" className="font-mono text-xs tracking-[0.16em] text-accent">
                STEP 0{i + 1}
              </span>
              <h3 className="font-display mt-2 text-2xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-3xl border border-border p-6 sm:p-8">
        <table className="w-full text-left text-sm">
          <caption className="font-display mb-4 text-left text-xl font-bold tracking-tight">Keyboard controls</caption>
          <tbody>
            {CONTROLS.map((control) => (
              <tr key={control.action} className="border-t border-border">
                <th scope="row" className="w-40 py-4 pr-6 align-top font-medium sm:w-56">
                  {control.action}
                </th>
                <td className="py-4 font-mono text-[0.8rem] text-muted">{control.keys}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
