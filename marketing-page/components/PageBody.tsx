import { Fragment } from "react";
import { Chapter } from "@/components/Chapter";
import type { Block, Inline, Section } from "@/lib/blocks";

const LINK = "underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground";

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
      <List className={`mt-5 grid gap-3 pl-6 ${block.ordered ? "list-decimal" : "list-disc"}`}>
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
              <th key={h} scope="col" className="border-b border-foreground/70 py-2 pr-6 font-semibold">
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
                  <th key={i} scope="row" className="py-3 pr-6 align-top font-semibold">
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

// A sub-page's sections, each a Chapter (id, plain h2) holding its paragraphs, lists and tables.
export function PageBody({ sections }: { sections: readonly Section[] }) {
  return (
    <>
      {sections.map((section) => (
        <Chapter key={section.id} id={section.id} title={section.heading} className="pt-14 sm:pt-16">
          {section.blocks.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </Chapter>
      ))}
    </>
  );
}
