import { Chapter } from "@/components/Chapter";
import { DownloadButton } from "@/components/DownloadButton";
import { Kbd } from "@/components/Kbd";
import { INSTALL_GUIDE, INTRO, USING } from "@/lib/content";
import { SITE } from "@/lib/site";

// After the dark band, back on paper: the four steps, numbered, the keys, then the download.
export function Install() {
  return (
    <Chapter id="install" title={INSTALL_GUIDE.title} wide className="pt-20 sm:pt-28">
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
      {/* The keys you'll use from then on, as big as keys. */}
      <dl aria-label={USING.keysLabel} className="mt-14 grid gap-x-10 gap-y-6 font-sans sm:grid-cols-3 lg:grid-cols-4">
        {USING.keys.map((k) => (
          <div key={`${k.how}-${k.key}`}>
            <dt className="flex items-center gap-3 text-[1.1rem] font-semibold">
              {k.how}
              <Kbd className="px-2.5 py-1 text-[1rem]">{k.key}</Kbd>
            </dt>
            <dd className="mt-2 text-muted">{k.result}</dd>
          </div>
        ))}
      </dl>
      <div data-cta className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3">
        <DownloadButton />
        <p className="font-sans text-muted">
          {INTRO.release} {INTRO.requirement}
        </p>
      </div>
    </Chapter>
  );
}
