import { Chapter } from "@/components/Chapter";
import { CLEANUP_LEVELS } from "@/lib/content";

// The picker works without JavaScript: four radios, and CSS (:has) shows the matching output.
export function Cleanup() {
  return (
    <Chapter id="cleanup" title={CLEANUP_LEVELS.title} wide className="pt-20 sm:pt-28">
      <div className="max-w-2xl">
        {CLEANUP_LEVELS.paragraphs.map((p) => (
          <p key={p} className="mt-5">
            {p}
          </p>
        ))}
      </div>

      <fieldset className="levels mt-10 min-w-0">
        <legend className="font-sans text-sm font-semibold text-muted">{CLEANUP_LEVELS.legend}</legend>
        <div className="mt-2 inline-flex flex-wrap gap-1 rounded-md border border-border bg-card p-1 font-sans">
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

        <div className="mt-6 grid gap-8 border-t border-border pt-6 md:grid-cols-2">
          <div>
            <p className="font-sans text-sm font-semibold text-muted">{CLEANUP_LEVELS.heardLabel}</p>
            <p className="mt-2 font-mono text-[0.9rem] leading-relaxed">{CLEANUP_LEVELS.raw}</p>
          </div>
          <div>
            <p className="font-sans text-sm font-semibold text-muted">{CLEANUP_LEVELS.typedLabel}</p>
            {CLEANUP_LEVELS.levels.map((level) => (
              <div key={level.id} data-out={level.id} className="level-out">
                <p className="mt-1 font-sans text-sm text-muted">
                  {level.name}: {level.detail}
                </p>
                {level.paragraphs.map((text) => (
                  <p key={text} className={`mt-2 ${level.id === "none" ? "font-mono text-[0.9rem] leading-relaxed" : ""}`}>
                    <span className="selected">{text}</span>
                  </p>
                ))}
                {level.list.length > 0 && (
                  <ul className="mt-1 list-disc pl-6">
                    {level.list.map((item) => (
                      <li key={item}>
                        <span className="selected">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </fieldset>
    </Chapter>
  );
}
