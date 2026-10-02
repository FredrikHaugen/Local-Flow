import { Chapter } from "@/components/Chapter";
import { Kbd } from "@/components/Kbd";
import { USING } from "@/lib/content";

// The menu bar menu as it looks after a few dictations: recent transcripts, one click from the clipboard.
function MenuMock() {
  const clip = (t: string) => (t.length > USING.menu.truncateAt ? `${t.slice(0, USING.menu.truncateAt)}…` : t);
  return (
    <figure aria-label={USING.menu.label} className="font-sans text-[0.9rem]">
      <div aria-hidden="true" className="flex h-8 items-center justify-end gap-4 rounded-t-lg bg-desk px-4 text-[0.8rem]">
        <svg viewBox="10 26 90 68" className="h-3.5 w-auto" fill="none">
          <path d="M20 41H43.6522L68.7826 83H88" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="80" cy="41" r="12" className="fill-rec" />
        </svg>
        <span className="tabular-nums">Fri 4:12 PM</span>
      </div>
      <div className="window-shadow ml-auto mr-6 -mt-px w-[min(100%,22rem)] rounded-b-lg rounded-tl-lg bg-card p-1.5">
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
    </figure>
  );
}

export function Using() {
  return (
    <Chapter id="using" title={USING.title} wide className="pt-20 sm:pt-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] lg:gap-14">
        <div>
          {USING.paragraphs.map((p) => (
            <p key={p} className="mt-5">
              {p}
            </p>
          ))}
          <dl aria-label={USING.keysLabel} className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {USING.keys.map((k) => (
              <div key={`${k.how}-${k.key}`}>
                <dt className="flex items-center gap-2.5 font-sans font-semibold">
                  {k.how} <Kbd className="px-2.5 py-1 text-base">{k.key}</Kbd>
                </dt>
                <dd className="mt-2 text-[1.05rem] leading-relaxed text-muted">{k.result}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:pt-6">
          <MenuMock />
        </div>
      </div>
    </Chapter>
  );
}
