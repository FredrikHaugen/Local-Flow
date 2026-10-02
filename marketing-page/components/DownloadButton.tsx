import { INTRO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The page's one download button, the same at the top and at the end: a plain ink key, larger as the
// page's closing beat.
export function DownloadButton({ large = false }: { large?: boolean }) {
  return (
    <a
      href={SITE.releasesUrl}
      className={`inline-flex w-fit shrink-0 items-center rounded-lg bg-foreground font-sans font-semibold text-background transition-opacity hover:opacity-90 ${large ? "min-h-18 px-9 text-[1.5rem]" : "min-h-13 px-6 text-[1.1rem]"}`}
    >
      {INTRO.download}
    </a>
  );
}
