import { INSTALL_GUIDE, QUESTIONS, USING } from "@/lib/content";
import { SITE } from "@/lib/site";

function Answer({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 break-inside-avoid">
      <h3 className="font-sans text-[1.1rem] font-semibold leading-snug">{q}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

// After the download, the questions a buyer asks, answered in the open. The reference detail (model
// sizes, checking a download) lives in the README, one link away.
export function Questions() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-6 px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
          <h2 id="faq-title" className="text-[clamp(2rem,1.5rem+2vw,3rem)] leading-[1.1] tracking-[-0.015em]">
            {QUESTIONS.title}
          </h2>
          <p>
            {QUESTIONS.detailsBefore}
            <a href={`${SITE.repoUrl}#readme`} className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
              {QUESTIONS.detailsLink}
            </a>
            {QUESTIONS.detailsAfter} {QUESTIONS.moreBefore}
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
          <Answer q={INSTALL_GUIDE.requirementsTitle}>
            <div className="space-y-2">
              {INSTALL_GUIDE.requirements.map((r) => (
                <p key={r.title}>
                  <span className="font-semibold">{r.title}</span>. <span>{r.detail}</span>
                </p>
              ))}
            </div>
          </Answer>
        </div>
      </div>
    </section>
  );
}
