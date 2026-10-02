import { Wordmark } from "@/components/Wordmark";
import { SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-border px-4 sm:px-6">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4">
        <a href="#top" className="rounded-sm">
          <Wordmark />
        </a>
        <nav aria-label="Main" className="flex items-center gap-5 font-sans text-[0.95rem]">
          <a href={SITE.repoUrl} className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">
            Source
          </a>
          <a
            href={SITE.releasesUrl}
            className="hidden min-h-10 items-center rounded-md sm:inline-flex bg-foreground px-3.5 font-semibold text-background transition-opacity hover:opacity-90"
          >
            Download
          </a>
        </nav>
      </div>
    </header>
  );
}
