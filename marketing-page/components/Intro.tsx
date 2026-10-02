import { Kbd } from "@/components/Kbd";
import { SendToMac } from "@/components/SendToMac";
import { INTRO } from "@/lib/content";
import { SITE } from "@/lib/site";

export function Intro() {
  return (
    <section id="top" aria-labelledby="top-title" className="px-4 pt-14 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <h1 id="top-title" className="text-[clamp(2.25rem,1.55rem+2.9vw,3.6rem)] leading-[1.08] tracking-[-0.015em]">
            {INTRO.title}
          </h1>
          <p className="mt-6">
            {INTRO.bodyBefore} <Kbd>{INTRO.key}</Kbd> {INTRO.bodyAfter}
          </p>
          <div data-cta className="mt-8 font-sans">
            <a
              href={SITE.releasesUrl}
              className="inline-flex min-h-12 items-center rounded-md bg-foreground px-5 text-[1.05rem] font-semibold text-background transition-opacity hover:opacity-90"
            >
              {INTRO.download}
            </a>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
              {INTRO.requirement} {INTRO.release}
            </p>
            {/* Phones only: the download is for a Mac, so offer to send the page there. */}
            <SendToMac className="mt-4 md:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
