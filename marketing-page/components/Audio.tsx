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
        {/* A Control Center module: the Wi-Fi button greyed out, the label beside it. */}
        <div className="flex items-center gap-5 rounded-[1.75rem] bg-card p-5 lg:flex-col lg:items-start lg:justify-between lg:p-8">
          <span aria-hidden="true" className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-foreground/15 sm:h-24 sm:w-24">
            <svg viewBox="0 0 24 24" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0" className="opacity-40" />
              <circle cx="12" cy="19.5" r="1" fill="currentColor" className="opacity-40" />
              <path d="M4 4l16 16" strokeWidth="2.2" />
            </svg>
          </span>
          <p>
            <span className="block text-[2rem] font-semibold leading-tight">{scene.wifi}</span>
            <span className="text-lg text-muted">{scene.wifiState}</span>
          </p>
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

// The one section that breaks the page's pattern: centred, the scene first, the claim at display size.
export function Audio() {
  return (
    <Chapter id="privacy" title={AUDIO.title} wide hiddenTitle className="band-dark mt-24 pb-16 pt-20 text-center sm:mt-32 sm:pt-28">
      <p className="mx-auto max-w-4xl text-balance text-[clamp(2.4rem,1.5rem+3.8vw,4.75rem)] leading-[1.04] tracking-[-0.02em]">{AUDIO.display}</p>
      <OfflineScene />
      <p className="mx-auto mt-12 max-w-2xl">
        {AUDIO.paragraphs[0]} {AUDIO.sourceBefore}{" "}
        <a href={SITE.repoUrl} className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
          {AUDIO.sourceLink}
        </a>
        {AUDIO.sourceAfter}
      </p>
    </Chapter>
  );
}
