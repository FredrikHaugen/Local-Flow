import { INSTALL_GUIDE, QUESTIONS, WORDS } from "@/lib/content";
import { SITE } from "@/lib/site";

function Disclosure({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="border-t border-border">
      <summary className="faq-q flex min-h-14 cursor-pointer items-center justify-between gap-6 py-3 text-[1.2rem] font-semibold">
        {q}
        <span aria-hidden="true" className="faq-icon text-xl leading-none text-muted">
          +
        </span>
      </summary>
      <div className="pb-5 pr-8">{children}</div>
    </details>
  );
}

// Practical questions first. The speech
// models, the requirements and the checksum live here too: they matter once, when you decide.
export function Questions() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-6 px-4 pb-4 pt-24 sm:px-6 sm:pb-8 sm:pt-32">
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
        <div className="border-b border-border">
          {QUESTIONS.items.map((item) => (
            <Disclosure key={item.q} q={item.q}>
              <p>{item.a}</p>
            </Disclosure>
          ))}
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
    </section>
  );
}
