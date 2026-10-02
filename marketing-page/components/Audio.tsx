import { Chapter } from "@/components/Chapter";
import { AUDIO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The privacy claim as one picture, the page's only dark band: the right end of the menu bar at four
// times its size, bright against the dark, with Wi-Fi switched off and its menu open, and peluni's icon
// still lit because it's recording anyway.
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
    <figure aria-label={scene.label} className="mt-14 overflow-hidden rounded-2xl bg-[#e4e6e1] font-sans text-overlay">
      <div className="flex h-16 items-center justify-end gap-5 bg-overlay-foreground px-5 text-[1.15rem] sm:h-24 sm:gap-9 sm:px-10 sm:text-[1.7rem]">
        {/* The app's menus fade out to the left: this is the right end of the bar. */}
        <span aria-hidden="true" className="mr-auto hidden gap-8 opacity-30 [mask-image:linear-gradient(to_left,black,transparent)] md:flex">
          <span className="font-bold">{scene.app}</span>
          {scene.menus.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </span>
        <svg aria-hidden="true" viewBox="10 26 90 68" className="h-6 w-auto sm:h-9" fill="none">
          <path d="M20 41H43.6522L68.7826 83H88" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="80" cy="41" r="12" className="rec-dot fill-rec" />
        </svg>
        <span className="grid h-11 w-12 place-items-center rounded-lg bg-overlay/15 sm:h-16 sm:w-[4.5rem]">
          <WifiOff className="h-7 w-7 sm:h-10 sm:w-10" />
        </span>
        <span aria-hidden="true" className="tabular-nums">
          {scene.clock}
        </span>
      </div>
      {/* The Wi-Fi menu, dropped down from its icon. */}
      <div className="flex justify-end px-5 pb-10 pt-3 sm:px-10 sm:pb-16">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_24px_50px_-20px_rgb(0_0_0/0.45)] sm:mr-12">
          <p className="flex items-center justify-between gap-6">
            <span>
              <span className="block text-[1.6rem] font-semibold leading-tight">{scene.wifi}</span>
              <span className="text-[1.15rem] text-[#6e6e73]">{scene.wifiState}</span>
            </span>
            <span aria-hidden="true" className="relative h-9 w-16 shrink-0 rounded-full bg-[#d1d1d6]">
              <span className="absolute left-1 top-1 h-7 w-7 rounded-full bg-white shadow" />
            </span>
          </p>
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
