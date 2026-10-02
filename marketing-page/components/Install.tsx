import { Chapter } from "@/components/Chapter";
import { INSTALL_GUIDE } from "@/lib/content";
import { SITE } from "@/lib/site";

// The end of the page: four short steps in a row and the download, nothing else.
export function Install() {
  return (
    <Chapter id="install" title={INSTALL_GUIDE.title} wide className="border-t border-border pb-24 pt-20 sm:pb-32 sm:pt-28">
      <ol className="mt-8 grid gap-x-10 gap-y-6 text-[1.15rem] leading-snug sm:grid-cols-2 lg:grid-cols-4">
        {INSTALL_GUIDE.steps.map((step, i) => (
          <li key={step.before} className="flex gap-3">
            <span aria-hidden="true" className="font-sans text-base font-semibold text-muted">
              {i + 1}
            </span>
            <span>
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
            </span>
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
