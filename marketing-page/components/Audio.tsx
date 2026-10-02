import { Chapter } from "@/components/Chapter";
import { OverlayPill } from "@/components/OverlayPill";
import { AUDIO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The privacy claim as one picture, on the page's only dark band: Wi-Fi switched off, and a message
// landing anyway while the overlay listens.
function OfflineScene() {
  const { scene } = AUDIO;
  return (
    <figure aria-label={scene.label} className="mt-12 font-sans">
      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10">
        <div className="flex items-center gap-6 rounded-2xl bg-card px-7 py-7 lg:flex-col lg:items-start">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-14 w-14 shrink-0 sm:h-20 sm:w-20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0" className="opacity-35" />
            <circle cx="12" cy="19.5" r="0.9" fill="currentColor" className="opacity-35" />
            <path d="M3.5 3.5l17 17" strokeWidth="2" />
          </svg>
          <div className="flex flex-1 items-center justify-between gap-6 lg:w-full">
            <p>
              <span className="block text-[1.75rem] font-semibold leading-tight">{scene.wifi}</span>
              <span className="text-lg text-muted">{scene.wifiState}</span>
            </p>
            <span aria-hidden="true" className="relative h-8 w-14 shrink-0 rounded-full bg-foreground/20">
              <span className="absolute left-1 top-1 h-6 w-6 rounded-full bg-foreground/80" />
            </span>
          </div>
        </div>

        <div className="relative rounded-2xl bg-card px-6 pb-16 pt-5 sm:px-8">
          <p className="text-center text-[0.8rem] font-semibold text-muted">{scene.app}</p>
          <div className="mt-5 grid gap-3">
            <p className="max-w-[75%] justify-self-start rounded-2xl bg-background px-4 py-2">{scene.incoming}</p>
            <p className="max-w-[85%] justify-self-end rounded-2xl bg-select px-5 py-3 font-serif text-[clamp(1.15rem,1rem+0.8vw,1.6rem)] leading-snug text-select-foreground">
              {scene.text}
              <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-current" />
            </p>
          </div>
          <div className="absolute inset-x-0 -bottom-5 flex justify-center">
            <OverlayPill />
          </div>
        </div>
      </div>
    </figure>
  );
}

export function Audio() {
  return (
    <Chapter id="privacy" title={AUDIO.title} wide display className="band-dark mt-24 py-20 sm:mt-32 sm:py-28">
      <OfflineScene />
      <div className="mt-14 max-w-2xl">
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
