import { Chapter } from "@/components/Chapter";
import { MacWindow } from "@/components/MacWindow";
import { WORDS } from "@/lib/content";

// Mark every vocabulary term (and alias) inside a line of text.
function withTerms(text: string, terms: readonly string[], className: string) {
  const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(pattern).map((part, i) =>
    i % 2 ? (
      <mark key={i} className={className}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export function Words() {
  const heardTerms = WORDS.terms.flatMap((t) => [t.term, ...t.soundsLike]);
  return (
    <Chapter id="vocabulary" title={WORDS.title} wide className="pt-20 sm:pt-28">
      <div className="mt-8 grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <h3 className="text-[1.35rem]">{WORDS.vocabTitle}</h3>
          <p className="mt-3">{WORDS.vocabBody}</p>
          <MacWindow title={WORDS.vocabTitle} className="window-shadow mt-6" bodyClassName="divide-y divide-border">
            {WORDS.terms.map((entry) => (
              <div key={entry.term} className="flex items-baseline justify-between gap-3 px-4 py-2.5">
                <span className="font-semibold">{entry.term}</span>
                <span className="truncate text-sm text-muted">
                  {entry.soundsLike.length > 0 ? `sounds like: ${entry.soundsLike.join(", ")}` : ""}
                </span>
              </div>
            ))}
          </MacWindow>
          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <dt className="font-sans text-sm font-semibold text-muted">{WORDS.heardLabel}</dt>
            <dd className="font-mono text-[0.9rem]">
              {withTerms(WORDS.heard, heardTerms, "bg-transparent text-foreground underline decoration-dotted underline-offset-4")}
            </dd>
            <dt className="font-sans text-sm font-semibold text-muted">{WORDS.typedLabel}</dt>
            <dd>{withTerms(WORDS.typed, WORDS.terms.map((t) => t.term), "selected")}</dd>
          </dl>
        </div>

        <div>
          <h3 className="text-[1.35rem]">{WORDS.modelsTitle}</h3>
          <p className="mt-3">{WORDS.modelsBody}</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[24rem] border-collapse font-sans text-[0.98rem]">
              <caption className="sr-only">{WORDS.modelsTitle}</caption>
              <thead>
                <tr className="border-b-2 border-foreground text-left">
                  {WORDS.modelsColumns.map((c) => (
                    <th key={c} scope="col" className="py-2 pr-4 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WORDS.models.map((m) => (
                  <tr key={m.name} className="border-b border-border">
                    <th scope="row" className="py-2.5 pr-4 text-left font-semibold">
                      {m.name}
                    </th>
                    <td className="py-2.5 pr-4 tabular-nums">{m.size}</td>
                    <td className="py-2.5 text-muted">{m.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
