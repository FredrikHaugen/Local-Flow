import { DownloadButton } from "@/components/DownloadButton";
import { SendToMac } from "@/components/SendToMac";
import { Take } from "@/components/Take";
import { INTRO } from "@/lib/content";

// The first screen: one line and the download, then Reminders mid-dictation. How to use it ("hold
// Right ⌥ and talk") is the page's closing line, next to the download.
export function Intro() {
  return (
    <section id="top" aria-labelledby="top-title" className="px-4 pt-8 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-5xl">
        <h1 id="top-title" className="text-balance text-[clamp(2.5rem,1.4rem+4.4vw,5.2rem)] leading-[1.02] tracking-[-0.02em]">
          {INTRO.title}
        </h1>
        <div data-cta className="mt-8">
          <DownloadButton />
        </div>

        <Take />

        {/* Phones only: the download is for a Mac, so offer to send the page there. */}
        <SendToMac className="mt-6 md:hidden" />
      </div>
    </section>
  );
}
