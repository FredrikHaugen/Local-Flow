import { Chapter } from "@/components/Chapter";
import { DownloadButton } from "@/components/DownloadButton";
import { INSTALL_GUIDE, INTRO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The page ends on a decision: what peluni is, at display size, the download, what your Mac needs, and
// the four install steps as one small strip. The plain label stays for screen readers.
export function Install() {
  return (
    <Chapter id="install" title={INSTALL_GUIDE.title} wide hiddenTitle className="pb-12 pt-24 sm:pb-16 sm:pt-32">
      <p className="max-w-4xl text-balance text-[clamp(2.2rem,1.4rem+3.2vw,4.25rem)] leading-[1.06] tracking-[-0.02em]">{INTRO.summary}</p>
      <div data-cta className="mt-10">
        <DownloadButton large />
        <p className="mt-4 font-sans text-[0.95rem] text-muted">
          {INTRO.release} {INSTALL_GUIDE.requirements.slice(0, 2).map((r) => `${r.title}.`).join(" ")}
        </p>
      </div>
      <ol className="mt-14 grid gap-x-10 gap-y-4 border-t border-border pt-6 font-sans text-[0.95rem] text-muted sm:grid-cols-2 lg:grid-cols-4">
        {INSTALL_GUIDE.steps.map((step, i) => (
          <li key={step.before} className="grid grid-cols-[1.5rem_1fr]">
            <span aria-hidden="true" className="font-semibold text-foreground">
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
    </Chapter>
  );
}
