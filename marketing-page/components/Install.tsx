import { Chapter } from "@/components/Chapter";
import { Logomark } from "@/components/Logomark";
import { INSTALL_GUIDE } from "@/lib/content";
import { SITE } from "@/lib/site";

// The end of the page, on the dark band: the four steps as one short paragraph, then the download.
export function Install() {
  return (
    <Chapter id="install" title={INSTALL_GUIDE.title} wide className="band-dark pb-24 pt-4 sm:pb-32">
      {/* The steps as one sentence: a real list for screen readers, read as prose on screen. */}
      <ol className="mt-6 max-w-4xl text-[clamp(1.2rem,1.05rem+0.6vw,1.5rem)] leading-[1.45]">
        {INSTALL_GUIDE.steps.map((step, i) => (
          <li key={step.before} className="inline">
            {step.before}
            {step.link && (
              <>
                {" "}
                <a href={SITE.releasesUrl} className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
                  {step.link}
                </a>
                {step.after}
              </>
            )}
            {i < INSTALL_GUIDE.steps.length - 1 ? " " : ""}
          </li>
        ))}
      </ol>
      <a
        href={SITE.releasesUrl}
        className="mt-12 inline-flex min-h-16 items-center gap-3 rounded-xl bg-foreground py-3 pl-3 pr-7 font-sans text-[1.2rem] font-semibold text-background transition-opacity hover:opacity-90"
      >
        <Logomark className="h-10 w-10" />
        {INSTALL_GUIDE.download}
      </a>
    </Chapter>
  );
}
