import { INSTALL_GUIDE, QUESTIONS, WORDS } from "@/lib/content";
import { SITE } from "@/lib/site";

function Disclosure({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="border-t border-border">
      <summary className="faq-q flex min-h-14 cursor-pointer items-center justify-between gap-6 py-3 font-sans text-[1.1rem] font-semibold">
        {q}
        <span aria-hidden="true" className="faq-icon text-xl leading-none text-muted">
          +
        </span>
      </summary>
      <div className="pb-5 pr-8">{children}</div>
    </details>
  );
}

// After the download: the practical questions answered in the open, then the reference detail (speech
// models, requirements, the checksum) folded away, since it matters once, when you decide.
export function Questions() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-6 px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
        <div>
          <h2 id="faq-title" className="text-[clamp(2rem,1.5rem+2vw,3rem)] leading-[1.1] tracking-[-0.015em]">
            {QUESTIONS.title}
          </h2>
          <p className="mt-4">
            {QUESTIONS.moreBefore}
            <a href={`${SITE.repoUrl}/issues`} className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
              {QUESTIONS.moreLink}
            </a>
            {QUESTIONS.moreAfter}
          </p>
        </div>
        <div>
          <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {QUESTIONS.items.map((item) => (
              <div key={item.q}>
                <h3 className="font-sans text-[1.1rem] font-semibold leading-snug">{item.q}</h3>
                <p className="mt-2">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 border-b border-border">
          <Disclosure q={WORDS.modelsTitle}>
            <p>{WORDS.modelsBody}</p>
            <ul aria-label={WORDS.modelsTitle} className="mt-3 space-y-1">
              {WORDS.models.map((m) => (
                <li key={m.name}>
                  <span className="font-semibold">{m.name}</span>, <span className="tabular-nums">{m.size}</span>:{" "}
                  <span className="text-muted">{m.note}</span>
                </li>
              ))}
            </ul>
          </Disclosure>
          <Disclosure q={INSTALL_GUIDE.requirementsTitle}>
            <div className="space-y-2">
              {INSTALL_GUIDE.requirements.map((r) => (
                <p key={r.title}>
                  <span className="font-semibold">{r.title}</span>. <span>{r.detail}</span>
                </p>
              ))}
            </div>
          </Disclosure>
          <Disclosure q={INSTALL_GUIDE.checkTitle}>
            <p>{INSTALL_GUIDE.checksumBody}</p>
            <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-card px-4 py-3 font-mono text-[0.9rem]">
              <code>{INSTALL_GUIDE.checksumCommand}</code>
            </pre>
          </Disclosure>
          </div>
        </div>
      </div>
    </section>
  );
}
