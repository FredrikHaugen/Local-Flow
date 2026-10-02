import { Chapter } from "@/components/Chapter";
import { INSTALL_GUIDE } from "@/lib/content";
import { SITE } from "@/lib/site";

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

      <p className="mt-8">{INSTALL_GUIDE.checksumBody}</p>
      <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-card px-4 py-3 font-mono text-[0.9rem]">
        <code>{INSTALL_GUIDE.checksumCommand}</code>
      </pre>

      <h3 className="mt-12 text-[1.35rem]">{INSTALL_GUIDE.requirementsTitle}</h3>
      <dl className="mt-4 border-t border-border font-sans">
        {INSTALL_GUIDE.requirements.map((r) => (
          <div key={r.title} className="grid gap-1 border-b border-border py-3 sm:grid-cols-[16rem_1fr] sm:gap-6">
            <dt className="font-semibold">{r.title}</dt>
            <dd className="text-muted">{r.detail}</dd>
          </div>
        ))}
      </dl>
    </Chapter>
  );
}
