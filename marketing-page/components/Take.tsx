import { USING } from "@/lib/content";

// The hero's picture: one Reminders window, no desktop around it, after the take is done. What whisper
// heard sits on top with the words cleanup dropped struck through, and the sentence that landed sits
// below with the cursor after it. The overlay is gone by then, as in the app.
export function Take() {
  const raw = USING.window.raw.split(" ");
  return (
    <figure aria-label={USING.sceneLabel} className="window-shadow mt-14 overflow-hidden rounded-xl bg-card sm:mt-20 xl:-mx-16">
      <p className="relative border-b border-border px-4 py-2 text-center font-sans text-[0.8rem] font-semibold text-foreground/80">
        <span aria-hidden="true" className="absolute left-3 top-1/2 flex -translate-y-1/2 gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        {USING.window.app}
      </p>
      <p data-scene="raw" className="bg-background/60 px-6 py-7 font-mono text-[clamp(0.95rem,0.88rem+0.4vw,1.3rem)] leading-relaxed text-foreground sm:px-14 sm:py-9">
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
      <div className="border-t border-border px-6 py-10 sm:px-14 sm:pb-16 sm:pt-12">
        <p className="text-[clamp(1.75rem,1.2rem+2vw,3rem)] leading-[1.18] tracking-[-0.015em]">
          {USING.window.text}
          <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-foreground" />
        </p>
      </div>
    </figure>
  );
}
