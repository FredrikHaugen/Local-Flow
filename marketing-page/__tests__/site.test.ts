import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { DEMO, HERO, HERO_FINEPRINT, HERO_PROOF, NAV, PIPELINE, README_FACTS, REQUIREMENTS, SITE, SPEED, STEPS } from "@/lib/site";

const readme = readFileSync(resolve(process.cwd(), "../README.md"), "utf8");
const project = readFileSync(resolve(process.cwd(), "../docs/PROJECT.md"), "utf8");
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

  test("the speed stamp is sourced from docs/PROJECT.md", () => {
    expect(project).toContain(SPEED.source);
    expect(project).toContain(SPEED.realtime);
    // The h1 leads with the sourced speed claim.
    expect(SITE.tagline).toContain("about a second");
    expect(SPEED.intro.toLowerCase()).toContain(SPEED.source);
    expect(SPEED.scaleNote).toContain(SPEED.realtime);
  });

  test("the cleaned demo only drops fillers and adds punctuation", () => {
    const words = (t: string) => t.toLowerCase().replace(/[^a-z ]/g, "").split(/\s+/).filter(Boolean);
    const kept = words(DEMO.raw).filter((w) => !(DEMO.fillers as readonly string[]).includes(w));
    expect(words(DEMO.cleaned)).toEqual(kept);
  });

  test("the hero proof names the real stack and the sourced speed", () => {
    for (const { name } of HERO_PROOF.stack) expect(readme).toContain(name);
    expect(project).toContain(HERO_PROOF.stat);
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
