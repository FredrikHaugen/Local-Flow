import { DownloadButton } from "@/components/DownloadButton";
import { Kbd } from "@/components/Kbd";
import { SendToMac } from "@/components/SendToMac";
import { Take } from "@/components/Take";
import { INTRO, QUESTIONS, USING } from "@/lib/content";

// The first screen: how you use it as the headline, what happens when you let go, the download, then
// Reminders mid-dictation. What peluni is, in one line, closes the page next to the second download.
export function Intro() {
  return (
    <section id="top" aria-labelledby="top-title" className="px-4 pt-8 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-5xl">
        <h1 id="top-title" className="text-balance text-[clamp(2.5rem,1.4rem+4.4vw,5.2rem)] leading-[1.02] tracking-[-0.02em]">
          {INTRO.bodyBefore} <Kbd className="px-[0.3em]! py-[0.1em]! align-[0.2em] font-sans! text-[0.4em]! font-medium leading-none!">{INTRO.key}</Kbd> {INTRO.bodyAfter}
        </h1>
        <p className="mt-6 max-w-2xl text-[clamp(1.2rem,1.05rem+0.6vw,1.5rem)] leading-[1.4]">{INTRO.bodyMore}</p>
        <div data-cta className="mt-8">
          <DownloadButton />
        </div>

        <Take />
        {/* Under the scene: how fast it is, and the other way to hold the key. */}
        <div className="mt-6 grid max-w-4xl gap-x-12 gap-y-3 text-[1.05rem] text-muted sm:grid-cols-2">
          <p>{USING.paragraphs[0]}</p>
          <p>{QUESTIONS.items[0].a}</p>
        </div>

        {/* Phones only: the download is for a Mac, so offer to send the page there. */}
        <SendToMac className="mt-6 md:hidden" />
      </div>
    </section>
  );
}
