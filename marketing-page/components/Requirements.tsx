import { Section } from "@/components/Section";
import { FINAL_CTA, HERO_FINEPRINT, KICKERS, REQUIREMENTS, SITE } from "@/lib/site";

export function Requirements() {
  return (
    <Section id="requirements" kicker={KICKERS.requirements} title="Requirements">
      <dl className="grid overflow-hidden rounded-3xl border border-border sm:grid-cols-2">
        {REQUIREMENTS.map((req, i) => (
          <div
            key={req.title}
            className={`bg-card p-6 sm:p-8 ${i > 0 ? "border-t border-border" : ""} ${
              i === 1 ? "sm:border-l sm:border-t-0" : ""
            } ${i === 3 ? "sm:border-l" : ""}`}
          >
            <dt className="font-display text-xl font-bold tracking-tight">{req.title}</dt>
            <dd className="mt-2 leading-relaxed text-muted">{req.detail}</dd>
          </div>
        ))}
      </dl>

      <div className="surface-accent relative mt-6 overflow-hidden rounded-[2rem] bg-accent p-8 text-accent-foreground sm:p-14">
        <svg
          aria-hidden="true"
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
          className="absolute -right-10 bottom-0 hidden h-40 w-[34rem] opacity-25 sm:block"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          {Array.from({ length: 34 }, (_, i) => {
            const h = 12 + Math.abs(Math.sin(i * 0.9) * 46) + (i % 3) * 8;
            const x = 6 + i * 11.6;
            return <path key={i} d={`M${x} ${60 - h / 2}v${h}`} />;
          })}
        </svg>
        <div className="relative max-w-xl">
          <p className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-5xl">{FINAL_CTA.title}</p>
          <p className="mt-4 text-lg opacity-90">{FINAL_CTA.body}</p>
          <a
            href={SITE.releasesUrl}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-ink-foreground transition-transform hover:-translate-y-0.5"
          >
            Download {SITE.name}
          </a>
          <p className="mt-4 font-mono text-xs opacity-90">{HERO_FINEPRINT}</p>
        </div>
      </div>
    </Section>
  );
}
