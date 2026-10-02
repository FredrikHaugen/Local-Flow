import { OverlayPill } from "@/components/OverlayPill";
import { USING } from "@/lib/content";

// The hero's picture is the take itself, set in the page's own type: what whisper heard, with the
// words cleanup drops struck through, the overlay as peluni cleans it up, then the sentence that lands.
export function Take() {
  const raw = USING.window.raw.split(" ");
  return (
    <figure aria-label={USING.sceneLabel} className="mt-14 sm:mt-20">
      <p data-scene="raw" className="font-mono text-[clamp(1.05rem,0.9rem+0.7vw,1.5rem)] leading-relaxed text-foreground">
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
      <div className="my-6 flex items-center gap-4 sm:my-8">
        <OverlayPill phase="cleaning" />
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
      <p className="text-balance text-[clamp(2.1rem,1.2rem+3.6vw,4.4rem)] leading-[1.08] tracking-[-0.02em]">
        {USING.window.text}
        <span aria-hidden="true" className="caret ml-1 inline-block h-[1em] w-[3px] translate-y-[0.14em] bg-foreground" />
      </p>
    </figure>
  );
}
