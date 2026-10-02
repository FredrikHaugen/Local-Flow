import { Chapter } from "@/components/Chapter";
import { CLEANUP_LEVELS } from "@/lib/content";

// The page's set piece: the whole band is the macOS selection color, because what it shows is text
// that has just been pasted. The same take, before and after, with the result at display size.
// The picker works without JavaScript: four radios, and CSS (:has) shows the matching output.
export function Cleanup() {
  return (
    <Chapter id="cleanup" title={CLEANUP_LEVELS.title} wide className="mt-24 bg-select py-16 text-select-foreground sm:mt-32 sm:py-24">
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

        <div className="mt-12">
          <p className="font-sans text-sm font-semibold opacity-75">{CLEANUP_LEVELS.heardLabel}</p>
          <p className="mt-2 max-w-4xl font-mono text-[1.05rem] leading-relaxed opacity-75 sm:text-[1.2rem]">{CLEANUP_LEVELS.raw}</p>
        </div>

        <div className="mt-10 border-t border-select-foreground/20 pt-8">
          <p className="font-sans text-sm font-semibold opacity-75">{CLEANUP_LEVELS.typedLabel}</p>
          {CLEANUP_LEVELS.levels.map((level) => (
            <div key={level.id} data-out={level.id} className="level-out">
              <p className="mt-1 font-sans text-sm opacity-75">
                {level.name}: {level.detail}
              </p>
              <div className="mt-4 text-[clamp(1.8rem,1.2rem+2.4vw,3.2rem)] leading-[1.22] tracking-[-0.015em]">
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

      <p className="mt-12 max-w-2xl font-sans text-[0.95rem] opacity-75">{CLEANUP_LEVELS.fallback}</p>
    </Chapter>
  );
}
