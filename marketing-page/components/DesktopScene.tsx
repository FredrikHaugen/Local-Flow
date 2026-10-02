import { Kbd } from "@/components/Kbd";
import { OverlayPill } from "@/components/OverlayPill";
import { USING } from "@/lib/content";

// The Mac while you dictate, edge to edge: Reminders with what you said fading above what landed,
// peluni's menu open on its recent transcripts, and the overlay with the keys that drive it.
export function DesktopScene() {
  const clip = (t: string) => (t.length > USING.menu.truncateAt ? `${t.slice(0, USING.menu.truncateAt)}…` : t);
  const raw = USING.window.raw.split(" ");
  return (
    <figure aria-label={USING.menu.label} className="desk-scene window-shadow relative left-1/2 mt-10 w-[min(calc(100vw-2rem),72rem)] -translate-x-1/2 overflow-hidden rounded-2xl font-sans text-[0.95rem]">
      <div aria-hidden="true" className="flex h-8 items-center justify-end gap-5 border-b border-border/70 px-4 text-[0.8rem]">
        <span className="grid h-6 w-8 place-items-center rounded bg-foreground/10">
          <svg viewBox="10 26 90 68" className="h-3.5 w-auto" fill="none">
            <path d="M20 41H43.6522L68.7826 83H88" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="80" cy="41" r="12" className="rec-dot fill-rec" />
          </svg>
        </span>
        <span className="tabular-nums">Fri 4:12 PM</span>
      </div>

      {/* The scene runs edge to edge; the windows sit on the page's content column, tops aligned. */}
      <div className="mx-auto grid max-w-5xl items-start gap-6 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="window-shadow overflow-hidden rounded-xl bg-card">
          <p className="relative border-b border-border px-4 py-2 text-center text-[0.8rem] font-semibold text-foreground/80">
            <span aria-hidden="true" className="absolute left-3 top-1/2 flex -translate-y-1/2 gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </span>
            {USING.window.app}
          </p>
          <div className="px-6 pb-9 pt-6 sm:px-9">
            <p data-scene="raw" className="font-mono text-[0.95rem] leading-relaxed text-muted">
              {raw.map((word, i) => (
                <span key={i}>
                  {i > 0 && " "}
                  {(USING.window.dropped as readonly number[]).includes(i) ? <s className="decoration-foreground/60">{word}</s> : word}
                </span>
              ))}
            </p>
            <p className="mt-4 font-serif text-[clamp(1.5rem,1.15rem+1.4vw,2.2rem)] leading-snug">
              {USING.window.text}
              <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-foreground" />
            </p>
          </div>
        </div>

        <div className="window-shadow hidden rounded-lg bg-card p-1.5 lg:block">
          <p className="px-3 pb-1 pt-1.5 text-xs font-semibold text-muted">{USING.menu.recentTitle}</p>
          <ul aria-label={USING.menu.recentTitle}>
            {USING.menu.recent.map((t) => (
              <li key={t} className="truncate rounded px-3 py-1.5">
                {clip(t)}
              </li>
            ))}
          </ul>
          <div className="my-1.5 border-t border-border" />
          {USING.menu.commands.map((c) => (
            <p key={c.label} className="flex justify-between rounded px-3 py-1.5">
              {c.label}
              <span className="text-muted">{c.shortcut}</span>
            </p>
          ))}
        </div>
      </div>

      {/* The overlay, where the real one sits, with the keys that drive it as its caption. */}
      <div className="flex flex-col items-center gap-5 px-4 pb-10">
        <div className="origin-center sm:scale-125">
          <OverlayPill />
        </div>
        <dl aria-label={USING.keysLabel} className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {USING.keys.map((k) => (
            <div key={`${k.how}-${k.key}`} className="flex items-baseline gap-2">
              <dt className="flex items-baseline gap-2 font-semibold">
                {k.how} <Kbd>{k.key}</Kbd>
              </dt>
              <dd className="text-muted">{k.result}</dd>
            </div>
          ))}
        </dl>
      </div>

      <figcaption className="mx-auto max-w-5xl px-4 pb-10 font-serif text-[1.05rem] sm:px-6">
        <span className="block max-w-3xl">
          {USING.paragraphs[0]} {USING.keysEnd}
        </span>
      </figcaption>
    </figure>
  );
}
