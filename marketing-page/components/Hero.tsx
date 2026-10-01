import { Kbd } from "@/components/Kbd";
import { DesktopDemo } from "@/components/DesktopDemo";
import { Marked, Marker } from "@/components/Brand";
import { HERO, HERO_FINEPRINT, SITE } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative scroll-mt-16 overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-4 pt-14 sm:px-6 sm:pt-20">
        <Marker label={HERO.eyebrow} />
        <h1
          id="hero-title"
          className="font-display mt-7 max-w-[16ch] text-[clamp(3.75rem,17vw,9rem)] font-extrabold leading-[0.88] tracking-[-0.01em]"
        >
          <Marked text={SITE.tagline} mark={HERO.emphasis} />
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

      <div className="relative mt-14 sm:mt-20">
        <DesktopDemo />
      </div>
    </section>
  );
}
