import { Kbd } from "@/components/Kbd";
import { DesktopDemo } from "@/components/DesktopDemo";
import { SendToMac } from "@/components/SendToMac";
import { Marked, Marker } from "@/components/Brand";
import { HERO, HERO_PROOF, HERO_REQUIREMENT, HERO_TERMS, SITE } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative scroll-mt-16 overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-4 pt-8 sm:px-6 sm:pt-12 lg:pt-8">
        <Marker label={HERO.eyebrow} />
        <h1
          id="hero-title"
          className="font-display mt-6 text-[clamp(3.5rem,15.5vw,7.6rem)] lg:text-[6.6rem] font-extrabold leading-[0.9] tracking-[-0.01em] sm:mt-7 lg:mt-6 lg:[&_.typed]:whitespace-nowrap"
        >
          <Marked text={SITE.tagline} mark={HERO.emphasis} />
        </h1>
        <div className="mt-7 max-w-2xl sm:mt-9 lg:grid lg:max-w-none lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:items-start lg:gap-14">
          <p className="text-lg leading-relaxed text-muted sm:text-xl">
            {HERO.pitchBefore} <Kbd>Right ⌥</Kbd>
            {HERO.pitchAfter}
          </p>
          <div data-cta className="mt-7 sm:mt-8 lg:mt-1">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={SITE.releasesUrl}
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-cta-edge bg-accent px-6 py-3.5 font-semibold text-accent-foreground shadow-[0_4px_0_var(--cta-edge)] transition-transform hover:-translate-y-0.5 sm:px-7 sm:py-4 sm:text-lg"
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
                className="inline-flex items-center gap-2 font-medium underline decoration-foreground/25 decoration-2 underline-offset-[6px] transition-colors hover:decoration-foreground sm:text-lg"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                  <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.71 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
                </svg>
                View on GitHub
              </a>
            </div>
            {/* One quiet line under Download: the requirement first, so nobody on an Intel Mac or
                macOS 13 is surprised, then the open-source engines it runs and their sourced speed. */}
            <p className="mt-5 text-sm leading-relaxed text-muted">
              <span className="font-semibold text-foreground">Requires {HERO_REQUIREMENT}</span>
              <span aria-hidden="true"> · </span>
              {HERO_TERMS}
              {/* Phones keep the line short; the engines and speed come again further down. */}
              <span className="hidden sm:inline">
                <span aria-hidden="true"> · </span>
                {HERO_PROOF.lead} {HERO_PROOF.stack.map(({ name }) => name).join(" + ")},{" "}
                <span className="font-semibold text-accent-ink">{HERO_PROOF.stat}</span> {HERO_PROOF.statNote}
              </span>
            </p>
            {/* Phones only: the download is for a Mac, so offer to send the page there. */}
            <SendToMac className="mt-3 md:hidden" />
          </div>
        </div>
      </div>

      <div className="relative mt-10 sm:mt-12 lg:mt-7">
        <DesktopDemo />
      </div>
    </section>
  );
}
