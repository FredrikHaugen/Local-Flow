import { Kbd } from "@/components/Kbd";
import { DesktopDemo } from "@/components/DesktopDemo";
import { Marked, Marker } from "@/components/Brand";
import { HERO, HERO_REQUIREMENT, HERO_TERMS, SITE } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative scroll-mt-16 overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14">
        <Marker label={HERO.eyebrow} />
        <h1
          id="hero-title"
          className="font-display mt-6 text-[clamp(3.5rem,15.5vw,7.6rem)] font-extrabold leading-[0.9] tracking-[-0.01em] sm:mt-7"
        >
          <Marked text={SITE.tagline} mark={HERO.emphasis} />
        </h1>
        <div className="mt-8 grid gap-7 sm:mt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-14">
          <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            {HERO.pitchBefore} <Kbd>Right ⌥</Kbd>
            {HERO.pitchAfter}
          </p>
          <div data-cta>
            <div className="flex flex-wrap gap-3">
              <a
                href={SITE.releasesUrl}
                className="inline-flex items-center gap-2.5 rounded-full bg-accent px-5 py-3.5 font-semibold text-accent-foreground shadow-[0_10px_28px_-10px_var(--accent)] transition-transform hover:-translate-y-0.5 sm:px-7 sm:py-4 sm:text-lg"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 sm:h-5 sm:w-5"
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
                className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card px-5 py-3.5 font-medium transition-colors hover:border-foreground/40 sm:px-6 sm:py-4 sm:text-lg"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                  <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.71 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
                </svg>
                <span>
                  <span className="sr-only sm:not-sr-only">View on</span> GitHub
                </span>
              </a>
            </div>
            {/* The requirement sits right under Download, so nobody on an Intel Mac or macOS 13 is surprised. */}
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-1 font-semibold text-foreground">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="2" y="3" width="12" height="8.5" rx="1.5" />
                  <path d="M5.5 14h5" strokeLinecap="round" />
                </svg>
                Requires {HERO_REQUIREMENT}
              </span>
              <span className="whitespace-nowrap font-mono text-muted">{HERO_TERMS}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-12 sm:mt-14">
        <DesktopDemo />
      </div>
    </section>
  );
}
