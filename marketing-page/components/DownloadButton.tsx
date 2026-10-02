import { INTRO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The page's one download button, the same at the top and at the end: a plain ink key.
export function DownloadButton() {
  return (
    <a
      href={SITE.releasesUrl}
      className="inline-flex min-h-13 w-fit shrink-0 items-center rounded-lg bg-foreground px-6 font-sans text-[1.1rem] font-semibold text-background transition-opacity hover:opacity-90"
    >
      {INTRO.download}
    </a>
  );
}
