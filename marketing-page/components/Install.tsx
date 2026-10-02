import { Chapter } from "@/components/Chapter";
import { DownloadButton } from "@/components/DownloadButton";
import { Kbd } from "@/components/Kbd";
import { INSTALL_GUIDE, INTRO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The page ends on a decision: how you use it, at display size, the download, what your Mac needs, and
// the four install steps as one small strip. The plain label stays for screen readers.
export function Install() {
  return (
    <Chapter id="install" title={INSTALL_GUIDE.title} wide hiddenTitle className="pb-12 pt-24 sm:pb-16 sm:pt-32">
      <p className="max-w-4xl text-balance text-[clamp(2.4rem,1.5rem+3.8vw,4.75rem)] leading-[1.04] tracking-[-0.02em]">
        {INTRO.bodyBefore} <Kbd className="px-2 py-0 align-[0.08em] text-[0.62em] leading-normal">{INTRO.key}</Kbd> {INTRO.bodyAfter}
      </p>
      <p className="mt-6 max-w-2xl text-[clamp(1.2rem,1.05rem+0.6vw,1.5rem)] leading-[1.4]">{INTRO.bodyMore}</p>
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
