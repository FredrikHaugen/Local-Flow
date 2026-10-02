import { MacWindow } from "@/components/MacWindow";
import { Section } from "@/components/Section";
import { SwipeHint } from "@/components/SwipeHint";
import { ANYWHERE, KICKERS } from "@/lib/site";

const [messages, notes, code] = ANYWHERE.apps;

function Caret() {
  return (
    <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.2em] rounded-full bg-accent-ink" />
  );
}

function MessagesMock() {
  return (
    <MacWindow title={messages.contact} bodyClassName="flex h-60 flex-col md:h-72 justify-between gap-4 p-4">
      <p className="max-w-[80%] self-start rounded-2xl rounded-bl-md bg-background px-3.5 py-2 text-sm">{messages.incoming}</p>
      <div className="flex items-end gap-2 rounded-2xl border border-border px-3.5 py-2.5 text-sm leading-relaxed">
        <p className="flex-1">
          <span className="just-pasted">{messages.body}</span>
          <Caret />
        </p>
        <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
          </svg>
        </span>
      </div>
    </MacWindow>
  );
}

function NotesMock() {
  return (
    <MacWindow title={notes.app} bodyClassName="h-60 p-5 md:h-72">
      <p className="font-display text-2xl font-extrabold">{notes.title}</p>
      <p className="mt-3 text-sm leading-relaxed">
        <span className="just-pasted">{notes.body}</span>
        <Caret />
      </p>
    </MacWindow>
  );
}

function CodeMock() {
  const [pre, post] = code.body.split(code.term);
  const lines = [...code.before, null, ...code.after];
  return (
    <MacWindow title={code.file} bodyClassName="h-60 py-4 md:h-72 font-mono text-[0.78rem] leading-[1.9]">
      <ol>
        {lines.map((line, i) => (
          <li key={i} className="grid grid-cols-[2.5rem_1fr] pr-4">
            <span aria-hidden="true" className="select-none pr-3 text-right text-muted">
              {i + 12}
            </span>
            {line === null ? (
              <span className="text-muted">
                <span className="just-pasted">
                  {"    "}
                  {pre}
                  <mark className="relative rounded bg-accent px-1 text-accent-foreground">
                    {code.term}
                    <span aria-hidden="true" className="absolute -top-7 left-0 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 font-sans text-[0.68rem] font-medium text-background">
                      {code.termNote}
                    </span>
                  </mark>
                  {post}
                </span>
                <Caret />
              </span>
            ) : (
              <span className="whitespace-pre">{line}</span>
            )}
          </li>
        ))}
      </ol>
    </MacWindow>
  );
}

const MOCKS = [MessagesMock, NotesMock, CodeMock];

export function Anywhere() {
  return (
    <Section id="anywhere" tone="ink" kicker={KICKERS.anywhere} title={ANYWHERE.title} mark={ANYWHERE.mark} intro={ANYWHERE.intro}>
      <SwipeHint count={ANYWHERE.apps.length} tone="ink" until="md" />
      {/* Phones swipe through the apps side by side; wider screens get a three-up grid. */}
      <ul
        tabIndex={0}
        aria-label={ANYWHERE.railLabel}
        className="no-scrollbar -mx-4 -my-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 py-6 md:mx-0 md:my-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:py-0"
      >
        {ANYWHERE.apps.map((app, i) => {
          const Mock = MOCKS[i];
          return (
            <li key={app.app} className="w-[84%] shrink-0 snap-start md:w-auto">
              <div className="window-shadow rounded-xl">
                <Mock />
              </div>
              <h3 className="font-display mt-6 text-3xl font-extrabold">{app.caption}</h3>
              <p className="mt-1 text-ink-muted">in {app.app}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
