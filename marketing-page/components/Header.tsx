import { Wordmark } from "@/components/Wordmark";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="rounded-lg">
          <Wordmark />
        </a>
        <nav aria-label="Main" className="flex items-center gap-7 text-sm">
          {/* Anchor links hide on phones; Download always stays visible. */}
          <ul className="hidden items-center gap-7 md:flex">
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
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-85"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            Download
          </a>
        </nav>
      </div>
    </header>
  );
}
