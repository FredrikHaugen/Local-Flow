import { Marked } from "@/components/Brand";
import { FINAL_CTA, HERO_FINEPRINT, SITE } from "@/lib/site";

// The closing teal band: one big line, the download, and the reasons it's safe to open.
export function FinalCta() {
  return (
    <section
      id="get"
      aria-labelledby="get-title"
      className="surface-accent wallpaper relative scroll-mt-16 overflow-hidden text-accent-foreground"
    >
      {/* The one key, huge, as the band's object. */}
      <span aria-hidden="true" className="cta-key font-display">
        ⌥
      </span>
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-28">
        <h2
          id="get-title"
          className="font-display max-w-[12ch] text-[clamp(4rem,17vw,9rem)] font-extrabold leading-[0.88] tracking-[-0.01em]"
        >
          <Marked text={FINAL_CTA.title} mark={FINAL_CTA.mark} />
        </h2>
        <p className="mt-8 max-w-lg text-lg sm:text-xl">{FINAL_CTA.body}</p>
        <div data-cta className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={SITE.releasesUrl}
              className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-4 font-medium text-ink-foreground shadow-[0_14px_30px_-14px_rgb(0_0_0/0.7)] transition-transform hover:-translate-y-0.5"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v12M6 11l6 6 6-6M5 20h14" />
              </svg>
              Download {SITE.name}
            </a>
            <a
              href={SITE.repoUrl}
              className="inline-flex items-center gap-2 rounded-full border-2 border-accent-foreground/70 px-6 py-[0.875rem] font-medium transition-colors hover:border-accent-foreground hover:bg-accent-foreground/10"
            >
              {FINAL_CTA.secondary}
            </a>
          </div>
          <p className="mt-4 font-mono text-xs">{HERO_FINEPRINT}</p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            {FINAL_CTA.trust.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full bg-ink text-ink-foreground">
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8.5l3 3 7-7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
