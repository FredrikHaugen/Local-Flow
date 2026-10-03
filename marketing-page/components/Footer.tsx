import { AnalyticsSettingsButton } from "@/components/AnalyticsConsent";
import { Wordmark } from "@/components/Wordmark";
import { FOOTER_NOTE } from "@/lib/content";
import { PAGES } from "@/lib/pages";

const LINK = "underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";

export function Footer() {
  return (
    <footer className="border-t border-border px-4 font-sans text-[0.95rem] sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-6 py-10 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-12">
        <Wordmark />
        <div className="grid gap-3">
          <ul aria-label="Pages" className="flex flex-wrap gap-x-5 gap-y-2">
            {PAGES.filter((p) => p.path !== "/").map((p) => (
              <li key={p.path}>
                <a href={p.path} className={LINK}>
                  {p.nav}
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_NOTE.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={LINK}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-muted">
            {FOOTER_NOTE.site} <AnalyticsSettingsButton className={`${LINK} text-muted`} />
          </p>
          <p className="text-muted">{FOOTER_NOTE.made}</p>
        </div>
      </div>
    </footer>
  );
}
