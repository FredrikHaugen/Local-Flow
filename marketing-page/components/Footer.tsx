import { Wordmark } from "@/components/Wordmark";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 pt-12 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Wordmark className="text-foreground" />
        <p>
          {SITE.license} licensed ·{" "}
          <a href={SITE.repoUrl} className="underline underline-offset-4 hover:text-foreground">
            Source on GitHub
          </a>
        </p>
        <p>This site has no analytics and sets no cookies, either.</p>
      </div>
      {/* Decorative giant wordmark, drawn by CSS so it isn't page text. */}
      <div
        aria-hidden="true"
        data-word={SITE.name}
        className="font-display giant-word mx-auto mt-6 max-w-5xl select-none px-4 text-center text-[clamp(4rem,19vw,13rem)] font-bold leading-[0.8] tracking-[-0.06em] sm:px-6"
      />
    </footer>
  );
}
