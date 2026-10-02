import { Chapter } from "@/components/Chapter";
import { OverlayPill } from "@/components/OverlayPill";
import { AUDIO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The privacy claim as one picture, on the page's only dark band: a Mac screen with Wi-Fi switched off in
// the menu bar, and a reply in Messages, dictated anyway, while the overlay listens for the rest.
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
    <figure aria-label={scene.label} className="window-shadow relative mt-14 overflow-hidden rounded-2xl bg-card text-left font-sans">
      {/* The menu bar: the app's menus on the left; peluni, Wi-Fi (off, its menu open) and the clock on the right. */}
      <div className="flex h-9 items-center gap-5 border-b border-border px-4 text-[0.85rem]">
        <svg aria-hidden="true" viewBox="0 0 14 17" className="h-3.5 w-3 fill-current">
          <path d="M11.6 9c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.7-3.1.7-.7 0-1.6-.7-2.7-.7C3.2 4.2 1.9 5 1.2 6.3c-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.2 2.6 2.1 1-.1 1.4-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4 0 0-2.3-.9-2.3-3.5ZM9.5 2.9c.6-.7 1-1.7.9-2.7-.8 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6.9.1 1.9-.5 2.5-1.2Z" />
        </svg>
        <span className="font-bold">{scene.app}</span>
        {scene.menus.map((m) => (
          <span key={m} aria-hidden="true" className="hidden sm:inline">
            {m}
          </span>
        ))}
        <span aria-hidden="true" className="ml-auto grid h-6 w-8 place-items-center rounded">
          <svg viewBox="10 26 90 68" className="h-3.5 w-auto" fill="none">
            <path d="M20 41H43.6522L68.7826 83H88" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="80" cy="41" r="12" className="rec-dot fill-rec" />
          </svg>
        </span>
        <span className="grid h-6 w-8 place-items-center rounded bg-foreground/15">
          <WifiOff className="h-4 w-4" />
        </span>
        <span aria-hidden="true" className="hidden tabular-nums sm:inline">
          {scene.clock}
        </span>
      </div>

      {/* The Wi-Fi menu, dropped down from its icon. */}
      <div className="absolute right-3 top-11 z-10 w-60 rounded-xl border border-border bg-background p-4 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.6)] sm:right-24">
        <p className="flex items-center justify-between gap-4">
          <span>
            <span className="block text-[1.05rem] font-semibold leading-tight">{scene.wifi}</span>
            <span className="text-sm text-muted">{scene.wifiState}</span>
          </span>
          <span aria-hidden="true" className="relative h-6 w-10 shrink-0 rounded-full bg-foreground/20">
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-foreground/80" />
          </span>
        </p>
      </div>

      {/* Messages: the thread, and the reply in the compose field while the overlay listens for more. */}
      <div className="px-4 pb-24 pt-28 sm:px-10 sm:pt-16">
        <div className="max-w-2xl">
          <p className="text-[0.8rem] font-semibold text-muted">{scene.contact}</p>
          <p className="mt-3 w-fit max-w-[75%] rounded-2xl bg-background px-4 py-2 text-[1.05rem]">{scene.incoming}</p>
          <p className="mt-10 rounded-2xl border border-border px-5 py-3 font-serif text-[clamp(1.15rem,1rem+0.8vw,1.6rem)] leading-snug">
            {scene.text}
            <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-current" />
          </p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <OverlayPill />
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
