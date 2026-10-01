import { Pipeline } from "@/components/Pipeline";
import { Section } from "@/components/Section";
import { KICKERS, PRIVACY_DIAGRAM, PRIVACY_POINTS } from "@/lib/site";

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

function BoundaryDiagram() {
  return (
    <figure className="rounded-3xl border border-border bg-card p-4 sm:p-6">
      <div className="relative rounded-2xl border-2 border-dashed border-accent/60 p-5 pt-8 sm:p-8 sm:pt-10">
        <span className="absolute -top-3 left-5 bg-card px-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
          {PRIVACY_DIAGRAM.boundary}
        </span>
        <ol className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-0">
          {PRIVACY_DIAGRAM.inside.map((node, i) => (
            <li key={node} className="flex flex-col items-center sm:flex-1 sm:flex-row">
              <span className="w-full rounded-xl border border-border bg-background px-3 py-3 text-center font-mono text-xs sm:text-[0.78rem]">
                {node}
              </span>
              {i < PRIVACY_DIAGRAM.inside.length - 1 && (
                <span aria-hidden="true" className="h-3 w-px bg-muted/50 sm:h-px sm:w-6 sm:shrink-0" />
              )}
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col items-center">
        <span aria-hidden="true" className="h-8 border-l-2 border-dotted border-muted/60" />
        <p className="rounded-full border border-border px-4 py-2 text-center font-mono text-xs">
          {PRIVACY_DIAGRAM.outside}
          <span className="text-muted"> · {PRIVACY_DIAGRAM.outsideNote}</span>
        </p>
      </div>
      <figcaption className="sr-only">
        Microphone, whisper.cpp, the local LLM and your app all run inside your Mac. The only outside connection is to
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
      title="Private by construction"
      intro="Not a privacy setting — the architecture. There's no server for your voice to go to."
    >
      <BoundaryDiagram />
      <ul className="mt-12 grid gap-x-12 sm:grid-cols-2 [&>li:nth-last-child(-n+2)]:pb-0">
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
              <h3 className="font-display text-xl font-bold tracking-tight">{point.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{point.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 border-t border-border pt-12">
        <Pipeline />
      </div>
    </Section>
  );
}
