import { Wordmark } from "@/components/Wordmark";
import { FOOTER, NAV, SITE } from "@/lib/site";

const LINK = "rounded underline-offset-4 transition-colors hover:text-foreground hover:underline";

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-border">
      <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6 sm:pt-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Wordmark className="text-foreground" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{FOOTER.blurb}</p>
          </div>
          <nav aria-label="Footer">
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{FOOTER.pageTitle}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={LINK}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{FOOTER.projectTitle}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {FOOTER.project.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={LINK}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border p-5">
            <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              {FOOTER.siteTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed">{FOOTER.siteNote}</p>
          </div>
        </div>

        {/* The name, set as large as the page allows. */}
        <p
          aria-hidden="true"
          className="footer-name font-display mt-16 select-none font-extrabold sm:mt-20"
        >
          {SITE.name}
          <span />
        </p>
        <p className="border-t border-border py-6 font-mono text-xs text-muted">{FOOTER.legal}</p>
      </div>
    </footer>
  );
}
