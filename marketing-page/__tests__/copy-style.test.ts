import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { llmsTxt } from "@/app/llms.txt/route";
import * as content from "@/lib/content";
import * as site from "@/lib/site";

// The patterns that make a page read as generated (.claude/rules/TOV.md has the why and the fixes).
// Every string in lib/content.ts is checked, plus the copy in lib/site.ts, the share alt text and /llms.txt.
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

const root = process.cwd();

const copy = [
  ...strings(content),
  ...strings({
    PHONE: site.PHONE,
    ANALYTICS: site.ANALYTICS,
    description: site.SITE.description,
    title: site.SEO.title,
    ogImageAlt: site.SEO.ogImageAlt,
  }),
  readFileSync(resolve(root, "app/opengraph-image.alt.txt"), "utf8"),
  ...llmsTxt().split("\n").filter(Boolean),
];

const RULES: [string, RegExp][] = [
  ["em or en dash", /[—–]/],
  ["negation-then-reveal", /\bnot (?:a|an|just|only)\b[^.]{0,40}[,:;]\s*(?:the|it'?s|but)\b/i],
  ["trust-signalling meta-language", /\b(?:honest(?:ly)?|take (?:our|my) word|only worth|trust us|by construction|under the hood|fair questions)\b/i],
  ["counted title", /\b(?:two|three|four|five|3|4|5) (?:moves|steps|ways|things|reasons|checks|questions|pillars)\b/i],
  ["no-x stack", /\b(?:no|zero) [\w-]+[.,;]\s+(?:no|zero) [\w-]+[.,;]\s+(?:no|zero) [\w-]+/i],
  ["one-x triplet", /\bone [\w-]+, one [\w-]+,? (?:and )?one [\w-]+/i],
  [
    "buzzword",
    /\b(?:seamless(?:ly)?|effortless(?:ly)?|unlock(?:s|ing)?|elevate[sd]?|supercharge[sd]?|leverag(?:e|es|ing)|robust|streamlin(?:e|es|ed)|delve|landscape|cutting[- ]edge|game[- ]chang\w*|revolutioni[sz]\w*|empower\w*|blazing(?:ly)?|next[- ]level|world[- ]class|best[- ]in[- ]class)\b/i,
  ],
  ["exclamation mark", /!/],
];

// One known-bad line per rule, so a rule that gets loosened until it matches nothing fails here.
const SAMPLES: Record<string, string> = {
  "em or en dash": "Fast — and it stays on your Mac.",
  "negation-then-reveal": "Not a privacy setting, the architecture.",
  "trust-signalling meta-language": "Don't take our word for it.",
  "counted title": "Three ways to check",
  "no-x stack": "No cloud. No telemetry. No accounts.",
  "one-x triplet": "One key, one window, one download.",
  buzzword: "A seamless way to dictate.",
  "exclamation mark": "Try it today!",
};

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? sourceFiles(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : [],
  );
}

describe("copy style", () => {
  test("there is copy to check", () => {
    expect(copy.length).toBeGreaterThan(40);
  });

  test.each(Object.entries(SAMPLES))("the %s rule catches its sample", (name, sample) => {
    const rule = RULES.find(([n]) => n === name);
    expect(rule, name).toBeDefined();
    expect(rule![1].test(sample), sample).toBe(true);
  });

  test("every rule has a sample", () => {
    expect(RULES.map(([n]) => n).sort()).toEqual(Object.keys(SAMPLES).sort());
  });

  test.each(RULES)("no %s", (_, pattern) => {
    expect(copy.filter((s) => pattern.test(s))).toEqual([]);
  });

  test("no dashes in component or app source", () => {
    const files = [...sourceFiles(resolve(root, "components")), ...sourceFiles(resolve(root, "app"))];
    expect(files.filter((f) => /[—–]/.test(readFileSync(f, "utf8")))).toEqual([]);
  });

  test("section headings are plain labels, not slogans", () => {
    const headings = [content.CLEANUP_LEVELS.title, content.WORDS.title, content.AUDIO.title, content.INSTALL_GUIDE.title];
    for (const h of headings) {
      expect(h, h).not.toMatch(/[.!?]$/);
      expect(h.split(" ").length, h).toBeLessThanOrEqual(5);
    }
  });
});
