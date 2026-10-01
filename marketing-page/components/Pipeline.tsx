import { Section } from "@/components/Section";
import { KICKERS, PIPELINE } from "@/lib/site";

export function Pipeline() {
  return (
    <Section
      id="under-the-hood"
      tone="ink"
      kicker={KICKERS["under-the-hood"]}
      title="Under the hood"
      intro="Every dictation runs through five on-device stages. If any one of them fails, your words still land somewhere you can see them."
    >
      <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
        {/* The signal line: vertical on phones, horizontal from lg up. */}
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-[19px] top-2 w-px bg-gradient-to-b from-ink-accent via-ink-border to-ink-border lg:inset-x-5 lg:bottom-auto lg:left-5 lg:top-[19px] lg:h-px lg:w-auto lg:bg-gradient-to-r"
        />
        {PIPELINE.map((stage, i) => (
          <li key={stage.name} className="relative grid grid-cols-[40px_1fr] gap-5 lg:block">
            <span
              aria-hidden="true"
              className={`relative grid h-10 w-10 place-items-center rounded-full border font-mono text-sm ${
                i === 0
                  ? "border-ink-accent bg-ink-accent text-ink"
                  : "border-ink-border bg-ink text-ink-foreground"
              }`}
            >
              {i + 1}
            </span>
            <div className="lg:mt-6">
              <h3 className="font-display text-2xl font-bold tracking-tight">{stage.name}</h3>
              <p className="mt-2 inline-block rounded-md border border-ink-border px-2 py-0.5 font-mono text-[0.7rem] text-ink-accent">
                {stage.tag}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{stage.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
