import { DesktopDemo } from "@/components/DesktopDemo";
import { Kbd } from "@/components/Kbd";
import { SendToMac } from "@/components/SendToMac";
import { INTRO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The first screen: the promise and the download, then the product doing it, at full width.
export function Intro() {
  return (
    <section id="top" aria-labelledby="top-title" className="px-4 pt-10 sm:px-6 sm:pt-12 lg:pt-10">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl lg:mx-auto lg:text-center">
          <h1 id="top-title" className="text-[clamp(2.25rem,1.6rem+2.6vw,3.25rem)] leading-[1.08] tracking-[-0.015em]">
            {INTRO.title}
          </h1>
          <p className="mt-4 lg:text-balance">
            {INTRO.bodyBefore} <Kbd className="py-0 text-[0.8em] leading-normal">{INTRO.key}</Kbd> {INTRO.bodyAfter}
          </p>
          <div data-cta className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 lg:justify-center">
            <a
              href={SITE.releasesUrl}
              className="inline-flex min-h-12 items-center rounded-md bg-foreground px-5 font-sans text-[1.05rem] font-semibold text-background transition-opacity hover:opacity-90"
            >
              {INTRO.download}
            </a>
            <p className="max-w-[21rem] text-left text-[0.9rem] leading-snug text-muted">
              {INTRO.release} {INTRO.requirement}
            </p>
            {/* Phones only: the download is for a Mac, so offer to send the page there. */}
            <SendToMac className="w-full md:hidden" />
          </div>
        </div>
        <DesktopDemo />
      </div>
    </section>
  );
}
