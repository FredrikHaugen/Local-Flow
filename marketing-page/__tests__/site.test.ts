import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { DEMO, HERO, HERO_FINEPRINT, NAV, PIPELINE, README_FACTS, REQUIREMENTS, SITE, STEPS } from "@/lib/site";

const readme = readFileSync(resolve(process.cwd(), "../README.md"), "utf8");
const requirementsText = REQUIREMENTS.map((r) => `${r.title} ${r.detail}`).join("\n");

describe("site facts", () => {
  test.each(README_FACTS)("README still states %s", (fact) => {
    expect(readme).toContain(fact);
  });

  test.each(README_FACTS)("site requirements state %s", (fact) => {
    expect(requirementsText).toContain(fact);
  });

  test("links point at the GitHub repo", () => {
    expect(SITE.repoUrl).toBe("https://github.com/FredrikHaugen/Local-Flow");
    expect(SITE.releasesUrl).toBe(`${SITE.repoUrl}/releases`);
  });

  test("version matches the README", () => {
    expect(readme).toContain(`v${SITE.version}`);
    expect(HERO_FINEPRINT).toContain(`v${SITE.version}`);
  });

  test("the demo only strikes words the cleanup actually drops", () => {
    const raw = DEMO.raw.split(" ");
    const cleaned = DEMO.cleaned.toLowerCase().replace(/[^a-z ]/g, "").split(" ");
    for (const filler of DEMO.fillers) {
      expect(raw).toContain(filler);
      expect(cleaned).not.toContain(filler);
    }
  });

  test("the hero emphasis is part of the tagline", () => {
    expect(SITE.tagline).toContain(HERO.emphasis);
  });

  test("structure", () => {
    expect(STEPS).toHaveLength(3);
    expect(PIPELINE.map((s) => s.name)).toEqual(["Capture", "Trim", "Transcribe", "Clean up", "Inject"]);
    expect(NAV.every((n) => n.href.startsWith("#"))).toBe(true);
  });
});
