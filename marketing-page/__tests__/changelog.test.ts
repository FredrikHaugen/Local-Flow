import { describe, expect, test } from "vitest";
import { CHANGELOG, parseChangelog } from "@/lib/changelog";
import { CHANGELOG_PAGE } from "@/lib/pages/changelog";
import { README_FACTS, SITE } from "@/lib/site";

describe("changelog parser", () => {
  test("reads versions, dates and items", () => {
    const md =
      "# Changelog\n\nIntro.\n\n## 1.0.0 (2026-11-01)\n\n### 2026-11-01\n\n- One.\n- Two.\n\n### 2026-10-30\n\n- Three.\n";
    expect(parseChangelog(md)).toEqual([
      {
        version: "1.0.0",
        status: "2026-11-01",
        days: [
          { date: "2026-11-01", items: ["One.", "Two."] },
          { date: "2026-10-30", items: ["Three."] },
        ],
      },
    ]);
  });

  test("refuses a date before any version", () => {
    expect(() => parseChangelog("### 2026-11-01\n- One.")).toThrow(/before any version/);
  });

  test("refuses an item before any date", () => {
    expect(() => parseChangelog("## 1.0.0 (unreleased)\n- One.")).toThrow(/before any date/);
  });
});

describe("the repo's CHANGELOG.md", () => {
  test("starts at the site's version", () => {
    expect(CHANGELOG[0].version).toBe(SITE.version);
  });

  test("lists days newest first", () => {
    for (const release of CHANGELOG) {
      const dates = release.days.map((d) => d.date);
      expect(dates).toEqual([...dates].sort().reverse());
    }
  });
});

describe("changelog entries", () => {
  test("each says what kind of change it is in its first word", () => {
    for (const item of CHANGELOG.flatMap((r) => r.days.flatMap((d) => d.items))) {
      expect(item, item).toMatch(/^(Added|Changed|Fixed|Removed) /);
    }
  });

  test("the page states what each version needs, in the README's words", () => {
    for (const fact of README_FACTS.slice(0, 2)) expect(CHANGELOG_PAGE.requires).toContain(fact);
  });
});
