import { Chapter } from "@/components/Chapter";
import { QUESTIONS } from "@/lib/content";
import { SITE } from "@/lib/site";

export function Questions() {
  return (
    <Chapter id="faq" title={QUESTIONS.title} className="pb-24 pt-20 sm:pb-32 sm:pt-28">
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
