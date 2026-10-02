import { Chapter } from "@/components/Chapter";
import { INSTALL_GUIDE, QUESTIONS, WORDS } from "@/lib/content";
import { SITE } from "@/lib/site";

function Disclosure({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="border-t border-border">
      <summary className="faq-q flex min-h-14 cursor-pointer items-center justify-between gap-6 py-3 font-sans text-[1.05rem] font-semibold">
        {q}
        <span aria-hidden="true" className="faq-icon text-xl leading-none text-muted">
          +
        </span>
      </summary>
      <div className="pb-5 pr-8">{children}</div>
    </details>
  );
}

// Practical questions first, in two columns so the list reads as a page, not a wall. The speech
// models, the requirements and the checksum live here too: they matter once, when you decide.
export function Questions() {
  return (
    <Chapter id="faq" title={QUESTIONS.title} wide className="pb-20 pt-20 sm:pb-28 sm:pt-28">
      <div className="mt-6 grid gap-x-12 lg:grid-cols-2">
        <div className="border-b border-border">
          {QUESTIONS.items.slice(0, 5).map((item) => (
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
        </div>
        <div className="border-b border-border">
          {QUESTIONS.items.slice(5).map((item) => (
            <Disclosure key={item.q} q={item.q}>
              <p>{item.a}</p>
            </Disclosure>
          ))}
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
