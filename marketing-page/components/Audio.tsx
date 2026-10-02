import { Chapter } from "@/components/Chapter";
import { OverlayPill } from "@/components/OverlayPill";
import { AUDIO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The privacy claim as one picture, on the page's only dark band: Wi-Fi switched off, and a message
// landing anyway while the overlay listens.
function OfflineScene() {
  const { scene } = AUDIO;
  return (
    <figure aria-label={scene.label} className="mt-14 text-left font-sans">
      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-8">
        {/* The Wi-Fi menu as macOS draws it: the switch off, the known networks greyed out under it. */}
        <div className="rounded-[1.25rem] bg-card p-5 sm:p-6">
          <p className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0" className="opacity-40" />
                <circle cx="12" cy="19.5" r="1" fill="currentColor" className="opacity-40" />
                <path d="M4 4l16 16" strokeWidth="2.2" />
              </svg>
              <span>
                <span className="block text-[1.5rem] font-semibold leading-tight">{scene.wifi}</span>
                <span className="text-muted">{scene.wifiState}</span>
              </span>
            </span>
            <span aria-hidden="true" className="relative h-7 w-12 shrink-0 rounded-full bg-foreground/20">
              <span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-foreground/80" />
            </span>
          </p>
          <p className="mt-5 border-t border-border pt-4 text-sm font-semibold text-muted">{scene.knownTitle}</p>
          <ul aria-label={scene.knownTitle} className="mt-2 space-y-2 opacity-45">
            {scene.known.map((n) => (
              <li key={n} className="flex items-center justify-between">
                {n}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0" />
                </svg>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-2xl bg-card px-6 pb-24 pt-6 sm:px-10">
          <p className="text-center text-[0.8rem] font-semibold text-muted">{scene.app}</p>
          <div className="mt-5 grid gap-3">
            <p className="max-w-[75%] justify-self-start rounded-2xl bg-background px-4 py-2">{scene.incoming}</p>
            <p className="max-w-[85%] justify-self-end rounded-2xl bg-select px-5 py-3 font-serif text-[clamp(1.15rem,1rem+0.8vw,1.6rem)] leading-snug text-select-foreground">
              {scene.text}
              <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-current" />
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-4 flex justify-center">
            <OverlayPill />
          </div>
        </div>
      </div>
    </figure>
  );
}

// The dark band: the claim at display size, then the scene that shows it.
export function Audio() {
  return (
    <Chapter id="privacy" title={AUDIO.title} wide hiddenTitle className="band-dark mt-24 pb-24 pt-20 sm:mt-32 sm:pb-32 sm:pt-28">
      <p className="max-w-4xl text-balance text-[clamp(2.4rem,1.5rem+3.8vw,4.75rem)] leading-[1.04] tracking-[-0.02em]">{AUDIO.display}</p>
      <OfflineScene />
      <p className="mt-12 max-w-2xl">
        {AUDIO.paragraphs[0]} {AUDIO.sourceBefore}{" "}
        <a href={SITE.repoUrl} className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
          {AUDIO.sourceLink}
        </a>
        {AUDIO.sourceAfter}
      </p>
    </Chapter>
  );
}
