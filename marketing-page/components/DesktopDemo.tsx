import { MacWindow } from "@/components/MacWindow";
import { DEMO } from "@/lib/site";

const fillers = new Set<string>(DEMO.fillers);

// The product doing its one job, as a moment in Mail: the take you spoke, ghosted, and the paragraph
// that landed under it, with the cursor still blinking after the last word.
export function DesktopDemo() {
  const words = DEMO.raw.split(" ");
  return (
    <figure className="mx-auto mt-10 max-w-4xl sm:mt-12">
      <MacWindow title={DEMO.subject} className="window-shadow">
        <p className="border-b border-border px-6 py-3 text-[0.9rem] sm:px-12">
          <span className="text-muted">To:</span> <span className="font-medium">Priya</span>
        </p>
        <div className="px-6 pb-12 pt-7 sm:px-12 sm:pb-16 sm:pt-9">
          <p className="sr-only">{DEMO.heardLabel}</p>
          <p data-demo="raw" className="demo-heard font-mono text-[0.9rem] leading-relaxed text-foreground/30 sm:text-[0.95rem]">
            {words.map((word, i) => (
              <span key={i}>
                {i > 0 && " "}
                {fillers.has(word) ? <span data-filler="">{word}</span> : word}
              </span>
            ))}
          </p>
          <p className="sr-only">{DEMO.typedLabel}</p>
          <p className="demo-paste mt-6 font-serif text-[1.2rem] leading-[1.65] sm:text-[1.6rem]">
            <span data-demo="cleaned">{DEMO.cleaned}</span>
            <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-foreground" />
          </p>
        </div>
      </MacWindow>
      <figcaption className="sr-only">
        Example in {DEMO.app}: a rambling spoken message becomes a clean, punctuated paragraph. Filler words are removed
        and nothing else is reworded.
      </figcaption>
    </figure>
  );
}
