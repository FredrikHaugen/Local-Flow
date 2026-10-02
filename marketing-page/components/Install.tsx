import { Chapter } from "@/components/Chapter";
import { INSTALL_GUIDE } from "@/lib/content";
import { SITE } from "@/lib/site";

// The end of the page: the four steps read as one short paragraph, then the download.
export function Install() {
  return (
    <Chapter id="install" title={INSTALL_GUIDE.title} wide className="border-t border-border pb-24 pt-20 sm:pb-32 sm:pt-28">
      {/* The steps as one sentence: a real list for screen readers, read as prose on screen. */}
      <ol className="mt-6 max-w-4xl text-[clamp(1.4rem,1.1rem+1.2vw,2.1rem)] leading-[1.3] tracking-[-0.01em]">
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
        className="mt-12 inline-flex min-h-14 items-center rounded-md bg-foreground px-7 font-sans text-[1.15rem] font-semibold text-background transition-opacity hover:opacity-90"
      >
        {INSTALL_GUIDE.download}
      </a>
    </Chapter>
  );
}
