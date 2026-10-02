import { Marked, Marker } from "@/components/Brand";
import { Kbd } from "@/components/Kbd";
import { MacWindow } from "@/components/MacWindow";
import { CONTROL_TRACKS, CONTROLS, HOW, KICKERS, STEPS } from "@/lib/site";

// Deterministic "speech" for the live waveform, so server and client render the same thing.
const VOICE = Array.from({ length: 24 }, (_, i) => {
  const h = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.89) * Math.cos(i * 0.3 + 0.4));
  return Math.round(h * 100) / 100;
});

// One giant keycap: the only key you need.
function KeyVisual() {
  return (
    <div className="key-press relative grid h-36 w-36 place-items-center rounded-[1.75rem] bg-accent text-accent-foreground sm:h-44 sm:w-44 sm:rounded-[2.25rem]">
      <span className="font-display text-8xl font-extrabold leading-none sm:text-9xl">⌥</span>
      <span className="absolute bottom-3.5 left-4 text-xs font-semibold opacity-80 sm:bottom-5 sm:left-5 sm:text-sm">
        {HOW.keyLegend}
      </span>
      <span className="absolute right-4 top-3.5 text-xs font-semibold opacity-80 sm:right-5 sm:top-5 sm:text-sm">
        {HOW.keySide}
      </span>
    </div>
  );
}

// The overlay LocalFlow shows while it listens, at storyboard scale.
function VoiceVisual() {
  return (
    <div className="surface-ink flex h-20 w-full max-w-xs items-center gap-4 rounded-full bg-ink px-6 text-ink-foreground shadow-[0_24px_48px_-24px_var(--ink)] sm:h-24">
      <span className="rec-dot h-2.5 w-2.5 shrink-0 rounded-full bg-ink-accent" />
      <span className="flex h-10 min-w-0 flex-1 items-center justify-between sm:h-12">
        {VOICE.map((h, i) => (
          <span
            key={i}
            className="wave-bar w-[2px] shrink-0 rounded-full bg-ink-foreground sm:w-[3px]"
            style={{ height: `${Math.round(h * 100)}%` }}
          />
        ))}
      </span>
    </div>
  );
}

// The text, landed where the cursor was.
function TextVisual() {
  return (
    <MacWindow
      title={HOW.pastedApp}
      className="w-full max-w-xs border border-border text-left shadow-[0_24px_48px_-28px_var(--foreground)]"
    >
      <p className="flex items-start gap-3 px-4 pb-3 pt-4 text-[0.95rem] font-medium leading-snug">
        <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-accent" />
        <span>
          <span className="just-pasted">{HOW.pasted}</span>
          <span className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-accent" />
        </span>
      </p>
      <p className="flex items-center gap-1.5 px-4 pb-3.5 font-mono text-[0.65rem] text-muted">
        <svg viewBox="0 0 12 12" className="h-3 w-3 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2.5 6.5 2.2 2L9.5 3.5" />
        </svg>
        {HOW.restored}
      </p>
    </MacWindow>
  );
}

const VISUALS = [KeyVisual, VoiceVisual, TextVisual];

// Timing diagrams for the three controls: time runs left to right along a dashed line.
function TrackFrame({ children, end }: { children: React.ReactNode; end: string }) {
  return (
    <div aria-hidden="true" className="relative h-14 w-full">
      <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-muted/50" />
      {children}
      <span className="absolute right-0 top-full -translate-y-1 font-mono text-[0.65rem] text-muted">{end}</span>
    </div>
  );
}

function Tick({ at }: { at: string }) {
  return <span className="absolute top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-full bg-accent" style={{ left: at }} />;
}

function Pasted() {
  return (
    <span className="absolute right-0 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-foreground text-background">
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2.5 6.5 2.2 2L9.5 3.5" />
      </svg>
    </span>
  );
}

function HoldTrack() {
  return (
    <TrackFrame end="pasted">
      <span className="absolute left-[4%] right-[14%] top-1/2 flex h-7 -translate-y-1/2 items-center rounded-full bg-accent px-3 font-mono text-[0.7rem] font-semibold text-accent-foreground">
        {CONTROL_TRACKS.held}
      </span>
      <Pasted />
    </TrackFrame>
  );
}

function HandsFreeTrack() {
  return (
    <TrackFrame end="pasted">
      <Tick at="2%" />
      <Tick at="7%" />
      <span className="absolute left-[12%] right-[22%] top-1/2 flex h-7 -translate-y-1/2 items-center gap-1.5 rounded-full border-2 border-accent bg-card px-2.5 font-mono text-[0.7rem] font-semibold text-accent">
        <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <rect x="2.5" y="5.5" width="7" height="5" rx="1" />
          <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
        </svg>
        {CONTROL_TRACKS.locked}
      </span>
      <Tick at="81%" />
      <Pasted />
    </TrackFrame>
  );
}

function CancelTrack() {
  return (
    <TrackFrame end="nothing pasted">
      <span className="absolute left-[4%] w-[46%] top-1/2 h-7 -translate-y-1/2 rounded-full bg-accent/35" />
      <span className="absolute left-[52%] top-1/2 flex h-7 -translate-y-1/2 items-center gap-1 rounded-md bg-foreground px-2 font-mono text-[0.7rem] font-semibold text-background">
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m3 3 6 6M9 3 3 9" />
        </svg>
        {CONTROL_TRACKS.cancelled}
      </span>
    </TrackFrame>
  );
}

const TRACKS = [HoldTrack, HandsFreeTrack, CancelTrack];


// Not a row of cards: one storyboard. A rail runs through the key, the voice and the text,
// with the moment of each move stamped above it.
export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="scroll-mt-16 overflow-hidden pt-16 sm:pt-32">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <Marker label={KICKERS["how-it-works"]} />
        <h2
          id="how-it-works-title"
          className="font-display mx-auto mt-6 text-[clamp(4rem,19vw,10rem)] font-extrabold leading-[0.88] tracking-[-0.01em]"
        >
          <Marked text={HOW.title} mark={HOW.mark} />
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">{HOW.intro}</p>
      </div>

      <div className="relative mx-auto mt-12 max-w-6xl px-4 sm:mt-20 sm:px-6">
        {/* The rail: one continuous line through all three moves (desktop). */}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-[150px] hidden border-t-2 border-dashed border-accent/50 lg:block"
        />
        <ol className="relative grid gap-12 lg:grid-cols-3 lg:gap-8">
          {STEPS.map((step, i) => {
            const Visual = VISUALS[i];
            return (
              <li key={step.title} className="flex flex-col items-center text-center">
                <p
                  aria-hidden="true"
                  className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[0.7rem] text-muted"
                >
                  {HOW.moments[i]}
                </p>
                <div aria-hidden="true" className="mt-4 flex h-40 w-full items-center justify-center sm:mt-5 sm:h-52">
                  <Visual />
                </div>
                <div className="mt-5 max-w-xs sm:mt-8">
                  <span aria-hidden="true" className="font-display text-base font-extrabold text-accent">
                    0{i + 1}
                  </span>
                  <h3 className="font-display mt-1 text-4xl font-extrabold sm:text-5xl">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mx-auto mt-16 max-w-5xl px-4 pb-16 sm:mt-24 sm:px-6 sm:pb-32">
        <h3 id="controls-title" className="font-display text-3xl font-extrabold sm:text-4xl">
          Keyboard controls
        </h3>
        <ul aria-labelledby="controls-title" className="mt-5 grid gap-3 sm:gap-4 md:grid-cols-3">
          {CONTROLS.map((control, i) => {
            const Track = TRACKS[i];
            return (
              <li key={control.action} data-control className="flex flex-col rounded-2xl border border-border bg-card p-4 sm:p-5">
                <Track />
                <p data-action className="font-display mt-4 text-2xl font-extrabold sm:mt-5">
                  {control.action}
                </p>
                <p className="mt-2">
                  <Kbd className="text-[0.75rem]">
                    <span data-keys>{control.keys}</span>
                  </Kbd>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{control.note}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
