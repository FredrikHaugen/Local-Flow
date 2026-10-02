import { MacWindow } from "@/components/MacWindow";
import { Section } from "@/components/Section";
import { SwipeHint } from "@/components/SwipeHint";
import { INSTALL, KICKERS, REQUIREMENTS } from "@/lib/site";

const [DRAG, ALLOW, MODEL] = INSTALL.steps;

function Check({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`h-3.5 w-3.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

// The app icon: the placeholder keycap, big, with its record light.
function AppIcon() {
  return (
    <span aria-hidden="true" className="font-display relative grid h-16 w-16 place-items-center rounded-2xl bg-foreground text-4xl text-background shadow-[inset_0_-2px_0_var(--muted)]">
      ⌥
      <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-accent ring-2 ring-background" />
    </span>
  );
}

function FolderIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 52" className="h-14 w-16 text-foreground">
      <path d="M4 8a4 4 0 0 1 4-4h16l5 5h27a4 4 0 0 1 4 4v31a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" fill="currentColor" opacity=".22" />
      <path d="M4 18a4 4 0 0 1 4-4h48a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" fill="currentColor" opacity=".18" />
      <rect x="26" y="25" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.5" opacity=".45" />
    </svg>
  );
}

function DragVisual() {
  return (
    <div className="flex items-end justify-center gap-3 sm:gap-5">
      <figure className="flex flex-col items-center gap-2 text-xs font-semibold">
        <AppIcon />
        <figcaption>{DRAG.app}</figcaption>
      </figure>
      <svg aria-hidden="true" viewBox="0 0 64 24" className="mb-9 h-6 w-14 text-accent-ink" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h56" strokeDasharray="4 5" />
        <path d="M52 5l7 7-7 7" />
      </svg>
      <figure className="flex flex-col items-center gap-2 text-xs font-semibold">
        <FolderIcon />
        <figcaption>{DRAG.folder}</figcaption>
      </figure>
    </div>
  );
}

function AllowVisual() {
  return (
    <ul className="w-full space-y-2">
      {ALLOW.permissions.map((name) => (
        <li key={name} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm">
          <span className="font-semibold">{name}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
            <Check />
            {ALLOW.allowed}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ModelVisual() {
  return (
    <div className="w-full rounded-xl border border-border bg-card px-4 py-3.5">
      <p className="flex items-baseline justify-between text-sm">
        <span className="font-semibold">{MODEL.model}</span>
        <span className="font-mono text-xs text-muted">{MODEL.size}</span>
      </p>
      <span aria-hidden="true" className="mt-3 block h-2 overflow-hidden rounded-full bg-border">
        <span className="block h-full w-full rounded-full bg-accent-ink" />
      </span>
      <p className="mt-2.5 flex items-center gap-1.5 font-mono text-[0.65rem] text-muted">
        <Check className="text-accent-ink" />
        {MODEL.source}
      </p>
    </div>
  );
}

const VISUALS = [DragVisual, AllowVisual, ModelVisual];

// "About This Mac", reduced to the two lines that decide whether LocalFlow runs.
function WillItRun() {
  return (
    <div>
      <MacWindow title={INSTALL.checkTitle} className="window-shadow" bodyClassName="p-5 sm:p-6">
        <dl className="divide-y divide-border">
          {INSTALL.checkRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 py-3 first:pt-0">
              <dt className="text-sm text-muted">{row.label}</dt>
              <dd className="flex items-center gap-2 text-right font-semibold">
                {row.need}
                <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Check className="h-3 w-3" />
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 font-mono text-xs text-muted">Find it: {INSTALL.checkHow}</p>
      </MacWindow>
      <p className="mt-5 flex gap-3 text-sm leading-relaxed text-muted">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
        {INSTALL.checkNo}
      </p>
    </div>
  );
}

// Install: the README's three steps, drawn, then the full requirements next to an "About This Mac" check.
export function Requirements() {
  return (
    <Section id="requirements" kicker={KICKERS.requirements} title={INSTALL.title} mark={INSTALL.mark} intro={INSTALL.intro}>
      <SwipeHint count={INSTALL.steps.length} />
      {/* Phones swipe step to step; tablets stack them; desktops line all three up. */}
      <ol
        tabIndex={0}
        aria-label={INSTALL.railLabel}
        className="no-scrollbar -mx-4 -my-2 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 py-2 sm:mx-0 sm:my-0 sm:grid sm:gap-4 sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-3"
      >
        {INSTALL.steps.map((step, i) => {
          const Visual = VISUALS[i];
          return (
            <li key={step.title} className="flex w-[84%] shrink-0 snap-start flex-col rounded-3xl border border-border bg-card p-2.5 sm:w-auto">
              <div className="grid h-40 place-items-center rounded-2xl bg-background px-5">
                <Visual />
              </div>
              <div className="px-3.5 pb-3 pt-5">
                <p className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-xs font-bold text-background">
                    {i + 1}
                  </span>
                  <span className="font-display text-3xl font-extrabold leading-tight">{step.title}</span>
                </p>
                <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="font-display mt-6 text-center text-2xl font-extrabold sm:text-3xl">{INSTALL.done}</p>

      <div className="mt-12 grid gap-10 sm:mt-20 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <WillItRun />
        <div>
          <h3 className="font-display text-4xl font-extrabold">{INSTALL.requirementsTitle}</h3>
          <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {REQUIREMENTS.map((req) => (
              <div key={req.title} className="border-t-2 border-foreground pt-4">
                <dt className="font-semibold leading-snug">{req.title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">{req.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
