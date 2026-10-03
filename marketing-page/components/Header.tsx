import { Wordmark } from "@/components/Wordmark";
import { PAGES } from "@/lib/pages";

// min-h-11: a 44 px tap target on a phone, where these wrap onto their own rows.
const LINK =
  "inline-flex min-h-11 items-center underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";

// The wordmark home and the main pages. Wraps onto a second row on a phone.
export function Header({ current }: { current?: string }) {
  return (
    <header className="border-b border-border px-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-0 py-2">
        {/* Plain links between pages: each page is a static file, and hydration waits for load anyway. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="flex min-h-11 items-center rounded-sm">
          <Wordmark />
        </a>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-5 gap-y-0 font-sans text-[0.95rem]">
          {PAGES.filter((p) => p.header).map((p) => (
            <a
              key={p.path}
              href={p.path}
              aria-current={p.path === current ? "page" : undefined}
              className={p.path === current ? `${LINK} font-semibold decoration-foreground` : LINK}
            >
              {p.nav}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
