import { DEMO } from "@/lib/site";

const fillers = new Set<string>(DEMO.fillers);

// The product doing its one job, at the size of the idea: the take you spoke, fading out, and the
// sentence that landed in its place, with the cursor still blinking after the last word.
export function DesktopDemo() {
  const words = DEMO.raw.split(" ");
  return (
    <figure className="window-shadow mt-10 rounded-2xl bg-card px-6 pb-12 pt-8 sm:mt-12 sm:px-14 sm:pb-16 sm:pt-12">
      <p className="sr-only">{DEMO.heardLabel}</p>
      <p data-demo="raw" className="demo-heard ghost-fade max-w-4xl font-mono text-[0.95rem] leading-relaxed sm:text-[1.05rem]">
        {words.map((word, i) => (
          <span key={i}>
            {i > 0 && " "}
            {fillers.has(word) ? <span data-filler="">{word}</span> : word}
          </span>
        ))}
      </p>
      <p className="sr-only">{DEMO.typedLabel}</p>
      <p className="demo-paste mt-7 max-w-4xl font-serif text-[clamp(1.55rem,1.1rem+1.9vw,2.6rem)] leading-[1.3] tracking-[-0.01em]">
        <span data-demo="cleaned">{DEMO.cleaned}</span>
        <span aria-hidden="true" className="caret ml-1 inline-block h-[1em] w-[3px] translate-y-[0.15em] bg-foreground" />
      </p>
      <figcaption className="sr-only">
        Example in {DEMO.app}: a rambling spoken message becomes a clean, punctuated paragraph. Filler words are removed
        and nothing else is reworded.
      </figcaption>
    </figure>
  );
}
