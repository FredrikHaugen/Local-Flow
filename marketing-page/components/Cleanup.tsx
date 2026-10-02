import { Chapter } from "@/components/Chapter";
import { CLEANUP_LEVELS } from "@/lib/content";

// One sentence at hero scale that changes as you step through the levels. The raw take is already in
// the hero, so here only the result moves. The picker works without JavaScript: four radios, and CSS
// (:has) shows the matching output.
export function Cleanup() {
  return (
    <Chapter id="cleanup" title={CLEANUP_LEVELS.title} wide className="desk mt-24 py-16 sm:mt-32 sm:py-24">
      <p className="mt-4 max-w-2xl">{CLEANUP_LEVELS.intro}</p>

      <fieldset className="levels mt-10 min-w-0">
        <legend className="sr-only">{CLEANUP_LEVELS.legend}</legend>
        <div className="inline-flex flex-wrap gap-1 rounded-lg bg-card p-1.5 font-sans text-foreground shadow-[0_1px_0_rgb(0_0_0/0.08)]">
          {CLEANUP_LEVELS.levels.map((level) => (
            <label key={level.id} className="level-opt cursor-pointer rounded-md px-5 py-2.5 text-[1.05rem] font-semibold">
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
          {CLEANUP_LEVELS.levels.map((level) => (
            <div key={level.id} data-out={level.id} className="level-out">
              <p className="font-sans text-sm text-muted">
                {level.name}: {level.detail}
              </p>
              <div className="mt-4 min-h-[3.8em] text-[clamp(2rem,1.25rem+3vw,3.9rem)] leading-[1.15] tracking-[-0.02em]">
                {level.paragraphs.map((text) => (
                  <p key={text} className={level.id === "none" ? "font-mono text-[0.7em]" : ""}>
                    {text}
                  </p>
                ))}
                {level.list.length > 0 && (
                  <ul className="mt-2 list-disc pl-[1.1em]">
                    {level.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

    </Chapter>
  );
}
