import { Section } from "@/components/Section";
import { SwipeHint } from "@/components/SwipeHint";
import { KICKERS, PIPELINE, PRIVACY, PRIVACY_DIAGRAM, PRIVACY_POINTS, SITE, UNDER_THE_HOOD, VERIFY } from "@/lib/site";

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
      <div className="relative rounded-[2rem] border-2 border-dashed border-accent-ink bg-card p-4 pt-9 sm:p-8 sm:pt-11">
        <span className="absolute -top-3.5 left-6 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-accent-foreground">
          {PRIVACY_DIAGRAM.boundary}
        </span>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
          <h3 id="under-the-hood-title" className="font-display text-3xl font-extrabold">
            {UNDER_THE_HOOD.title}
          </h3>
          <p className="mb-5 max-w-md text-[0.95rem] leading-relaxed text-muted sm:mb-0 sm:text-right">{UNDER_THE_HOOD.intro}</p>
        </div>
        <SwipeHint count={PIPELINE.length} />
        {/* Phones swipe through the stages; tablets stack them; desktops line all five up. */}
        <ol
          tabIndex={0}
          aria-label={UNDER_THE_HOOD.railLabel}
          className="no-scrollbar -mx-4 -my-1 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:mt-6 sm:my-0 sm:grid sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-5"
        >
          {PIPELINE.map((stage, i) => (
            <li key={stage.name} className="flex w-[44%] shrink-0 snap-start sm:w-auto">
              <div className="flex flex-1 flex-col items-start gap-5 rounded-2xl bg-ink px-4 py-4 text-ink-foreground sm:flex-row sm:items-center sm:gap-3 sm:py-3.5 lg:flex-col lg:items-start lg:gap-6 lg:py-5">
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


const [OFFLINE, SOURCE, DOWNLOAD] = VERIFY.checks;
const LISTEN_BARS = [0.35, 0.7, 1, 0.55, 0.85, 0.4, 0.65, 0.3];

// Each check gets a small drawn proof on an ink panel: the thing you'd actually see.
function OfflineProof() {
  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="flex items-center justify-between rounded-xl border border-ink-border px-3.5 py-2.5 text-sm">
        <span className="flex items-center gap-2.5">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-ink-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0" />
            <circle cx="12" cy="19" r="1" fill="currentColor" />
            <path d="M4 3l16 18" className="text-ink-accent" stroke="currentColor" />
          </svg>
          <span className="font-semibold">{OFFLINE.wifi}</span>
        </span>
        <span className="flex items-center gap-2 text-ink-muted">
          {OFFLINE.wifiState}
          <span aria-hidden="true" className="relative h-5 w-9 rounded-full bg-ink-border">
            <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-ink-muted" />
          </span>
        </span>
      </div>
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-3 rounded-full bg-ink-foreground py-2 pl-2 pr-4 text-sm font-semibold text-ink">
          <span aria-hidden="true" className="font-display grid h-7 w-7 place-items-center rounded-full bg-ink-accent text-base">⌥</span>
          <span aria-hidden="true" className="flex h-4 items-center gap-[3px]">
            {LISTEN_BARS.map((h, i) => (
              <span key={i} className="w-[3px] rounded-full bg-current" style={{ height: `${Math.round(h * 100)}%` }} />
            ))}
          </span>
          {OFFLINE.overlay}
        </span>
      </div>
    </div>
  );
}

function SourceProof() {
  return (
    <div className="font-mono text-xs leading-relaxed">
      <p className="text-ink-muted">Sources/PeluniApp/</p>
      <ul className="mt-1.5">
        {SOURCE.files.map((file) => (
          <li key={file} className="flex items-center gap-2 border-l border-ink-border pl-3">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ink-accent" />
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DownloadProof() {
  return (
    <div className="flex h-full flex-col justify-between gap-5 font-mono text-xs leading-relaxed">
      <p className="break-all">
        <span aria-hidden="true" className="text-ink-muted">$ </span>
        {DOWNLOAD.command}
      </p>
      <p className="font-semibold text-ink-accent">{DOWNLOAD.result}</p>
      <p className="flex flex-wrap gap-2 font-sans text-xs">
        {["Developer ID", "Notarized"].map((badge) => (
          <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-ink-border px-2.5 py-1">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3 text-ink-accent" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8.5l3 3 7-7" />
            </svg>
            {badge}
          </span>
        ))}
      </p>
    </div>
  );
}

const PROOFS = { offline: OfflineProof, source: SourceProof, download: DownloadProof } as const;

function Verify() {
  return (
    <div id="verify" className="scroll-mt-20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <h3 className="font-display text-[2.75rem] font-extrabold leading-[0.95] sm:text-5xl">{VERIFY.title}</h3>
        <p className="max-w-sm leading-relaxed text-muted">{VERIFY.intro}</p>
      </div>
      <div className="mt-8">
        <SwipeHint count={VERIFY.checks.length} />
      </div>
      <ol
        tabIndex={0}
        aria-label={VERIFY.railLabel}
        className="no-scrollbar -mx-4 -my-2 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 py-2 sm:mx-0 sm:my-0 sm:grid sm:gap-4 sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-3"
      >
        {VERIFY.checks.map((check, i) => {
          const Proof = PROOFS[check.id];
          return (
            <li key={check.id} className="flex w-[84%] shrink-0 snap-start flex-col rounded-3xl border border-border bg-card p-2.5 sm:w-auto">
              <div className="surface-ink h-44 rounded-2xl bg-ink p-5 text-ink-foreground">
                <Proof />
              </div>
              <div className="flex flex-1 flex-col px-3.5 pb-3 pt-5">
                <p className="font-mono text-xs text-muted">Check {i + 1}</p>
                <h4 className="font-display mt-1 text-3xl font-extrabold leading-tight">{check.title}</h4>
                <p className="mt-2 leading-relaxed text-muted">{check.body}</p>
                {"link" in check && (
                  <a
                    href={SITE.repoUrl}
                    className="mt-4 inline-flex items-center gap-1.5 self-start font-semibold underline decoration-accent-ink decoration-2 underline-offset-4"
                  >
                    {check.link}
                    <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
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
          <li key={point.title} className="flex gap-4 border-t border-border py-5 sm:gap-5 sm:py-7">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mt-0.5 h-6 w-6 shrink-0 text-accent-ink"
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
      <div className="mt-12 sm:mt-16">
        <BoundaryDiagram />
      </div>
      <div className="mt-16 sm:mt-24">
        <Verify />
      </div>
    </Section>
  );
}
