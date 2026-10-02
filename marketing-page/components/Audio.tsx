import { Chapter } from "@/components/Chapter";
import { OverlayPill } from "@/components/OverlayPill";
import { AUDIO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The privacy claim as a scene you could screenshot: Wi-Fi switched off in the menu bar, the overlay
// listening, and the message landing anyway.
function OfflineScene() {
  const { scene } = AUDIO;
  return (
    <figure aria-label={scene.label} className="mt-10">
      <div className="desk-scene relative h-[30rem] overflow-hidden rounded-2xl font-sans text-[0.95rem] sm:h-[32rem]">
        <div aria-hidden="true" className="flex h-8 items-center justify-end gap-5 border-b border-border/70 px-4 text-[0.8rem]">
          <span className="grid h-6 w-8 place-items-center rounded bg-foreground/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0" className="opacity-40" />
              <path d="M4 4l16 16" />
            </svg>
          </span>
          <svg viewBox="10 26 90 68" className="h-3.5 w-auto" fill="none">
            <path d="M20 41H43.6522L68.7826 83H88" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="80" cy="41" r="12" className="rec-dot fill-rec" />
          </svg>
          <span className="tabular-nums">Fri 4:12 PM</span>
        </div>

        {/* The Wi-Fi menu, open and switched off. */}
        <div className="window-shadow absolute right-4 top-9 z-10 w-64 rounded-lg bg-card px-4 py-3 sm:right-24">
          <p className="flex items-center justify-between font-semibold">
            {scene.wifi}
            <span aria-hidden="true" className="relative h-5 w-9 rounded-full bg-foreground/20">
              <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-card shadow" />
            </span>
          </p>
          <p className="mt-1 text-sm text-muted">{scene.wifiState}</p>
        </div>

        {/* The app the message lands in. */}
        <div className="window-shadow absolute left-4 right-4 top-20 overflow-hidden rounded-xl bg-card sm:left-10 sm:right-auto sm:w-[34rem] lg:left-16">
          <p className="border-b border-border px-4 py-2 text-center text-[0.8rem] font-semibold text-foreground/80">{scene.app}</p>
          <div className="grid gap-3 px-5 py-5">
            <p className="max-w-[75%] justify-self-start rounded-2xl bg-background px-4 py-2">{scene.incoming}</p>
            <p className="max-w-[80%] justify-self-end rounded-2xl bg-select px-4 py-2 font-serif text-[1.1rem] text-select-foreground">
              {scene.text}
              <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-current" />
            </p>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-10 flex justify-center">
          <div className="origin-bottom scale-125 sm:scale-150">
            <OverlayPill />
          </div>
        </div>
      </div>
      <figcaption className="mt-8 max-w-3xl text-[clamp(2rem,1.3rem+3vw,3.75rem)] leading-[1.08] tracking-[-0.015em]">
        {AUDIO.caption}
      </figcaption>
    </figure>
  );
}

export function Audio() {
  return (
    <Chapter id="privacy" title={AUDIO.title} wide className="pt-20 sm:pt-28">
      <OfflineScene />
      <ol aria-label={AUDIO.pathLabel} className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-[0.95rem] text-muted">
        {AUDIO.stages.map((stage, i) => (
          <li key={stage} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">→</span>}
            {stage}
          </li>
        ))}
      </ol>
      <div className="mt-8 max-w-2xl">
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
