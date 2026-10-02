import { Chapter } from "@/components/Chapter";
import { INSTALL_GUIDE } from "@/lib/content";
import { SITE } from "@/lib/site";

// The quiet end of the pitch: the real steps, what your Mac needs, and the download.
export function Install() {
  return (
    <Chapter id="install" title={INSTALL_GUIDE.title} className="pt-20 sm:pt-28">
      <ol className="mt-6 list-decimal space-y-3 pl-6 marker:font-sans marker:font-semibold">
        {INSTALL_GUIDE.steps.map((step) => (
          <li key={step.before} className="pl-1">
            {step.before}
            {step.link && (
              <>
                {" "}
                <a href={SITE.releasesUrl} className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
                  {step.link}
                </a>{" "}
                {step.after}
              </>
            )}
          </li>
        ))}
      </ol>

      <h3 className="mt-10 text-[1.2rem]">{INSTALL_GUIDE.requirementsTitle}</h3>
      <div className="mt-2 space-y-1">
        {INSTALL_GUIDE.requirements.map((r) => (
          <p key={r.title}>
            <span className="font-semibold">{r.title}</span>. <span className="text-muted">{r.detail}</span>
          </p>
        ))}
      </div>

      <a
        href={SITE.releasesUrl}
        className="mt-8 inline-flex min-h-12 items-center rounded-md bg-foreground px-5 font-sans text-[1.05rem] font-semibold text-background transition-opacity hover:opacity-90"
      >
        {INSTALL_GUIDE.download}
      </a>

      <details className="mt-10 border-t border-border pt-4">
        <summary className="faq-q flex cursor-pointer items-center justify-between font-sans font-semibold">
          {INSTALL_GUIDE.checkTitle}
          <span aria-hidden="true" className="faq-icon text-xl leading-none text-muted">
            +
          </span>
        </summary>
        <p className="mt-3">{INSTALL_GUIDE.checksumBody}</p>
        <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-card px-4 py-3 font-mono text-[0.9rem]">
          <code>{INSTALL_GUIDE.checksumCommand}</code>
        </pre>
      </details>
    </Chapter>
  );
}
