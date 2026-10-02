import { MacWindow } from "@/components/MacWindow";
import { Section } from "@/components/Section";
import { CLEANUP, DEMO, KICKERS, MODELS, NEVER_LOST, VOCAB, YOURS } from "@/lib/site";

function Card({ title, body, className = "", children }: { title: string; body: string; className?: string; children: React.ReactNode }) {
  return (
    <li className={`flex flex-col rounded-3xl border border-border bg-card p-5 sm:p-7 ${className}`}>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
      <h3 className="font-display mt-5 text-3xl font-extrabold sm:mt-7 sm:text-4xl">{title}</h3>
      <p className="mt-2 max-w-xl leading-relaxed text-muted">{body}</p>
    </li>
  );
}

// The cleanup picker actually works: four radios, and CSS (:has) shows the matching output. No JS.
function CleanupDemo() {
  return (
    <fieldset className="levels min-w-0">
      <legend className="sr-only">{CLEANUP.legend}</legend>
      <div className="grid grid-cols-4 gap-1 rounded-full border border-border bg-background p-1">
        {CLEANUP.levels.map((level) => (
          <label key={level.id} className="level-opt cursor-pointer rounded-full py-2 text-center text-sm font-semibold">
            <input
              type="radio"
              name="cleanup-level"
              value={level.id}
              defaultChecked={level.id === CLEANUP.defaultLevel}
              className="sr-only"
            />
            {level.name}
          </label>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="surface-ink rounded-2xl bg-ink p-4 text-ink-foreground">
          <p className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ink-accent" />
            {CLEANUP.heardLabel}
          </p>
          <p className="mt-2 font-mono text-[0.8rem] leading-relaxed">{CLEANUP.raw}</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="flex items-center justify-between gap-2 text-xs font-semibold text-muted">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-ink" />
              {CLEANUP.typedLabel}
            </span>
            <span className="font-normal">{CLEANUP.exampleNote}</span>
          </p>
          {CLEANUP.levels.map((level) => (
            <div key={level.id} data-out={level.id} className="level-out mt-2">
              <p className="text-xs text-muted">
                <span className="font-semibold text-foreground">{level.name}</span> — {level.detail}
              </p>
              {level.paragraphs.map((text) => (
                <p key={text} className={`mt-2 leading-relaxed ${level.id === "none" ? "font-mono text-[0.8rem]" : ""}`}>
                  <span className="just-pasted">{text}</span>
                </p>
              ))}
              {level.list.length > 0 && (
                <ul className="mt-1 list-disc pl-5 leading-relaxed marker:text-accent-ink">
                  {level.list.map((item) => (
                    <li key={item}>
                      <span className="just-pasted">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-muted">{CLEANUP.promise}</p>
    </fieldset>
  );
}

// Highlight every vocabulary term inside a line of text.
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

function VocabDemo() {
  const heardTerms = VOCAB.terms.flatMap((t) => [t.term, ...t.soundsLike]);
  return (
    <div>
      <MacWindow title={VOCAB.panelTitle} className="border border-border" bodyClassName="divide-y divide-border">
        {VOCAB.terms.map((entry) => (
          <div key={entry.term} className="flex items-baseline justify-between gap-3 px-4 py-2.5">
            <span className="font-semibold">{entry.term}</span>
            <span className="truncate text-xs text-muted">
              {entry.soundsLike.length > 0 ? `sounds like: ${entry.soundsLike.join(", ")}` : "name"}
            </span>
          </div>
        ))}
      </MacWindow>
      <div className="mt-4 grid gap-2 text-sm">
        <p className="font-mono text-[0.8rem] text-muted">
          <span className="sr-only">Heard: </span>
          {withTerms(VOCAB.heard, heardTerms, "rounded bg-transparent text-muted underline decoration-accent-ink decoration-dashed underline-offset-4")}
        </p>
        <p aria-hidden="true" className="text-accent-ink">
          ↓
        </p>
        <p className="font-semibold">
          <span className="sr-only">Typed: </span>
          {withTerms(VOCAB.typed, VOCAB.terms.map((t) => t.term), "rounded bg-accent px-1 text-accent-foreground")}
        </p>
      </div>
    </div>
  );
}

function ModelsDemo() {
  return (
    <ul className="grid gap-2.5">
      {MODELS.list.map((model) => {
        const current = "current" in model && model.current;
        return (
          <li
            key={model.name}
            className={`rounded-xl border px-3.5 py-2.5 ${current ? "border-accent-ink bg-background" : "border-border"}`}
          >
            <p className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0">
                <span className="font-semibold">{model.name}</span>{" "}
                <span className="text-muted">· {model.note}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-muted">{model.size}</span>
            </p>
            <span aria-hidden="true" className="mt-2 block h-1 overflow-hidden rounded-full bg-border">
              <span
                className={`block h-full rounded-full ${current ? "bg-accent-ink" : "bg-foreground/60"}`}
                style={{ width: `${Math.round(Math.max(4, (model.mb / MODELS.maxMb) * 100))}%` }}
              />
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function truncate(text: string) {
  return text.length > NEVER_LOST.truncateAt ? `${text.slice(0, NEVER_LOST.truncateAt)}…` : text;
}

// The menu bar menu, with "Recent transcripts" open, and the overlay's paste-failure notice.
function NeverLostDemo() {
  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="min-w-0">
        <div aria-hidden="true" className="flex h-8 items-center justify-end gap-4 rounded-t-xl bg-foreground/[0.06] px-3 text-xs">
          <span className="grid h-5 w-7 place-items-center rounded bg-accent text-accent-foreground">
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="4" y="1" width="4" height="6.5" rx="2" />
              <path d="M2.5 6a3.5 3.5 0 0 0 7 0M6 9.5V11" />
            </svg>
          </span>
          <span className="font-semibold">{DEMO.clock}</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-start">
          <div className="rounded-b-xl rounded-tr-xl border border-border bg-background p-1.5 text-sm shadow-[0_20px_40px_-28px_var(--foreground)] sm:rounded-tr-none">
            <p className="truncate px-2.5 py-1.5 text-muted">{NEVER_LOST.menuStatus}</p>
            <hr className="my-1 border-border" />
            <p className="flex items-center justify-between rounded-md bg-accent px-2.5 py-1.5 font-semibold text-accent-foreground">
              {NEVER_LOST.submenu}
              <span aria-hidden="true">›</span>
            </p>
            <hr className="my-1 border-border" />
            {NEVER_LOST.menuItems.map((item) => (
              <p key={item.label} className="flex items-center justify-between px-2.5 py-1.5">
                {item.label}
                <span className="font-mono text-xs text-muted">{item.shortcut}</span>
              </p>
            ))}
          </div>
          <ul
            aria-label={NEVER_LOST.submenu}
            className="rounded-xl border border-border bg-background p-1.5 text-sm shadow-[0_20px_40px_-28px_var(--foreground)] sm:mt-[2.6rem]"
          >
            {NEVER_LOST.recent.map((item) => (
              <li key={item} className="truncate rounded-md px-2.5 py-1.5">
                {truncate(item)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="surface-ink flex items-center gap-3 justify-self-start rounded-full bg-ink py-2 pl-2 pr-5 text-sm font-semibold text-ink-foreground sm:justify-self-end">
        <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-ink-accent text-ink">
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <rect x="3.5" y="3" width="9" height="11" rx="1.5" />
            <path d="M6 3V2h4v1" />
          </svg>
        </span>
        {NEVER_LOST.overlay}
      </p>
    </div>
  );
}

export function MakeItYours() {
  return (
    <Section id="yours" kicker={KICKERS.yours} title={YOURS.title} mark={YOURS.mark} intro={YOURS.intro}>
      <ul className="grid gap-4 lg:grid-cols-3">
        <Card title={CLEANUP.title} body={CLEANUP.body} className="lg:col-span-2">
          <CleanupDemo />
        </Card>
        <Card title={VOCAB.title} body={VOCAB.body}>
          <VocabDemo />
        </Card>
        <Card title={MODELS.title} body={MODELS.body}>
          <ModelsDemo />
        </Card>
        <Card title={NEVER_LOST.title} body={NEVER_LOST.body} className="lg:col-span-2">
          <NeverLostDemo />
        </Card>
      </ul>
    </Section>
  );
}
