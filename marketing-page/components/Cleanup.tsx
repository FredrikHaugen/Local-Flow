import { Chapter } from "@/components/Chapter";
import { CLEANUP_LEVELS } from "@/lib/content";

// The same take at every level: what whisper heard, with the words that level drops struck through,
// then the sentence that gets pasted, at hero scale. The picker works without JavaScript: four radios, and CSS
// (:has) shows the matching output.
export function Cleanup() {
  const raw = CLEANUP_LEVELS.raw.split(" ");
  return (
    <Chapter id="cleanup" title={CLEANUP_LEVELS.title} wide className="desk mt-24 py-16 sm:mt-32 sm:py-24">
      <p className="mt-4 max-w-2xl">{CLEANUP_LEVELS.intro}</p>

      <fieldset className="levels mt-10 min-w-0">
        <legend className="sr-only">{CLEANUP_LEVELS.legend}</legend>
        <div className="mt-6">
          {CLEANUP_LEVELS.levels.map((level) => (
            <div key={level.id} data-out={level.id} className="level-out">
              <p className="font-sans text-base text-muted">
                {level.name}: {level.detail}
              </p>
              {/* The take as whisper heard it, with the words this level drops struck through. */}
              <p data-raw={level.id} className="mt-4 max-w-4xl font-mono text-[clamp(0.95rem,0.85rem+0.4vw,1.15rem)] leading-relaxed text-muted">
                {raw.map((word, i) => (
                  <span key={i}>
                    {i > 0 && " "}
                    {(level.dropped as readonly number[]).includes(i) ? <s className="decoration-foreground/70">{word}</s> : word}
                  </span>
                ))}
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
        <div className="mt-10 inline-flex flex-wrap gap-1 rounded-xl bg-card p-2 font-sans text-foreground shadow-[0_1px_0_rgb(0_0_0/0.08)]">
          {CLEANUP_LEVELS.levels.map((level) => (
            <label key={level.id} className="level-opt cursor-pointer rounded-lg px-6 py-3 text-lg font-semibold">
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

      </fieldset>

    </Chapter>
  );
}
