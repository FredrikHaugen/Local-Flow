import { OverlayPill } from "@/components/OverlayPill";
import { USING } from "@/lib/content";

// The Mac while you dictate: Reminders with what you said struck through above what landed, the
// menu-bar icon lit while it listens, and the overlay with the keys that drive it.
export function DesktopScene() {
  const raw = USING.window.raw.split(" ");
  return (
    <figure aria-label={USING.sceneLabel} className="desk-scene window-shadow mt-10 overflow-hidden rounded-2xl font-sans text-[0.95rem]">
      <div aria-hidden="true" className="flex h-8 items-center gap-5 border-b border-border/70 bg-card/50 px-4 text-[0.8rem] backdrop-blur">
        <svg viewBox="0 0 14 17" className="h-3.5 w-3 fill-current">
          <path d="M11.6 9c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.7-3.1.7-.7 0-1.6-.7-2.7-.7C3.2 4.2 1.9 5 1.2 6.3c-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.2 2.6 2.1 1-.1 1.4-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4 0 0-2.3-.9-2.3-3.5ZM9.5 2.9c.6-.7 1-1.7.9-2.7-.8 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6.9.1 1.9-.5 2.5-1.2Z" />
        </svg>
        <span className="font-bold">{USING.window.app}</span>
        <span className="hidden sm:inline">File</span>
        <span className="hidden sm:inline">Edit</span>
        <span className="hidden sm:inline">View</span>
        <span className="ml-auto grid h-6 w-8 place-items-center rounded bg-foreground/15">
          <svg viewBox="10 26 90 68" className="h-3.5 w-auto" fill="none">
            <path d="M20 41H43.6522L68.7826 83H88" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="80" cy="41" r="12" className="rec-dot fill-rec" />
          </svg>
        </span>
        <span className="tabular-nums">Fri 4:12 PM</span>
      </div>

      {/* One window, centred: the moment the product exists for. */}
      <div className="relative mx-auto max-w-4xl px-4 pb-8 pt-10 sm:px-8">
        <div className="window-shadow relative overflow-hidden rounded-xl bg-card">
          <p className="relative border-b border-border px-4 py-2 text-center text-[0.8rem] font-semibold text-foreground/80">
            <span aria-hidden="true" className="absolute left-3 top-1/2 flex -translate-y-1/2 gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </span>
            {USING.window.app}
          </p>
          <div className="px-6 pb-10 pt-7 sm:px-12 sm:pb-12 sm:pt-9">
            <p data-scene="raw" className="font-mono text-[clamp(0.95rem,0.85rem+0.4vw,1.2rem)] leading-relaxed text-muted">
              {raw.map((word, i) => (
                <span key={i}>
                  {i > 0 && " "}
                  {(USING.window.dropped as readonly number[]).includes(i) ? <s className="decoration-foreground/60">{word}</s> : word}
                </span>
              ))}
            </p>
            <p className="mt-5 font-serif text-[clamp(1.75rem,1.2rem+2.4vw,3.1rem)] leading-[1.18] tracking-[-0.01em]">
              {USING.window.text}
              <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-foreground" />
            </p>
          </div>
        </div>

      </div>

      {/* The overlay, where the real one sits. */}
      <div className="flex flex-col items-center gap-5 px-4 pb-12">
        <div className="origin-center sm:scale-125">
          <OverlayPill />
        </div>
      </div>

    </figure>
  );
}
