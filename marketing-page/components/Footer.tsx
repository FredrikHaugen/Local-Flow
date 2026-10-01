import { Wordmark } from "@/components/Wordmark";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-12 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Wordmark className="text-foreground" />
        <p>
          {SITE.license} licensed ·{" "}
          <a href={SITE.repoUrl} className="underline underline-offset-4 hover:text-foreground">
            Source on GitHub
          </a>
        </p>
        <p>This site has no analytics and sets no cookies, either.</p>
      </div>
    </footer>
  );
}
