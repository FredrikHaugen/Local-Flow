import { DesktopScene } from "@/components/DesktopScene";
import { Kbd } from "@/components/Kbd";
import { SendToMac } from "@/components/SendToMac";
import { INTRO, USING } from "@/lib/content";
import { SITE } from "@/lib/site";

// The first screen: one line and the download, then the Mac with peluni at work. Everything else
// (the keys, the speed, the requirements) waits under the scene or at the end of the page.
export function Intro() {
  return (
    <section id="top" aria-labelledby="top-title" className="px-4 pt-8 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-5xl">
        <h1 id="top-title" className="max-w-4xl text-[clamp(2.3rem,1.5rem+3vw,3.6rem)] leading-[1.04] tracking-[-0.02em]">
          {INTRO.title}
        </h1>
        <div data-cta className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href={SITE.releasesUrl}
            className="inline-flex min-h-12 w-fit shrink-0 items-center rounded-md bg-foreground px-5 font-sans text-[1.05rem] font-semibold text-background transition-opacity hover:opacity-90"
          >
            {INTRO.download}
          </a>
          <p className="font-sans text-muted">{INTRO.requirement}</p>
        </div>

        <DesktopScene />
        <p className="mt-6 max-w-3xl text-balance text-[clamp(1.15rem,1rem+0.5vw,1.4rem)]">
          {INTRO.bodyBefore} <Kbd className="py-0 text-[0.8em] leading-normal">{INTRO.key}</Kbd> {INTRO.bodyAfter}
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          <dl aria-label={USING.keysLabel} className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2 font-sans">
            {USING.keys.map((k) => (
              <div key={`${k.how}-${k.key}`} className="contents">
                <dt className="flex items-baseline gap-2 font-semibold">
                  {k.how} <Kbd>{k.key}</Kbd>
                </dt>
                <dd className="text-muted">{k.result}</dd>
              </div>
            ))}
          </dl>
          <p>
            {USING.paragraphs[0]} {USING.keysEnd}
          </p>
        </div>
        {/* Phones only: the download is for a Mac, so offer to send the page there. */}
        <SendToMac className="mt-6 md:hidden" />
      </div>
    </section>
  );
}
