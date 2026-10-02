import { Chapter } from "@/components/Chapter";
import { MacWindow } from "@/components/MacWindow";
import { INSTALL_GUIDE } from "@/lib/content";
import { SITE } from "@/lib/site";

// The setup window once you're through it: both permissions granted and the model on disk.
function SetupMock() {
  return (
    <MacWindow title={INSTALL_GUIDE.setup.title} className="window-shadow">
      <dl className="divide-y divide-border">
        {INSTALL_GUIDE.setup.rows.map((row) => (
          <div key={row.name} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <dt className="whitespace-nowrap font-semibold">{row.name}</dt>
            <dd className="flex items-center gap-2 whitespace-nowrap text-sm text-muted">
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 text-foreground" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3.5 8.5 3 3 6-7" />
              </svg>
              {row.state}
            </dd>
          </div>
        ))}
      </dl>
    </MacWindow>
  );
}

export function Install() {
  return (
    <Chapter id="install" title={INSTALL_GUIDE.title} wide className="pt-20 sm:pt-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] lg:gap-14">
        <div>
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
          <dl className="mt-3 grid gap-x-8 gap-y-3 font-sans text-[0.95rem] sm:grid-cols-2">
            {INSTALL_GUIDE.requirements.map((r) => (
              <div key={r.title}>
                <dt className="font-semibold">{r.title}</dt>
                <dd className="text-muted">{r.detail}</dd>
              </div>
            ))}
          </dl>

          <details className="mt-8 border-t border-border pt-4">
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
        </div>
        <div className="lg:pt-8">
          <SetupMock />
        </div>
      </div>
    </Chapter>
  );
}
