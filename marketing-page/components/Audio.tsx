import { Chapter } from "@/components/Chapter";
import { OverlayPill } from "@/components/OverlayPill";
import { AUDIO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The privacy claim as one picture, the page's only dark band: the right end of the menu bar, large and
// bright against the dark, with Wi-Fi switched off and its menu open, peluni's icon lit, and under it a
// reply landing in Messages anyway while the overlay listens.
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
    <figure aria-label={scene.label} className="mt-10 overflow-hidden rounded-2xl bg-[#e4e6e1] font-sans text-overlay">
      <div className="flex h-16 items-center justify-end gap-5 bg-overlay-foreground px-5 text-[1.15rem] sm:h-24 sm:gap-9 sm:px-10 sm:text-[1.7rem]">
        {/* The app's menus, crisp, on the left. */}
        <span aria-hidden="true" className="mr-auto hidden gap-8 md:flex">
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
      {/* Under the bar: Messages with the reply landing in its compose field, the Wi-Fi menu still open
          over it, and the overlay listening at the bottom of the screen. */}
      <div className="relative px-5 pb-24 pt-8 sm:px-10">
        <div className="max-w-2xl overflow-hidden rounded-xl bg-white text-[1.05rem] shadow-[0_24px_50px_-24px_rgb(0_0_0/0.35)]">
          <p className="relative border-b border-[#e5e5ea] px-4 py-2 text-center text-sm font-semibold text-[#3a3a3c]">
            <span aria-hidden="true" className="absolute left-3 top-1/2 flex -translate-y-1/2 gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </span>
            {scene.contact}
          </p>
          <div className="p-6 sm:p-8">
          <p className="w-fit rounded-2xl bg-[#e9e9eb] px-4 py-2">{scene.incoming}</p>
          <p className="mt-8 rounded-2xl border border-[#d1d1d6] px-5 py-3 font-serif text-[clamp(1.15rem,1rem+0.8vw,1.6rem)] leading-snug">
            {scene.text}
            <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-current" />
          </p>
          </div>
        </div>
        <div className="mt-6 w-full max-w-xs rounded-2xl bg-white p-5 shadow-[0_24px_50px_-20px_rgb(0_0_0/0.45)] sm:absolute sm:right-12 sm:top-6 sm:mt-0 lg:right-36">
          <p className="flex items-center justify-between gap-6">
            <span>
              <span className="block text-[1.5rem] font-semibold leading-tight">{scene.wifi}</span>
              <span className="text-[1.1rem] text-[#6e6e73]">{scene.wifiState}</span>
            </span>
            <span aria-hidden="true" className="relative h-9 w-16 shrink-0 rounded-full bg-[#d1d1d6]">
              <span className="absolute left-1 top-1 h-7 w-7 rounded-full bg-white shadow" />
            </span>
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
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
