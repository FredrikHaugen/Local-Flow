import { Chapter } from "@/components/Chapter";
import { OverlayPill } from "@/components/OverlayPill";
import { AUDIO, QUESTIONS } from "@/lib/content";
import { SITE } from "@/lib/site";

// The privacy claim as one picture, the page's only dark band: one bright panel. Across the top, the
// Wi-Fi switch, large and off; under it, a reply to Sam landing anyway while the overlay listens.
function WifiOff({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0" className="opacity-40" />
      <circle cx="12" cy="19.5" r="1" fill="currentColor" className="opacity-40" />
      <path d="M4 4l16 16" strokeWidth="2.2" />
    </svg>
  );
}

function OfflineScene() {
  const { scene } = AUDIO;
  return (
    <figure aria-label={scene.label} className="mt-10 overflow-hidden rounded-2xl bg-overlay-foreground font-sans text-overlay">
      {/* The Wi-Fi switch, large and off, across the top. */}
      <div className="flex items-center gap-5 border-b border-black/10 px-8 py-6 sm:px-12">
        <WifiOff className="h-10 w-10 shrink-0" />
        <p className="mr-auto">
          <span className="block text-[1.75rem] font-semibold leading-tight">{scene.wifi}</span>
          <span className="text-[1.15rem] text-[#6e6e73]">{scene.wifiState}</span>
        </p>
        <span aria-hidden="true" className="relative h-12 w-[5.5rem] shrink-0 rounded-full bg-[#d1d1d6]">
          <span className="absolute left-1 top-1 h-10 w-10 rounded-full bg-white shadow" />
        </span>
      </div>
      {/* Under it, the reply landing in Messages anyway, while the overlay listens. */}
      <div className="px-8 py-10 sm:px-12 sm:py-12">
        <p className="text-sm font-semibold text-[#6e6e73]">
          {scene.app} · {scene.contact}
        </p>
        <p className="mt-4 w-fit rounded-2xl bg-[#e9e9eb] px-4 py-2 text-[1.1rem]">{scene.incoming}</p>
        <p className="mt-8 max-w-4xl font-serif text-[clamp(1.75rem,1.2rem+2.2vw,3.1rem)] leading-[1.15] tracking-[-0.015em]">
          {scene.text}
          <span aria-hidden="true" className="caret ml-1 inline-block h-[1em] w-[2px] translate-y-[0.14em] bg-current" />
        </p>
        <div className="mt-8">
          <OverlayPill />
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
      <div className="mt-12 grid gap-x-12 gap-y-6 lg:grid-cols-3">
        <p>
          {AUDIO.paragraphs[0]} {AUDIO.sourceBefore}{" "}
          <a href={SITE.repoUrl} className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
            {AUDIO.sourceLink}
          </a>
          {AUDIO.sourceAfter}
        </p>
        <p>{QUESTIONS.items[1].a}</p>
        <p>{QUESTIONS.items[2].a}</p>
      </div>
    </Chapter>
  );
}
