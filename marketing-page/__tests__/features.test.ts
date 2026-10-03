import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import type { Block, Section } from "@/lib/blocks";
import { inlineText } from "@/lib/blocks";
import { FEATURES } from "@/lib/pages/features";

const source = (path: string) => readFileSync(resolve(process.cwd(), "..", path), "utf8");

function section(id: string): Section {
  const found = FEATURES.sections.find((s) => s.id === id);
  if (!found) throw new Error(`no section ${id}`);
  return found;
}
const tableOf = (s: Section) => s.blocks.find((b): b is Extract<Block, { table: unknown }> => "table" in b)!.table;
const textOf = (s: Section) =>
  s.blocks.map((b) => ("p" in b ? inlineText(b.p) : "list" in b ? b.list.map(inlineText).join(" ") : "")).join(" ");

describe("features facts", () => {
  test("the speech model table matches ModelCatalog", () => {
    const catalog = source("Sources/PeluniCore/ModelCatalog.swift");
    const models = [...catalog.matchAll(/displayName: "([^"(]+?) \([^"]*\)", sizeBytes: ([\d_]+)/g)].map((m) => ({
      name: m[1].trim(),
      bytes: Number(m[2].replaceAll("_", "")),
    }));
    expect(models).toHaveLength(5);
    // Decimal units, as Finder shows them: 147,951,465 bytes is 148 MB.
    const size = (bytes: number) => (bytes >= 1e9 ? `${(bytes / 1e9).toFixed(1)} GB` : `${Math.round(bytes / 1e6)} MB`);
    expect(tableOf(section("models")).rows.map((r) => [r[0], r[1]])).toEqual(models.map((m) => [m.name, size(m.bytes)]));
  });

  test("the language list matches the Models tab", () => {
    const tab = source("Sources/PeluniApp/UI/ModelsTab.swift");
    const languages = [...tab.matchAll(/Text\("([^"]+)"\)\.tag\("(?:auto|[a-z]{2})"\)/g)].map((m) => m[1]);
    expect(languages[0]).toBe("Auto-detect");
    for (const language of languages) expect(textOf(section("models"))).toContain(language);
  });

  test("the cleanup levels match the General tab's order", () => {
    const tab = source("Sources/PeluniApp/UI/GeneralTab.swift");
    const levels = [...tab.matchAll(/Text\("(None|Light|Medium|High) /g)].map((m) => m[1]);
    expect(tableOf(section("cleanup")).rows.map((r) => r[0].split(" ")[0])).toEqual(levels);
  });

  test("the cleanup timeout and skip threshold are the code's", () => {
    expect(source("Sources/PeluniApp/Services/CleanupEngine.swift")).toContain(".seconds(10)");
    expect(source("Sources/PeluniApp/UI/AdvancedTab.swift")).toMatch(/cleanupMinChars"\) private var \w+ = 50/);
    expect(textOf(section("cleanup"))).toContain("ten seconds");
    expect(textOf(section("cleanup"))).toContain("50 characters");
  });
});
