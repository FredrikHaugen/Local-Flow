import { Fragment } from "react";
import type { Block, Inline, Section } from "@/lib/blocks";
import { PAGE_NAV } from "@/lib/content";

const LINK =
  "underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground";

export function Inlines({ parts }: { parts: readonly Inline[] }) {
  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <Fragment key={i}>{part}</Fragment>
        ) : (
          <a key={i} href={part.href} className={LINK}>
            {part.text}
          </a>
        ),
      )}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  if ("p" in block) {
    return (
      <p className="mt-5">
        <Inlines parts={block.p} />
      </p>
    );
  }
  if ("list" in block) {
    const List = block.ordered ? "ol" : "ul";
    return (
      <List
        className={`mt-5 grid gap-3 pl-6 ${block.ordered ? "list-decimal" : "list-disc"}`}
      >
        {block.list.map((item, i) => (
          <li key={i}>
            <Inlines parts={item} />
          </li>
        ))}
      </List>
    );
  }
  const { caption, head, rows } = block.table;
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-left font-sans text-[1rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="border-b border-foreground/70 py-2 pr-6 font-semibold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-border">
              {row.map((cell, i) =>
                i === 0 ? (
                  <th
                    key={i}
                    scope="row"
                    className="py-3 pr-6 align-top font-semibold"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={i} className="py-3 pr-6 align-top">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// The page's sections as links. Beside the text on a wide screen; above it on a phone when `indexOnPhone`.
function OnThisPage({
  sections,
  indexOnPhone,
}: {
  sections: readonly Section[];
  indexOnPhone: boolean;
}) {
  return (
    <nav
      aria-label={PAGE_NAV.onThisPage}
      className={`${indexOnPhone ? "mt-10 border-y border-border py-5" : "hidden"} font-sans text-[0.95rem] lg:sticky lg:top-8 lg:col-start-2 lg:row-start-1 lg:mt-14 lg:block lg:self-start lg:border-y-0 lg:border-l lg:py-0 lg:pl-6`}
    >
      <p className="font-semibold">{PAGE_NAV.onThisPage}</p>
      <ul className="mt-3 grid gap-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              {section.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// A sub-page's sections, each with an id and a plain h2, in a reading column with the section list
// beside it. `compact` sets smaller headings for pages made of many short sections, like the FAQ.
export function PageBody({
  sections,
  compact = false,
  indexOnPhone = false,
  after,
}: {
  sections: readonly Section[];
  compact?: boolean;
  indexOnPhone?: boolean;
  after?: React.ReactNode;
}) {
  const heading = compact
    ? "text-[clamp(1.3rem,1.2rem+0.4vw,1.55rem)] leading-[1.25]"
    : "text-[clamp(1.6rem,1.35rem+1vw,2.1rem)] leading-[1.15] tracking-[-0.01em]";
  return (
    <div className="px-4 pb-20 sm:px-6 sm:pb-24">
      <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] lg:gap-x-16">
        <OnThisPage sections={sections} indexOnPhone={indexOnPhone} />
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className={`scroll-mt-6 ${compact ? "pt-10" : "pt-14 sm:pt-16"}`}
            >
              <h2 id={`${section.id}-title`} className={heading}>
                {section.heading}
              </h2>
              {section.blocks.map((block, i) => (
                <BlockView key={i} block={block} />
              ))}
            </section>
          ))}
          {after}
        </div>
      </div>
    </div>
  );
}
