import { Section } from "@/components/Section";
import { FINAL_CTA, HERO_FINEPRINT, KICKERS, REQUIREMENTS, SITE } from "@/lib/site";

// Skyline bars for the closing band, echoing the hero wallpaper.
const BARS = Array.from({ length: 72 }, (_, i) => 0.15 + 0.85 * Math.abs(Math.sin(i * 0.43) * Math.cos(i * 0.17 + 0.6)));

function ClosingBand() {
  return (
    <div className="surface-accent wallpaper relative mt-24 overflow-hidden text-accent-foreground sm:mt-32">
      <svg
        aria-hidden="true"
        viewBox="0 0 720 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 w-full opacity-[0.18]"
        fill="currentColor"
      >
        {BARS.map((h, i) => (
          <rect key={i} x={i * 10 + 2} y={200 - h * 200} width="5" height={h * 200} rx="2.5" />
        ))}
      </svg>
      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="font-display max-w-[12ch] text-[clamp(3rem,9vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.045em]">
          {FINAL_CTA.title}
        </p>
        <p className="mt-6 max-w-lg text-lg sm:text-xl">{FINAL_CTA.body}</p>
        <div className="mt-10">
          <a
            href={SITE.releasesUrl}
            className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-4 font-medium text-ink-foreground shadow-[0_14px_30px_-14px_rgb(0_0_0/0.7)] transition-transform hover:-translate-y-0.5"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v12M6 11l6 6 6-6M5 20h14" />
            </svg>
            Download {SITE.name}
          </a>
          <p className="mt-4 font-mono text-xs">{HERO_FINEPRINT}</p>
        </div>
      </div>
    </div>
  );
}

export function Requirements() {
  return (
    <Section id="requirements" kicker={KICKERS.requirements} title="Requirements" bleed={<ClosingBand />}>
      <dl className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
        {REQUIREMENTS.map((req, i) => (
          <div key={req.title} className="border-t-2 border-foreground pt-5 pb-8">
            <dt className="font-display text-xl font-bold leading-tight tracking-tight">
              <span aria-hidden="true" className="mb-2 block text-sm text-accent">
                0{i + 1}
              </span>
              <span>{req.title}</span>
            </dt>
            <dd className="mt-2 text-[0.95rem] leading-relaxed text-muted">{req.detail}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
