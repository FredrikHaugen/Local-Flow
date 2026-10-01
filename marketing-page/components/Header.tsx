import { Wordmark } from "@/components/Wordmark";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top">
          <Wordmark />
        </a>
        <nav aria-label="Main" className="flex items-center gap-6 text-sm">
          {/* Anchor links hide on phones; Download always stays visible. */}
          <ul className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-muted transition-colors hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={SITE.releasesUrl}
            className="rounded-full bg-accent px-4 py-1.5 font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Download
          </a>
        </nav>
      </div>
    </header>
  );
}
