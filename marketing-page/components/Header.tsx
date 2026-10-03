import { Wordmark } from "@/components/Wordmark";
import { PAGES } from "@/lib/pages";
import { SITE } from "@/lib/site";

const LINK = "underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";

// The wordmark home, the main pages, and Download. Wraps onto a second row on a phone.
export function Header({ current }: { current?: string }) {
  return (
    <header className="border-b border-border px-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
        {/* Plain links between pages: each page is a static file, and hydration waits for load anyway. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="flex items-center rounded-sm">
          <Wordmark />
        </a>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[0.95rem]">
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
          <a href={SITE.releasesUrl} className={`${LINK} font-semibold`}>
            Download
          </a>
        </nav>
      </div>
    </header>
  );
}
