import { AnalyticsSettingsButton } from "@/components/AnalyticsConsent";
import { Wordmark } from "@/components/Wordmark";
import { FOOTER_NOTE } from "@/lib/content";
import { PAGES } from "@/lib/pages";
import { SITE } from "@/lib/site";

const LINK = "underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";
// Standalone list links get a 44 px tap target; the settings button sits inside a sentence and keeps LINK.
const LIST_LINK = `inline-flex min-h-11 items-center ${LINK}`;

export function Footer() {
  return (
    <footer className="border-t border-border px-4 font-sans text-[0.95rem] sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-6 py-10 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-12">
        <Wordmark />
        <div className="grid gap-4">
          <ul aria-label="Pages" className="flex flex-wrap gap-x-5 gap-y-0">
            {PAGES.filter((p) => p.path !== "/").map((p) => (
              <li key={p.path}>
                <a href={p.path} className={LIST_LINK}>
                  {p.nav}
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-5 gap-y-0">
            {FOOTER_NOTE.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={LIST_LINK}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="grid gap-3">
            <p className="text-muted">
              {FOOTER_NOTE.site} <AnalyticsSettingsButton className={`${LINK} text-muted`} />
            </p>
            <p className="text-muted">
              {FOOTER_NOTE.made.before}
              <a href={SITE.maintainer.url} className={`${LINK} text-muted`}>
                {SITE.maintainer.name}
              </a>
              {FOOTER_NOTE.made.after}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
