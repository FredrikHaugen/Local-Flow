import { Inlines } from "@/components/PageBody";
import type { Inline } from "@/lib/blocks";
import { page } from "@/lib/pages";

// A sub-page's opening: its one h1 from the registry and a lead paragraph.
export function PageIntro({ path, lead }: { path: string; lead: readonly Inline[] }) {
  return (
    <section id="top" aria-labelledby="top-title" className="px-4 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-5xl">
        <h1
          id="top-title"
          className="max-w-3xl text-balance text-[clamp(2.4rem,1.6rem+3vw,3.6rem)] leading-[1.05] tracking-[-0.02em]"
        >
          {page(path).h1}
        </h1>
        <p className="mt-6 max-w-2xl text-[clamp(1.15rem,1.05rem+0.4vw,1.35rem)] leading-[1.45]">
          <Inlines parts={lead} />
        </p>
      </div>
    </section>
  );
}
