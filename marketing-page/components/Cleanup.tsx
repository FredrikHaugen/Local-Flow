import { Chapter } from "@/components/Chapter";
import { CLEANUP_LEVELS } from "@/lib/content";

// The page's set piece: the same take, before and after, at display size on its own white band.
// The picker works without JavaScript: four radios, and CSS (:has) shows the matching output.
export function Cleanup() {
  return (
    <Chapter id="cleanup" title={CLEANUP_LEVELS.title} wide className="mt-24 bg-card py-16 sm:mt-32 sm:py-24">
      <p className="mt-4 max-w-2xl">{CLEANUP_LEVELS.intro}</p>

      <fieldset className="levels mt-10 min-w-0">
        <legend className="sr-only">{CLEANUP_LEVELS.legend}</legend>
        <div className="inline-flex flex-wrap gap-1 rounded-md border border-border bg-background p-1 font-sans">
          {CLEANUP_LEVELS.levels.map((level) => (
            <label key={level.id} className="level-opt cursor-pointer rounded px-4 py-2 text-[0.95rem] font-semibold">
              <input
                type="radio"
                name="cleanup-level"
                value={level.id}
                defaultChecked={level.id === CLEANUP_LEVELS.defaultLevel}
                className="sr-only"
              />
              {level.name}
            </label>
          ))}
        </div>

        <div className="mt-10">
          <p className="font-sans text-sm font-semibold text-muted">{CLEANUP_LEVELS.heardLabel}</p>
          <p className="mt-2 max-w-4xl font-mono text-[1.05rem] leading-relaxed text-muted sm:text-[1.25rem]">{CLEANUP_LEVELS.raw}</p>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="font-sans text-sm font-semibold text-muted">{CLEANUP_LEVELS.typedLabel}</p>
          {CLEANUP_LEVELS.levels.map((level) => (
            <div key={level.id} data-out={level.id} className="level-out">
              <p className="mt-1 font-sans text-sm text-muted">
                {level.name}: {level.detail}
              </p>
              <div className="mt-3 max-w-4xl text-[clamp(1.6rem,1.2rem+1.6vw,2.5rem)] leading-[1.3] tracking-[-0.01em]">
                {level.paragraphs.map((text) => (
                  <p key={text} className={level.id === "none" ? "font-mono text-[0.75em]" : ""}>
                    <span className="selected">{text}</span>
                  </p>
                ))}
                {level.list.length > 0 && (
                  <ul className="mt-2 list-disc pl-[1.2em]">
                    {level.list.map((item) => (
                      <li key={item}>
                        <span className="selected">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <p className="mt-10 max-w-2xl font-sans text-[0.95rem] text-muted">{CLEANUP_LEVELS.fallback}</p>
    </Chapter>
  );
}
