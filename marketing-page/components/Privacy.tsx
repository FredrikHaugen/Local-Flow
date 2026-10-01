import { Section } from "@/components/Section";
import { KICKERS, PIPELINE, PRIVACY, PRIVACY_DIAGRAM, PRIVACY_POINTS, UNDER_THE_HOOD } from "@/lib/site";

const ICONS = [
  // No cloud
  "M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 9.5 4.25 4.25 0 0 0 7 18ZM4 4l16 16",
  // No telemetry
  "M3 12h4l3-7 4 14 3-7h4M4 4l16 16",
  // One kind of network request
  "M12 4v11M7 10l5 5 5-5M5 20h14",
  // Password fields
  "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5zM12 15v2",
];

// One diagram for both stories: the five pipeline stages, all inside the "Your Mac" line,
// and the single thing outside it.
function BoundaryDiagram() {
  return (
    <figure id="under-the-hood" aria-labelledby="under-the-hood-title" className="scroll-mt-20">
      <div className="relative rounded-[2rem] border-2 border-dashed border-accent bg-card p-4 pt-9 sm:p-8 sm:pt-11">
        <span className="absolute -top-3.5 left-6 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-accent-foreground">
          {PRIVACY_DIAGRAM.boundary}
        </span>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
          <h3 id="under-the-hood-title" className="font-display text-3xl font-extrabold">
            {UNDER_THE_HOOD.title}
          </h3>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-muted sm:text-right">{UNDER_THE_HOOD.intro}</p>
        </div>
        <ol className="mt-6 grid gap-2 lg:grid-cols-5">
          {PIPELINE.map((stage, i) => (
            <li key={stage.name} title={stage.body} className="flex">
              <div className="flex flex-1 items-center gap-3 rounded-2xl bg-ink px-4 py-3.5 text-ink-foreground lg:flex-col lg:items-start lg:gap-6 lg:py-5">
                <span
                  aria-hidden="true"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink-accent text-xs font-bold text-ink"
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="font-display text-xl font-extrabold leading-tight">{stage.name}</h4>
                  <p className="mt-1 text-[0.8rem] leading-snug text-ink-muted">{stage.tag}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col items-center">
        <span aria-hidden="true" className="h-10 border-l-2 border-dotted border-muted/60" />
        <p className="rounded-2xl border border-border bg-card px-4 py-2 text-center text-sm">
          <span className="font-semibold">{PRIVACY_DIAGRAM.outside}</span>
          <span className="text-muted"> · {PRIVACY_DIAGRAM.outsideNote}</span>
        </p>
      </div>
      <figcaption className="sr-only">
        Capture, trim, transcription, cleanup and pasting all run inside your Mac. The only outside connection is to
        Hugging Face, for model downloads you request.
      </figcaption>
    </figure>
  );
}

export function Privacy() {
  return (
    <Section
      id="privacy"
      kicker={KICKERS.privacy}
      title={PRIVACY.title}
      mark={PRIVACY.mark}
      intro={PRIVACY.intro}
    >
      <ul className="grid gap-x-12 sm:grid-cols-2 [&>li:last-child]:pb-0 sm:[&>li:nth-last-child(-n+2)]:pb-0">
        {PRIVACY_POINTS.map((point, i) => (
          <li key={point.title} className="flex gap-5 border-t border-border py-7">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mt-0.5 h-6 w-6 shrink-0 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={ICONS[i]} />
            </svg>
            <div>
              <h3 className="font-display text-2xl font-extrabold">{point.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{point.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-16">
        <BoundaryDiagram />
      </div>
    </Section>
  );
}
