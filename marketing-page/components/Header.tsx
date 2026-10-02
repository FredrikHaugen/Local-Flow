import { MobileMenu } from "@/components/MobileMenu";
import { Wordmark } from "@/components/Wordmark";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="rounded-lg">
          <Wordmark />
        </a>
        <nav aria-label="Main" className="flex items-center gap-2 text-sm md:gap-7">
          {/* Anchor links fold into the phone menu; Download always stays visible. */}
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
            className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-accent-foreground bg-accent px-4 py-1.5 font-semibold text-accent-foreground transition-transform hover:-translate-y-px md:min-h-0 dark:border-transparent"
          >
            Download
          </a>
          <MobileMenu />
        </nav>
      </div>
    </header>
  );
}
