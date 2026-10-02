import { Chapter } from "@/components/Chapter";
import { Kbd } from "@/components/Kbd";
import { Logomark } from "@/components/Logomark";
import { INSTALL_GUIDE, INTRO, USING } from "@/lib/content";
import { SITE } from "@/lib/site";

// The end of the page, on the dark band: the four steps, numbered, the keys you will use, then the download.
export function Install() {
  return (
    <Chapter id="install" title={INSTALL_GUIDE.title} wide className="band-dark pb-24 pt-4 sm:pb-32">
      <ol className="mt-8 grid max-w-5xl gap-x-10 gap-y-6 text-[clamp(1.1rem,1rem+0.4vw,1.3rem)] leading-[1.4] sm:grid-cols-2 lg:grid-cols-4">
        {INSTALL_GUIDE.steps.map((step, i) => (
          <li key={step.before} className="border-t border-border pt-4">
            <span aria-hidden="true" className="block font-sans text-base font-semibold text-muted">
              {i + 1}
            </span>
            <span className="mt-2 block">
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
      <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <dl aria-label={USING.keysLabel} className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2 font-sans">
          {USING.keys.map((k) => (
            <div key={`${k.how}-${k.key}`} className="contents">
              <dt className="flex items-baseline gap-2 font-semibold">
                {k.how} <Kbd>{k.key}</Kbd>
              </dt>
              <dd className="text-muted">{k.result}</dd>
            </div>
          ))}
        </dl>
        <p>
          {USING.paragraphs[0]} {USING.keysEnd}
        </p>
      </div>
      <div data-cta className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
        <a
          href={SITE.releasesUrl}
          className="inline-flex min-h-16 items-center gap-3 rounded-xl bg-foreground py-3 pl-3 pr-7 font-sans text-[1.2rem] font-semibold text-background transition-opacity hover:opacity-90"
        >
          <Logomark className="h-10 w-10" />
          {INSTALL_GUIDE.download}
        </a>
        <p className="font-sans text-muted">
          {INTRO.release} {INTRO.requirement}
        </p>
      </div>
    </Chapter>
  );
}
