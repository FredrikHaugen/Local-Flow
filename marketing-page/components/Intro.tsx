import { DownloadButton } from "@/components/DownloadButton";
import { Kbd } from "@/components/Kbd";
import { SendToMac } from "@/components/SendToMac";
import { Take } from "@/components/Take";
import { INTRO } from "@/lib/content";

// The first screen: one line and the download, then one take from speech to pasted text. The keys
// wait next to the install steps, the speed among the questions.
export function Intro() {
  return (
    <section id="top" aria-labelledby="top-title" className="px-4 pt-8 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-5xl">
        <h1 id="top-title" className="text-balance text-[clamp(2.5rem,1.4rem+4.4vw,5.2rem)] leading-[1.02] tracking-[-0.02em]">
          {INTRO.title}
        </h1>
        <div data-cta className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
          <DownloadButton />
          <p className="font-sans text-[0.95rem] text-muted">{INTRO.requirement}</p>
        </div>

        <Take />
        <p className="mt-10 max-w-3xl text-[clamp(1.3rem,1.1rem+0.9vw,1.85rem)] leading-[1.35]">
          {INTRO.bodyBefore} <Kbd className="py-0 text-[0.75em] leading-normal">{INTRO.key}</Kbd> {INTRO.bodyAfter}
        </p>

        {/* Phones only: the download is for a Mac, so offer to send the page there. */}
        <SendToMac className="mt-6 md:hidden" />
      </div>
    </section>
  );
}
