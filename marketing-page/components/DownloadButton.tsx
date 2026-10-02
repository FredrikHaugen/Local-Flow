import { Logomark } from "@/components/Logomark";
import { INTRO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The page's one download button, the same at the top and at the end: the logomark on an ink key.
export function DownloadButton() {
  return (
    <a
      href={SITE.releasesUrl}
      className="inline-flex min-h-14 w-fit shrink-0 items-center gap-3 rounded-xl bg-foreground py-2 pl-2 pr-6 font-sans text-[1.1rem] font-semibold text-background transition-opacity hover:opacity-90"
    >
      <Logomark className="h-10 w-10" />
      {INTRO.download}
    </a>
  );
}
