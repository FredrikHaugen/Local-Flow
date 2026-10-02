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

// The vocabulary's one job: your words in Settings, and the sentence that comes out spelled right.
export function Words() {
  return (
    <Chapter id="vocabulary" title={WORDS.title} wide className="pt-20 sm:pt-28">
      <figure aria-label={WORDS.vocabTitle} className="mt-8 grid items-start gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-14">
        {/* The Vocabulary tab in Settings: each word once, with what whisper tends to hear instead. */}
        <div className="window-shadow overflow-hidden rounded-xl bg-card font-sans">
          <p className="border-b border-border px-4 py-2 text-center text-[0.8rem] font-semibold text-foreground/80">{WORDS.vocabTitle}</p>
          <ul aria-label={WORDS.vocabTitle} className="divide-y divide-border">
            {WORDS.terms.map((entry) => (
              <li key={entry.term} className="flex items-baseline justify-between gap-4 px-4 py-3">
                <span className="font-semibold">{entry.term}</span>
                <span className="truncate text-[0.95rem] text-muted">{entry.soundsLike.length > 0 ? `sounds like “${entry.soundsLike.join(", ")}”` : ""}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="pt-1 font-sans text-[1.05rem] text-muted">
            {WORDS.heardLabel}: <span className="font-mono text-[1.1rem] text-foreground">{WORDS.heard}</span>
          </p>
          <p className="mt-3 text-[clamp(1.8rem,1.2rem+2.2vw,2.75rem)] leading-[1.15] tracking-[-0.02em]">
            {withTerms(WORDS.typed, WORDS.terms.map((t) => t.term), "selected")}
          </p>
          <p className="mt-6 max-w-xl">{WORDS.vocabBody}</p>
        </div>
      </figure>

    </Chapter>
  );
}
