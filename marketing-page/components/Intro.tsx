import { DesktopScene } from "@/components/DesktopScene";
import { Kbd } from "@/components/Kbd";
import { SendToMac } from "@/components/SendToMac";
import { INTRO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The first screen: the promise and the download, then the Mac with peluni at work, edge to edge.
export function Intro() {
  return (
    <section id="top" aria-labelledby="top-title" className="px-4 pt-8 sm:px-6 sm:pt-12 lg:pt-11">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl lg:mx-auto lg:text-center">
          <h1 id="top-title" className="text-[clamp(2.3rem,1.5rem+3vw,3.6rem)] leading-[1.04] tracking-[-0.02em]">
            {INTRO.title}
          </h1>
          <p className="mt-4 lg:text-balance">
            {INTRO.bodyBefore} <Kbd className="py-0 text-[0.8em] leading-normal">{INTRO.key}</Kbd> {INTRO.bodyAfter}
          </p>
          <div data-cta className="mt-6 flex flex-col gap-2.5 lg:items-center">
            <a
              href={SITE.releasesUrl}
              className="inline-flex w-fit min-h-12 items-center rounded-md bg-foreground px-5 font-sans text-[1.05rem] font-semibold text-background transition-opacity hover:opacity-90"
            >
              {INTRO.download}
            </a>
            <p className="text-[1rem] leading-snug text-muted">
              {INTRO.release} {INTRO.requirement}
            </p>
            {/* Phones only: the download is for a Mac, so offer to send the page there. */}
            <SendToMac className="w-full md:hidden" />
          </div>
        </div>
        <DesktopScene />
      </div>
    </section>
  );
}
