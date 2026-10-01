import { PIPELINE, UNDER_THE_HOOD } from "@/lib/site";

// The five on-device stages as a compact strip, nested under the privacy diagram.
export function Pipeline() {
  return (
    <section id="under-the-hood" aria-labelledby="under-the-hood-title" className="scroll-mt-20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
        <h3 id="under-the-hood-title" className="font-display text-2xl font-bold tracking-tight">
          {UNDER_THE_HOOD.title}
        </h3>
        <p className="max-w-md text-muted sm:text-right">{UNDER_THE_HOOD.intro}</p>
      </div>
      <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {PIPELINE.map((stage, i) => (
          <li
            key={stage.name}
            title={stage.body}
            className="group relative flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3.5"
          >
            <span
              aria-hidden="true"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground"
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <h4 className="font-semibold leading-tight">{stage.name}</h4>
              <p className="mt-0.5 font-mono text-[0.7rem] leading-snug text-muted">{stage.tag}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
