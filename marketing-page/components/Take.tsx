import { OverlayPill } from "@/components/OverlayPill";
import { USING } from "@/lib/content";

function Check() {
  return <span aria-hidden="true" className="mt-[0.3em] h-[1.1em] w-[1.1em] shrink-0 rounded-full border-[1.5px] border-foreground/35" />;
}

// The hero scene: Reminders, mid-session. The last thing you said has landed as a reminder, cleaned up
// and still marked as just arrived, with what whisper heard set right under it, fillers struck through.
// You're already saying the next one: a new row waits with the cursor and the overlay listens.
export function Take() {
  const { window: w } = USING;
  const raw = w.raw.split(" ");
  return (
    <figure aria-label={USING.sceneLabel} className="window-shadow mt-12 overflow-hidden rounded-xl bg-card font-sans">
      <p className="relative border-b border-border px-4 py-2 text-center text-[0.8rem] font-semibold text-foreground/80">
        <span aria-hidden="true" className="absolute left-3 top-1/2 flex -translate-y-1/2 gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        {w.app}
      </p>
      <div className="px-6 pb-6 pt-5 sm:px-12 sm:pt-7">
        <p className="text-[clamp(1.6rem,1.3rem+1.2vw,2.3rem)] font-bold tracking-[-0.01em]">{w.list}</p>
        <ul className="mt-3 text-[clamp(1.1rem,0.95rem+0.6vw,1.45rem)]">
          {w.earlier.map((item) => (
            <li key={item} className="flex gap-3 border-b border-border py-3">
              <Check />
              {item}
            </li>
          ))}
          {/* The one that just landed, and what whisper heard for it. */}
          <li className="flex gap-3 border-b border-border py-3">
            <Check />
            <span>
              <span className="selected">{w.text}</span>
              <span data-scene="raw" className="mt-1.5 block font-mono text-[0.72em] text-muted">
                {w.heardLabel}:{" "}
                {raw.map((word, i) => (
                  <span key={i}>
                    {i > 0 && " "}
                    {(w.dropped as readonly number[]).includes(i) ? <s className="decoration-foreground">{word}</s> : word}
                  </span>
                ))}
              </span>
            </span>
          </li>
          {/* The next one, while you say it. */}
          <li className="flex gap-3 py-3">
            <Check />
            <span aria-hidden="true" className="caret mt-[0.25em] inline-block h-[1.1em] w-[2px] bg-foreground" />
          </li>
        </ul>
        <div className="mt-2 flex justify-center">
          <OverlayPill />
        </div>
      </div>
    </figure>
  );
}
