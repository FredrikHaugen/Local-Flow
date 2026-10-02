import { Chapter } from "@/components/Chapter";
import { Kbd } from "@/components/Kbd";
import { OverlayPill } from "@/components/OverlayPill";
import { USING } from "@/lib/content";

// The Mac while you dictate, at full width: the menu bar with peluni's menu open on its recent
// transcripts, and the overlay at the bottom of the screen showing it hears you.
function DesktopShot() {
  const clip = (t: string) => (t.length > USING.menu.truncateAt ? `${t.slice(0, USING.menu.truncateAt)}…` : t);
  return (
    <figure aria-label={USING.menu.label} className="desk-scene relative left-1/2 mt-10 h-[30rem] w-screen -translate-x-1/2 overflow-hidden font-sans text-[0.95rem] sm:h-[34rem]">
      <div aria-hidden="true" className="flex h-8 items-center justify-end gap-5 border-b border-border/70 px-4 text-[0.8rem]">
        <span className="grid h-6 w-8 place-items-center rounded bg-foreground/10">
          <svg viewBox="10 26 90 68" className="h-3.5 w-auto" fill="none">
            <path d="M20 41H43.6522L68.7826 83H88" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="80" cy="41" r="12" className="rec-dot fill-rec" />
          </svg>
        </span>
        <span className="tabular-nums">Fri 4:12 PM</span>
      </div>
      {/* The scene runs edge to edge; the windows stay on the page's content column. */}
      <div className="relative mx-auto h-[calc(100%-2rem)] max-w-5xl px-4 sm:px-6">
      <div className="window-shadow absolute right-4 top-1 z-10 w-[min(calc(100%-2rem),24rem)] rounded-lg bg-card p-1.5 sm:right-6">
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
      {/* The app the text lands in, behind the menu. */}
      <div className="window-shadow absolute left-4 top-12 hidden w-[30rem] max-w-[50%] overflow-hidden rounded-xl bg-card sm:left-6 sm:block">
        <p className="relative border-b border-border px-4 py-2 text-center text-[0.8rem] font-semibold text-foreground/80">
          <span aria-hidden="true" className="absolute left-3 top-1/2 flex -translate-y-1/2 gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </span>
          {USING.window.app}
        </p>
        <p className="px-7 py-6 font-serif text-[1.3rem] leading-relaxed">
          {USING.window.text}
          <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-foreground" />
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-10 flex justify-center">
        <div className="origin-bottom scale-125 sm:scale-150">
          <OverlayPill />
        </div>
      </div>
      </div>
    </figure>
  );
}

export function Using() {
  return (
    <Chapter id="using" title={USING.title} wide className="pt-20 sm:pt-28">
      <div className="max-w-2xl">
        {USING.paragraphs.map((p) => (
          <p key={p} className="mt-5">
            {p}
          </p>
        ))}
      </div>
      <DesktopShot />
      <p aria-label={USING.keysLabel} className="mt-8 max-w-4xl text-[clamp(1.25rem,1.05rem+0.8vw,1.6rem)] leading-[1.6]">
        {USING.keys.map((k) => (
          <span key={`${k.how}-${k.key}`}>
            {k.how} <Kbd className="px-2 py-0 text-[0.8em] leading-normal">{k.key}</Kbd> {k.result},{" "}
          </span>
        ))}
        {USING.keysEnd}
      </p>
    </Chapter>
  );
}
