import { Chapter } from "@/components/Chapter";
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

// The vocabulary's one job, at the size of the cleanup sentence: what whisper heard, and what landed.
export function Words() {
  const heardTerms = WORDS.terms.flatMap((t) => [t.term, ...t.soundsLike]);
  return (
    <Chapter id="vocabulary" title={WORDS.title} wide className="pt-20 sm:pt-28">
      <figure aria-label={WORDS.vocabTitle} className="mt-8">
        <p className="font-sans text-sm font-semibold text-muted">{WORDS.heardLabel}</p>
        <p className="mt-2 font-mono text-[clamp(1.05rem,0.95rem+0.5vw,1.35rem)] text-muted">
          {withTerms(WORDS.heard, heardTerms, "bg-transparent text-foreground underline decoration-dotted underline-offset-4")}
        </p>
        <p className="mt-6 font-sans text-sm font-semibold text-muted">{WORDS.typedLabel}</p>
        <p className="mt-2 text-[clamp(2rem,1.25rem+3vw,3.9rem)] leading-[1.15] tracking-[-0.02em]">
          {withTerms(WORDS.typed, WORDS.terms.map((t) => t.term), "selected")}
        </p>
        <ul aria-label={WORDS.vocabTitle} className="mt-8 flex flex-wrap gap-3 font-sans text-lg">
          {WORDS.terms.map((entry) => (
            <li key={entry.term} className="rounded-lg border border-border bg-card px-4 py-2">
              <span className="font-semibold">{entry.term}</span>
              {entry.soundsLike.length > 0 && <span className="text-muted"> sounds like “{entry.soundsLike.join(", ")}”</span>}
            </li>
          ))}
        </ul>
      </figure>
      <p className="mt-6 max-w-2xl">{WORDS.vocabBody}</p>

    </Chapter>
  );
}
