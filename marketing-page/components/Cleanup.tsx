import { Chapter } from "@/components/Chapter";
import { MoreLink } from "@/components/MoreLink";
import { CLEANUP_LEVELS } from "@/lib/content";

// One take at all four levels, read top to bottom: the raw transcript, then each level tidying a little more.
// Shown at once rather than behind a picker, so the differences sit next to each other: a plain ruled
// table on the page, so the hero stays the only window.
export function Cleanup() {
  return (
    <Chapter id="cleanup" title={CLEANUP_LEVELS.title} wide className="pt-24 sm:pt-32">
      <p className="mt-4 max-w-2xl">{CLEANUP_LEVELS.intro}</p>

      <ol aria-label={CLEANUP_LEVELS.legend} className="mt-12 border-y border-foreground/70 text-left">
        {CLEANUP_LEVELS.levels.map((level, i) => (
          <li
            key={level.id}
            data-out={level.id}
            className={`grid gap-3 py-7 sm:grid-cols-[12rem_1fr] sm:gap-10 ${i > 0 ? "border-t border-border" : ""}`}
          >
            <div className="font-sans">
              <p className="text-lg font-semibold text-foreground">
                {level.name}
                {level.id === CLEANUP_LEVELS.defaultLevel && (
                  <span className="ml-2 rounded-md bg-rec px-1.5 py-0.5 align-[0.1em] text-sm font-semibold text-[#171a18]">
                    {CLEANUP_LEVELS.defaultNote}
                  </span>
                )}
              </p>
              <p className="mt-1 text-[0.95rem] leading-snug text-muted">{level.detail}</p>
            </div>
            <div
              className={
                level.id === "none"
                  ? "font-mono text-[clamp(0.95rem,0.88rem+0.3vw,1.1rem)] leading-relaxed text-muted"
                  : "text-[clamp(1.3rem,1.1rem+0.8vw,1.75rem)] leading-[1.35] tracking-[-0.01em]"
              }
            >
              {level.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              {level.list.length > 0 && (
                <ul className="mt-1 list-disc pl-[1.1em]">
                  {level.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
      <MoreLink {...CLEANUP_LEVELS.more} />
    </Chapter>
  );
}
