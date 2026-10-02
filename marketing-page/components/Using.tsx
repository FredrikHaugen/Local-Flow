import { Chapter } from "@/components/Chapter";
import { Kbd } from "@/components/Kbd";
import { OverlayPill } from "@/components/OverlayPill";
import { USING } from "@/lib/content";

// The Mac while you dictate, at full width: the menu bar with peluni's menu open on its recent
// transcripts, and the overlay at the bottom of the screen showing it hears you.
function DesktopShot() {
  const clip = (t: string) => (t.length > USING.menu.truncateAt ? `${t.slice(0, USING.menu.truncateAt)}…` : t);
  return (
    <figure aria-label={USING.menu.label} className="desk relative mt-10 h-[26rem] overflow-hidden rounded-xl font-sans text-[0.9rem] sm:h-[24rem]">
      <div aria-hidden="true" className="flex h-8 items-center justify-end gap-5 border-b border-border/70 px-4 text-[0.8rem]">
        <span className="grid h-6 w-8 place-items-center rounded bg-foreground/10">
          <svg viewBox="10 26 90 68" className="h-3.5 w-auto" fill="none">
            <path d="M20 41H43.6522L68.7826 83H88" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="80" cy="41" r="12" className="rec-dot fill-rec" />
          </svg>
        </span>
        <span className="tabular-nums">Fri 4:12 PM</span>
      </div>
      <div className="window-shadow absolute right-4 top-9 w-[min(calc(100%-2rem),22rem)] rounded-lg bg-card p-1.5 sm:right-24">
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
      <div className="window-shadow absolute left-4 top-16 hidden w-[26rem] overflow-hidden rounded-lg bg-card sm:block lg:left-12">
        <p className="border-b border-border px-4 py-2 text-center text-[0.8rem] font-semibold text-foreground/80">{USING.window.app}</p>
        <p className="px-5 py-4 font-serif text-[1.05rem] leading-relaxed">
          {USING.window.text}
          <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-foreground" />
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <OverlayPill />
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
      <dl aria-label={USING.keysLabel} className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {USING.keys.map((k) => (
          <div key={`${k.how}-${k.key}`}>
            <dt className="flex items-center gap-2.5 font-sans font-semibold">
              {k.how} <Kbd className="px-2.5 py-1 text-base">{k.key}</Kbd>
            </dt>
            <dd className="mt-2 text-[1.05rem] leading-relaxed text-muted">{k.result}</dd>
          </div>
        ))}
      </dl>
    </Chapter>
  );
}
