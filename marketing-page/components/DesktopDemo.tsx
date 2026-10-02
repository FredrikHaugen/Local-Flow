import { MacWindow } from "@/components/MacWindow";
import { DEMO } from "@/lib/site";

const fillers = new Set<string>(DEMO.fillers);

// The product doing its one job, in one window: the take as you said it, then the paragraph that landed.
export function DesktopDemo() {
  const words = DEMO.raw.split(" ");
  return (
    <figure className="mt-10 sm:mt-12">
      <MacWindow title={DEMO.subject} className="window-shadow">
        <div className="px-6 pb-10 pt-6 sm:px-12 sm:pb-14 sm:pt-9">
          <p className="font-sans text-sm font-semibold text-muted">{DEMO.heardLabel}</p>
          <p data-demo="raw" className="demo-heard mt-2 font-mono text-[0.9rem] leading-relaxed text-muted sm:text-[0.95rem]">
            {words.map((word, i) => (
              <span key={i}>
                {i > 0 && " "}
                {fillers.has(word) ? <s className="decoration-foreground/60">{word}</s> : word}
              </span>
            ))}
          </p>
          <p className="mt-6 border-t border-border pt-6 font-sans text-sm font-semibold text-muted">{DEMO.typedLabel}</p>
          <p className="demo-paste mt-2 font-serif text-[1.15rem] leading-[1.7] sm:text-[1.45rem]">
            <span data-demo="cleaned" className="selected">
              {DEMO.cleaned}
            </span>
            <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-foreground" />
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
