import { Kbd } from "@/components/Kbd";
import { Inlines } from "@/components/PageBody";
import { SendToMac } from "@/components/SendToMac";
import { Take } from "@/components/Take";
import { INTRO } from "@/lib/content";

// The first screen: how you use it as the headline, what happens when you let go, where it stands (not
// released yet), then Reminders mid-dictation.
export function Intro() {
  return (
    <section id="top" aria-labelledby="top-title" className="px-4 pt-8 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-5xl">
        <h1 id="top-title" className="text-balance text-[clamp(2.5rem,1.4rem+4.4vw,5.2rem)] leading-[1.02] tracking-[-0.02em]">
          {INTRO.bodyBefore} <Kbd className="px-[0.3em]! py-[0.1em]! align-[0.2em] font-sans! text-[0.4em]! font-medium leading-none!">{INTRO.key}</Kbd> {INTRO.bodyAfter}
        </h1>
        <p className="mt-6 max-w-2xl text-[clamp(1.2rem,1.05rem+0.6vw,1.5rem)] leading-[1.4]">
          {INTRO.bodyMore}
        </p>
        <p data-status className="mt-8 max-w-2xl font-sans text-[1.1rem] leading-normal">
          <Inlines parts={INTRO.status} />
        </p>

        <Take />

        {/* Phones only: peluni is for a Mac, so offer to send the page there. */}
        <SendToMac className="mt-6 md:hidden" />
      </div>
    </section>
  );
}
