import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import * as content from "@/lib/content";
import { ALL_PAGE_COPY } from "@/lib/pages/all";

// Claims about pasting and the clipboard, tied to what TextInjector.swift and CleanupPromptBuilder.swift
// actually do. These are the sentences a reader can test in a minute, so they must be exact.
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}
const copy = strings({ content, ALL_PAGE_COPY });
const source = (path: string) => readFileSync(resolve(process.cwd(), "..", path), "utf8");

describe("paste and clipboard claims", () => {
  test("peluni can't tell whether an app accepted the paste, so no copy says it can", () => {
    // TextInjector reports .posted once the ⌘V is sent; only a failure to create the keystroke falls back.
    expect(source("Sources/PeluniApp/Services/TextInjector.swift")).toContain("return .eventFailure");
    expect(copy.filter((s) => /(refused|won't accept|refuse) the paste|paste can't land/i.test(s))).toEqual([]);
  });

  test("clipboard restore is described as restoring text, which is all it saves", () => {
    expect(source("Sources/PeluniApp/Services/TextInjector.swift")).toContain("let saved = pb.string(forType: .string)");
    const restore = copy.filter((s) => /(puts it back|restored after|saved before)/i.test(s));
    expect(restore.length).toBeGreaterThan(0);
    for (const s of restore) expect(s, s).toMatch(/text on your clipboard|clipboard text/i);
  });

  test("cleanup's output check is described by length, which is what it measures", () => {
    expect(source("Sources/PeluniCore/CleanupPromptBuilder.swift")).toContain("input.count * 5 / 2 + 40");
    expect(copy.filter((s) => /added words you didn't say/i.test(s))).toEqual([]);
  });

  test("the disk-space margin is only promised for speech models, which are the only downloads that check it", () => {
    expect(copy.filter((s) => /A download needs its own size/i.test(s))).toEqual([]);
  });
});
