import { Chapter } from "@/components/Chapter";
import { INSTALL_GUIDE, QUESTIONS } from "@/lib/content";
import { SITE } from "@/lib/site";

export function Questions() {
  return (
    <Chapter id="faq" title={QUESTIONS.title} className="pb-20 pt-20 sm:pb-28 sm:pt-28">
      <div className="mt-6 border-b border-border">
        {QUESTIONS.items.map((item) => (
          <details key={item.q} className="border-t border-border">
            <summary className="faq-q flex min-h-14 cursor-pointer items-center justify-between gap-6 py-3 font-sans text-[1.05rem] font-semibold">
              {item.q}
              <span aria-hidden="true" className="faq-icon text-xl leading-none text-muted">
                +
              </span>
            </summary>
            <p className="pb-5 pr-8">{item.a}</p>
          </details>
        ))}
        {/* What used to be the install section's fine print, as two more questions. */}
        <details className="border-t border-border">
          <summary className="faq-q flex min-h-14 cursor-pointer items-center justify-between gap-6 py-3 font-sans text-[1.05rem] font-semibold">
            {INSTALL_GUIDE.requirementsTitle}
            <span aria-hidden="true" className="faq-icon text-xl leading-none text-muted">
              +
            </span>
          </summary>
          <div className="space-y-2 pb-5 pr-8">
            {INSTALL_GUIDE.requirements.map((r) => (
              <p key={r.title}>
                <span className="font-semibold">{r.title}</span>. <span>{r.detail}</span>
              </p>
            ))}
          </div>
        </details>
        <details className="border-t border-border">
          <summary className="faq-q flex min-h-14 cursor-pointer items-center justify-between gap-6 py-3 font-sans text-[1.05rem] font-semibold">
            {INSTALL_GUIDE.checkTitle}
            <span aria-hidden="true" className="faq-icon text-xl leading-none text-muted">
              +
            </span>
          </summary>
          <p className="pr-8">{INSTALL_GUIDE.checksumBody}</p>
          <pre className="mb-5 mt-3 overflow-x-auto rounded-md border border-border bg-card px-4 py-3 font-mono text-[0.9rem]">
            <code>{INSTALL_GUIDE.checksumCommand}</code>
          </pre>
        </details>
      </div>
      <p className="mt-6">
        {QUESTIONS.moreBefore}
        <a href={`${SITE.repoUrl}/issues`} className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
          {QUESTIONS.moreLink}
        </a>
        {QUESTIONS.moreAfter}
      </p>
    </Chapter>
  );
}
