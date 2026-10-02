import { Kbd } from "@/components/Kbd";
import { INSTALL_GUIDE, QUESTIONS, USING, WORDS } from "@/lib/content";
import { SITE } from "@/lib/site";

function Answer({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 break-inside-avoid">
      <h3 className="font-sans text-[1.1rem] font-semibold leading-snug">{q}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

// After the download, everything answered in the open, in two flowing columns: the keys first, then the practical
// questions, then the reference detail (speech models, requirements, the checksum).
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
        <div className="gap-x-12 sm:columns-2">
          <Answer q={USING.keysTitle}>
            <dl aria-label={USING.keysLabel} className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1.5 font-sans">
              {USING.keys.map((k) => (
                <div key={`${k.how}-${k.key}`} className="contents">
                  <dt className="flex items-baseline gap-2 font-semibold">
                    {k.how} <Kbd>{k.key}</Kbd>
                  </dt>
                  <dd className="text-muted">{k.result}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3">
              {USING.paragraphs[0]} {USING.keysEnd}
            </p>
          </Answer>
          {QUESTIONS.items.map((item) => (
            <Answer key={item.q} q={item.q}>
              <p>{item.a}</p>
            </Answer>
          ))}
          <Answer q={WORDS.modelsTitle}>
            <p>{WORDS.modelsBody}</p>
            <ul aria-label={WORDS.modelsTitle} className="mt-3 space-y-1">
              {WORDS.models.map((m) => (
                <li key={m.name}>
                  <span className="font-semibold">{m.name}</span>, <span className="tabular-nums">{m.size}</span>:{" "}
                  <span className="text-muted">{m.note}</span>
                </li>
              ))}
            </ul>
          </Answer>
          <Answer q={INSTALL_GUIDE.requirementsTitle}>
            <div className="space-y-2">
              {INSTALL_GUIDE.requirements.map((r) => (
                <p key={r.title}>
                  <span className="font-semibold">{r.title}</span>. <span>{r.detail}</span>
                </p>
              ))}
            </div>
          </Answer>
          <Answer q={INSTALL_GUIDE.checkTitle}>
            <p>{INSTALL_GUIDE.checksumBody}</p>
            <pre className="mt-3 whitespace-pre-wrap break-all rounded-md border border-border bg-card px-4 py-3 font-mono text-[0.85rem]">
              <code>{INSTALL_GUIDE.checksumCommand}</code>
            </pre>
          </Answer>
        </div>
      </div>
    </section>
  );
}
