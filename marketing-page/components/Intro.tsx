import { DesktopDemo } from "@/components/DesktopDemo";
import { Kbd } from "@/components/Kbd";
import { SendToMac } from "@/components/SendToMac";
import { INTRO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The first screen: the promise and the download on the left, the product doing it on the right.
export function Intro() {
  return (
    <section id="top" aria-labelledby="top-title" className="px-4 pt-10 sm:px-6 sm:pt-16 lg:pt-20">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
        <div>
          <h1 id="top-title" className="text-[clamp(2.25rem,1.6rem+2.6vw,3.25rem)] leading-[1.08] tracking-[-0.015em]">
            {INTRO.title}
          </h1>
          <p className="mt-5">
            {INTRO.bodyBefore} <Kbd>{INTRO.key}</Kbd> {INTRO.bodyAfter}
          </p>
          <div data-cta className="mt-7">
            <a
              href={SITE.releasesUrl}
              className="inline-flex min-h-12 items-center rounded-md bg-foreground px-5 font-sans text-[1.05rem] font-semibold text-background transition-opacity hover:opacity-90"
            >
              {INTRO.download}
            </a>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
              {INTRO.requirement} {INTRO.release}
            </p>
            {/* Phones only: the download is for a Mac, so offer to send the page there. */}
            <SendToMac className="mt-3 md:hidden" />
          </div>
        </div>
        <DesktopDemo />
      </div>
    </section>
  );
}
