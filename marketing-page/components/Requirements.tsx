import { FINAL_CTA, HERO_FINEPRINT, REQUIREMENTS, SITE } from "@/lib/site";

// Skyline bars for the closing band, echoing the hero wallpaper.
const BARS = Array.from({ length: 72 }, (_, i) => 0.15 + 0.85 * Math.abs(Math.sin(i * 0.43) * Math.cos(i * 0.17 + 0.6)));

// The closing orange band: the last call to download, with the requirements as one strip right under it.
export function Requirements() {
  return (
    <section
      id="requirements"
      aria-labelledby="requirements-title"
      className="surface-accent wallpaper relative scroll-mt-16 overflow-hidden text-accent-foreground"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 720 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-10 h-[45%] w-full opacity-[0.14]"
        fill="currentColor"
      >
        {BARS.map((h, i) => (
          <rect key={i} x={i * 10 + 2} y={100 - h * 100} width="5" height={h * 200} rx="2.5" />
        ))}
      </svg>
      <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-20 sm:px-6 sm:pb-16 sm:pt-28">
        <p className="font-display max-w-[12ch] text-[clamp(3rem,9vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.045em]">
          {FINAL_CTA.title}
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <p className="max-w-lg text-lg sm:text-xl">{FINAL_CTA.body}</p>
          <div data-cta>
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

        <div className="mt-16 rounded-3xl bg-ink p-6 text-ink-foreground sm:mt-24 sm:p-8">
          <h2 id="requirements-title" className="font-display text-xl font-bold tracking-tight">
            Requirements
          </h2>
          <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {REQUIREMENTS.map((req) => (
              <div key={req.title} className="border-t border-ink-border pt-4">
                <dt className="font-semibold leading-snug">{req.title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">{req.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
