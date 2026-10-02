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
        <div data-cta className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1 id="top-title" className="max-w-3xl text-[clamp(2.3rem,1.5rem+3vw,3.6rem)] leading-[1.04] tracking-[-0.02em]">
            {INTRO.title}
          </h1>
          <a
            href={SITE.releasesUrl}
            className="inline-flex min-h-12 w-fit shrink-0 items-center rounded-md bg-foreground px-5 font-sans text-[1.05rem] font-semibold text-background transition-opacity hover:opacity-90"
          >
            {INTRO.download}
          </a>
        </div>

        <DesktopScene caption={
          <>
            {INTRO.bodyBefore} <Kbd className="py-0 text-[0.8em] leading-normal">{INTRO.key}</Kbd> {INTRO.bodyAfter}
          </>
        } />

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          <dl aria-label={USING.keysLabel} className="space-y-2 font-sans">
            {USING.keys.map((k) => (
              <div key={`${k.how}-${k.key}`} className="flex flex-wrap items-baseline gap-x-3">
                <dt className="flex min-w-[10.5rem] items-baseline gap-2 font-semibold">
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
