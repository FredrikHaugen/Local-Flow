import { OverlayPill } from "@/components/OverlayPill";
import { USING } from "@/lib/content";

// The hero's picture: one roomy Reminders window, no desktop around it. What whisper heard sits on top
// with the words cleanup drops struck through, the sentence that lands sits below it, and the overlay
// waits at the bottom of the window, where the real one sits, while peluni cleans up.
export function Take() {
  const raw = USING.window.raw.split(" ");
  return (
    <figure aria-label={USING.sceneLabel} className="window-shadow mt-10 overflow-hidden rounded-xl bg-card sm:mt-12">
      <p className="relative border-b border-border px-4 py-2 text-center font-sans text-[0.8rem] font-semibold text-foreground/80">
        <span aria-hidden="true" className="absolute left-3 top-1/2 flex -translate-y-1/2 gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        {USING.window.app}
      </p>
      <p data-scene="raw" className="bg-background/60 px-6 py-7 font-mono text-[clamp(0.95rem,0.88rem+0.35vw,1.2rem)] leading-relaxed text-foreground sm:px-14 sm:py-8">
        {raw.map((word, i) => (
          <span key={i}>
            {i > 0 && " "}
            {(USING.window.dropped as readonly number[]).includes(i) ? (
              <s className="text-muted decoration-foreground decoration-2">{word}</s>
            ) : (
              word
            )}
          </span>
        ))}
      </p>
      <div className="flex flex-col border-t border-border px-6 pb-8 pt-10 sm:min-h-[15.5rem] sm:px-14 sm:pt-11">
        <p className="text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] leading-[1.22] tracking-[-0.01em]">
          {USING.window.text}
          <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-foreground" />
        </p>
        <div className="mt-10 flex justify-center sm:mt-auto">
          <OverlayPill phase="cleaning" />
        </div>
      </div>
    </figure>
  );
}
