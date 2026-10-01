import { Section } from "@/components/Section";
import { FAQ, KICKERS, SITE } from "@/lib/site";

// Native <details>: keyboard and screen-reader friendly, no JavaScript.
export function Faq() {
  return (
    <Section id="faq" kicker={KICKERS.faq} title={FAQ.title} mark={FAQ.mark} intro={FAQ.intro}>
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <aside className="surface-ink self-start rounded-3xl bg-ink p-6 text-ink-foreground lg:sticky lg:top-24">
          <h3 className="font-display text-3xl font-extrabold">{FAQ.askTitle}</h3>
          <p className="mt-2 leading-relaxed text-ink-muted">{FAQ.askBody}</p>
          <a
            href={`${SITE.repoUrl}/issues`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-accent px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            {FAQ.askLink}
            <span aria-hidden="true">→</span>
          </a>
        </aside>
        <div className="border-b border-border">
          {FAQ.items.map((item, i) => (
            <details key={item.q} open={i === 0} className="border-t border-border">
              <summary className="faq-q flex cursor-pointer items-center justify-between gap-6 py-5 text-lg font-semibold">
                {item.q}
                <span
                  aria-hidden="true"
                  className="faq-icon grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-xl leading-none"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-6 pr-12 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
