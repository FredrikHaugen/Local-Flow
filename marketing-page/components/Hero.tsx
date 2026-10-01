import { Kbd } from "@/components/Kbd";
import { OverlayMock } from "@/components/OverlayMock";
import { HERO_FINEPRINT, SITE } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="mx-auto grid w-full max-w-5xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.1fr_1fr]"
    >
      <div>
        <h1 id="hero-title" className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {SITE.tagline}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Hold <Kbd>Right ⌥</Kbd>, speak, let go — clean text appears in whatever app you&apos;re using.
          Transcription and cleanup run entirely on-device.
        </p>
        <div data-cta className="mt-8">
          <div className="flex flex-wrap gap-3">
            <a
              href={SITE.releasesUrl}
              className="rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Download for Mac
            </a>
            <a
              href={SITE.repoUrl}
              className="rounded-full border border-border px-6 py-3 font-medium transition-colors hover:bg-card"
            >
              View on GitHub
            </a>
          </div>
          <p className="mt-4 text-sm text-muted">{HERO_FINEPRINT}</p>
        </div>
      </div>
      <OverlayMock />
    </section>
  );
}
