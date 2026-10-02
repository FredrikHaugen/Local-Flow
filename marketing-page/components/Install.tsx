import { Chapter } from "@/components/Chapter";
import { DownloadButton } from "@/components/DownloadButton";
import { INSTALL_GUIDE, INTRO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The closing beat, back on paper after the dark band: the four steps it takes, and the download right
// under them at full size.
export function Install() {
  return (
    <Chapter id="install" title={INSTALL_GUIDE.title} wide className="pb-8 pt-20 sm:pb-12 sm:pt-28">
      <ol className="mt-8 max-w-2xl space-y-4 text-[1.15rem] leading-snug">
        {INSTALL_GUIDE.steps.map((step, i) => (
          <li key={step.before} className="grid grid-cols-[1.75rem_1fr]">
            <span aria-hidden="true" className="font-sans font-semibold text-muted">
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
      <div data-cta className="mt-10">
        <DownloadButton large />
        <p className="mt-4 max-w-sm font-sans text-[0.95rem] text-muted">
          {INTRO.release} {INTRO.requirement}
        </p>
      </div>
    </Chapter>
  );
}
