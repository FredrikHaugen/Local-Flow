import { Chapter } from "@/components/Chapter";
import { AUDIO } from "@/lib/content";
import { SITE } from "@/lib/site";

// One line icon per stage, drawn on a 24-unit grid, in the order of AUDIO.stages.
const STAGE_ICONS = [
  <path key="mic" d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3ZM5 11a7 7 0 0 0 14 0M12 18v3" />,
  <path key="trim" d="M4 12h3m10 0h3M9 7v10m6-10v10M9 12h6" />,
  <path key="chip" d="M7 7h10v10H7zM10 3v4m4-4v4m-4 10v4m4-4v4M3 10h4m-4 4h4m10-4h4m-4 4h4" />,
  <path key="clean" d="M4 7h11M4 12h16M4 17h8m6-2 3 3m0-3-3 3" />,
  <path key="paste" d="M9 4h6v3H9zM7 6H5v15h14V6h-2m-8 7h6m-6 4h4" />,
];

// The privacy argument, drawn at size: every stage inside the line around "Your Mac", the network
// struck through beside it, and the one thing that ever crosses the line hanging below.
function AudioPath() {
  return (
    <figure aria-label={AUDIO.pathLabel} className="mt-12 font-sans">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_11rem] lg:items-stretch">
        <div className="rounded-2xl border-2 border-foreground bg-background/60 px-5 pb-8 pt-5 sm:px-8">
          <p className="text-sm font-semibold">{AUDIO.boundary}</p>
          <ol className="audio-path mt-6 grid gap-y-6 sm:grid-cols-5 sm:gap-x-10">
            {AUDIO.stages.map((stage, i) => (
              <li key={stage.name} className="relative">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {STAGE_ICONS[i]}
                </svg>
                <strong className="mt-3 block text-[1.15rem] leading-snug">{stage.name}</strong>
                <span className="mt-0.5 block text-[0.95rem] text-muted">{stage.detail}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border-2 border-foreground/25 px-5 py-5 lg:flex-col lg:justify-center lg:text-center">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-10 w-10 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0" />
            <circle cx="12" cy="19.5" r="0.9" fill="currentColor" />
            <path d="M3 3l18 18" className="text-foreground" stroke="currentColor" strokeWidth="2" />
          </svg>
          <p>
            <strong className="block">{AUDIO.network}</strong>
            <span className="text-[0.95rem] text-muted">{AUDIO.networkState}</span>
          </p>
        </div>
      </div>
      <div className="ml-10">
        <span aria-hidden="true" className="block h-8 w-0.5 bg-foreground/50" />
        <p className="inline-block rounded-lg border-2 border-foreground/25 px-4 py-2.5 text-[0.95rem]">
          <strong>{AUDIO.outside}</strong> <span className="text-muted">{AUDIO.outsideDetail}</span>
        </p>
      </div>
    </figure>
  );
}

export function Audio() {
  return (
    <Chapter id="privacy" title={AUDIO.title} wide className="desk mt-24 py-16 sm:mt-32 sm:py-24">
      <p className="mt-6 max-w-3xl text-[clamp(1.9rem,1.3rem+2.4vw,3.2rem)] leading-[1.15] tracking-[-0.015em]">{AUDIO.display}</p>
      <AudioPath />
      <div className="mt-10 max-w-2xl">
        {AUDIO.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className="mt-4 font-sans text-[0.95rem] text-muted">
          {AUDIO.storageBefore} <code className="rounded bg-card px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">{AUDIO.storagePath}</code>{" "}
          {AUDIO.storageAfter} {AUDIO.sourceBefore}{" "}
          <a href={SITE.repoUrl} className="text-foreground underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
            {AUDIO.sourceLink}
          </a>
          {AUDIO.sourceAfter}
        </p>
      </div>
    </Chapter>
  );
}
