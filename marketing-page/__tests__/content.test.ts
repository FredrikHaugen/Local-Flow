import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { CLEANUP_LEVELS, INSTALL_GUIDE, INTRO, USING } from "@/lib/content";
import { README_FACTS } from "@/lib/site";

const readme = readFileSync(resolve(process.cwd(), "../README.md"), "utf8");
const project = readFileSync(resolve(process.cwd(), "../docs/PROJECT.md"), "utf8");

describe("content facts", () => {
  test("the speed claim is the sourced one", () => {
    // The site rewords PROJECT.md's "typically in about a second with the base model" but keeps every part of it.
    expect(project).toContain("typically in about a second with the base model");
    const said = USING.paragraphs.join(" ");
    for (const part of ["Typically", "about a second", "with the base model"]) expect(said).toContain(part);
  });

  test("the intro is one short promise", () => {
    expect(INTRO.body.split(/\s+/).length).toBeLessThanOrEqual(25);
  });

  test.each(README_FACTS)("README and the site's requirements both state %s", (fact) => {
    expect(readme).toContain(fact);
    expect(INSTALL_GUIDE.requirements.map((r) => `${r.title} ${r.detail}`).join("\n")).toContain(fact);
  });

  test("each cleanup level strikes exactly the words its output drops", () => {
    const words = (t: string) => t.toLowerCase().replace(/[^a-z ]/g, " ").split(/\s+/).filter(Boolean);
    const raw = CLEANUP_LEVELS.raw.split(" ");
    for (const level of CLEANUP_LEVELS.levels) {
      const kept = raw.filter((_, i) => !(level.dropped as readonly number[]).includes(i));
      expect(words([...level.paragraphs, ...level.list].join(" ")), level.id).toEqual(kept);
    }
  });

  test("the hero scene strikes exactly the words its pasted line drops", () => {
    const words = (t: string) => t.toLowerCase().replace(/[^a-z ]/g, " ").split(/\s+/).filter(Boolean);
    const raw = USING.window.raw.split(" ");
    const kept = raw.filter((_, i) => !(USING.window.dropped as readonly number[]).includes(i));
    expect(words(USING.window.text)).toEqual(kept);
  });

  test("the cleanup section has the app's four levels, Light by default", () => {
    expect(CLEANUP_LEVELS.levels.map((l) => l.id)).toEqual(["none", "light", "medium", "high"]);
    expect(CLEANUP_LEVELS.defaultLevel).toBe("light");
  });

  test("install has its real steps", () => {
    expect(INSTALL_GUIDE.steps.length).toBe(4);
  });
});
