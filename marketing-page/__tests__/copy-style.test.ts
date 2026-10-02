import { describe, expect, test } from "vitest";
import * as content from "@/lib/content";

// The patterns that made the old site read as generated. Every string in lib/content.ts is checked.
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

const copy = strings(content);

const RULES: [string, RegExp][] = [
  ["em or en dash", /[—–]/],
  ["negation-then-reveal", /\bnot (?:a|an|just|only)\b[^.]{0,40}[,:;]\s*(?:the|it'?s|but)\b/i],
  ["trust-signalling meta-language", /\b(?:honest(?:ly)?|take (?:our|my) word|only worth|trust us|by construction|under the hood|fair questions)\b/i],
  ["counting in threes", /\bthree (?:moves|steps|ways|things|reasons|checks)\b/i],
];

describe("copy style", () => {
  test("there is copy to check", () => {
    expect(copy.length).toBeGreaterThan(40);
  });

  test.each(RULES)("no %s", (_, pattern) => {
    expect(copy.filter((s) => pattern.test(s))).toEqual([]);
  });

  test("section headings are plain labels, not slogans", () => {
    const headings = [content.USING.title, content.CLEANUP_LEVELS.title, content.WORDS.title, content.AUDIO.title, content.INSTALL_GUIDE.title, content.QUESTIONS.title];
    for (const h of headings) {
      expect(h, h).not.toMatch(/[.!?]$/);
      expect(h.split(" ").length, h).toBeLessThanOrEqual(5);
    }
  });
});
