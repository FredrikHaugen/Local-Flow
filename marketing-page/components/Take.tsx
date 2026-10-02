import { OverlayPill } from "@/components/OverlayPill";
import { USING } from "@/lib/content";

function Check() {
  return <span aria-hidden="true" className="mt-[0.3em] h-[1.1em] w-[1.1em] shrink-0 rounded-full border-[1.5px] border-foreground/35" />;
}

// The hero scene: Reminders, mid-session. The last thing you said has landed as a reminder, cleaned up
// and still marked as just arrived;
// you're already saying the next one, so a new row waits with the cursor and the overlay listens at the
// bottom of the window. Under the window, what whisper heard for the reminder that landed.
export function Take() {
  const { window: w } = USING;
  const raw = w.raw.split(" ");
  return (
    <figure aria-label={USING.sceneLabel} className="mt-14 sm:mt-16">
      <div className="window-shadow overflow-hidden rounded-xl bg-card font-sans">
        <p className="relative border-b border-border px-4 py-2 text-center text-[0.8rem] font-semibold text-foreground/80">
          <span aria-hidden="true" className="absolute left-3 top-1/2 flex -translate-y-1/2 gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </span>
          {w.app}
        </p>
        <div className="grid sm:grid-cols-[13rem_minmax(0,1fr)]">
          {/* The sidebar of lists, as Reminders draws it. */}
          <ul aria-hidden="true" className="hidden space-y-1 border-r border-border bg-background/60 p-3 text-[0.9rem] sm:block">
            {w.sidebar.map((name) => (
              <li
                key={name}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${name === w.list ? "bg-foreground/10 font-semibold" : "text-muted"}`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${name === w.list ? "bg-rec" : "bg-foreground/25"}`} />
                {name}
              </li>
            ))}
          </ul>
          <div className="relative px-6 pb-24 pt-6 sm:px-10 sm:pb-28 sm:pt-8">
            <p className="text-[clamp(1.6rem,1.3rem+1.2vw,2.3rem)] font-bold tracking-[-0.01em]">{w.list}</p>
            <ul className="mt-4 text-[clamp(1.05rem,0.95rem+0.4vw,1.25rem)]">
              {w.earlier.map((item) => (
                <li key={item} className="flex gap-3 border-b border-border py-3">
                  <Check />
                  {item}
                </li>
              ))}
              {/* The one that just landed. */}
              <li className="flex gap-3 border-b border-border py-3">
                <Check />
                <span>
                  <span className="selected">{w.text}</span>
                </span>
              </li>
              {/* The next one, while you say it. */}
              <li className="flex gap-3 py-3">
                <Check />
                <span aria-hidden="true" className="caret mt-[0.25em] inline-block h-[1.1em] w-[2px] bg-foreground" />
              </li>
            </ul>
            <div className="absolute inset-x-0 bottom-6 flex justify-center">
              <OverlayPill />
            </div>
          </div>
        </div>
      </div>
      <figcaption data-scene="raw" className="mt-5 font-sans text-[1.05rem] text-muted">
        {w.heardLabel}:{" "}
        <span className="font-mono text-[1.05rem] text-foreground">
          {raw.map((word, i) => (
            <span key={i}>
              {i > 0 && " "}
              {(w.dropped as readonly number[]).includes(i) ? <s className="text-muted decoration-foreground">{word}</s> : word}
            </span>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
