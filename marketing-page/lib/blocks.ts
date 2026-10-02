// The shape of a sub-page's copy: a lead paragraph and sections made of paragraphs, lists and tables.
// Components render it (components/PageBody.tsx); tests, JSON-LD and /llms.txt read it as data.

export type Inline = string | { text: string; href: string };

export type Block =
  | { p: readonly Inline[] }
  | { list: readonly (readonly Inline[])[]; ordered?: boolean }
  | { table: { caption: string; head: readonly string[]; rows: readonly (readonly string[])[] } };

export type Section = { id: string; heading: string; blocks: readonly Block[] };

export type PageCopy = { lead: readonly Inline[]; sections: readonly Section[] };

export function inlineText(parts: readonly Inline[]): string {
  return parts.map((part) => (typeof part === "string" ? part : part.text)).join("");
}
