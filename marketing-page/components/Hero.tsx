import { Kbd } from "@/components/Kbd";
import { OverlayMock } from "@/components/OverlayMock";
import { HERO, HERO_FINEPRINT, PROMISES, SITE } from "@/lib/site";

export function Hero() {
  const [before, after] = SITE.tagline.split(HERO.emphasis);
  return (
    <section id="top" aria-labelledby="hero-title" className="relative scroll-mt-16 overflow-hidden">
      <div
        aria-hidden="true"
        className="dot-grid-light absolute inset-x-0 top-0 h-[34rem] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="relative mx-auto max-w-5xl px-4 pt-14 sm:px-6 sm:pt-24">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted">
          <span aria-hidden="true" className="rec-dot h-2 w-2 rounded-full bg-accent" />
          {HERO.eyebrow}
        </p>
        <h1
          id="hero-title"
          className="font-display mt-7 max-w-[13ch] text-[clamp(2.75rem,10.5vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.045em]"
        >
          {before}
          <span className="text-accent">{HERO.emphasis}</span>
          {after}
        </h1>
        <div className="mt-10 grid gap-8 sm:mt-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            {HERO.pitchBefore} <Kbd>Right ⌥</Kbd>
            {HERO.pitchAfter}
          </p>
          <div data-cta>
            <div className="flex flex-wrap gap-3">
              <a
                href={SITE.releasesUrl}
                className="inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3.5 font-medium text-accent-foreground shadow-[0_8px_24px_-10px_var(--accent)] transition-transform hover:-translate-y-0.5"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 4v12M6 11l6 6 6-6M5 20h14" />
                </svg>
                Download for Mac
              </a>
              <a
                href={SITE.repoUrl}
                className="inline-flex items-center rounded-full border border-foreground/15 bg-card px-6 py-3.5 font-medium transition-colors hover:border-foreground/40"
              >
                View on GitHub
              </a>
            </div>
            <p className="mt-4 font-mono text-xs text-balance text-muted">{HERO_FINEPRINT}</p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-14 max-w-5xl px-4 sm:mt-20 sm:px-6">
        <OverlayMock />
      </div>

      <div className="mx-auto mt-14 max-w-5xl px-4 pb-6 sm:mt-16 sm:px-6">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
          {PROMISES.map((promise) => (
            <li
              key={promise}
              className="flex items-center gap-2.5 bg-background px-4 py-4 font-mono text-xs uppercase tracking-[0.14em] sm:justify-center"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              {promise}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
