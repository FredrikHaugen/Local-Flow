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

// After the download, everything answered in the open: two columns at a reading measure, speed first,
// then the practical questions, then the reference detail (speech models, requirements, the checksum).
export function Questions() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-6 px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
          <h2 id="faq-title" className="text-[clamp(2rem,1.5rem+2vw,3rem)] leading-[1.1] tracking-[-0.015em]">
            {QUESTIONS.title}
          </h2>
          <p>
            {QUESTIONS.moreBefore}
            <a href={`${SITE.repoUrl}/issues`} className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
              {QUESTIONS.moreLink}
            </a>
            {QUESTIONS.moreAfter}
          </p>
        </div>
        <div className="mt-12 gap-x-16 sm:columns-2">
          <Answer q={USING.speedTitle}>
            <p>
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
            <div className="mt-3 overflow-x-auto">
            <table aria-label={WORDS.modelsTitle} className="w-full font-sans text-[0.95rem]">
              <tbody>
                {WORDS.models.map((m) => (
                  <tr key={m.name} className="border-t border-border">
                    <th scope="row" className="py-2 pr-3 text-left font-semibold">
                      {m.name}
                    </th>
                    <td className="py-2 pr-3 text-right tabular-nums">{m.size}</td>
                    <td className="py-2 text-muted">{m.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
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
