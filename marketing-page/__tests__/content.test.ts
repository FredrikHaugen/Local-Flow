import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { CLEANUP_LEVELS, INSTALL_GUIDE, INTRO, USING, WORDS } from "@/lib/content";
import { README_FACTS } from "@/lib/site";

const readme = readFileSync(resolve(process.cwd(), "../README.md"), "utf8");
const project = readFileSync(resolve(process.cwd(), "../docs/PROJECT.md"), "utf8");

describe("content facts", () => {
  test("the speed claim is the sourced one", () => {
    const phrase = "typically in about a second with the base model";
    expect(project).toContain(phrase);
    expect(USING.paragraphs.join(" ")).toContain(phrase);
  });

  test("the intro is one short promise", () => {
    expect(INTRO.body.split(/\s+/).length).toBeLessThanOrEqual(25);
  });

  test.each(README_FACTS)("README and the site's requirements both state %s", (fact) => {
    expect(readme).toContain(fact);
    expect(INSTALL_GUIDE.requirements.map((r) => `${r.title} ${r.detail}`).join("\n")).toContain(fact);
  });

  test("model sizes agree with the README facts", () => {
    const sizes = WORDS.models.map((m) => m.size);
    for (const fact of ["78 MB", "148 MB", "1.6 GB"]) expect(sizes).toContain(fact);
  });

  test("each cleanup level strikes exactly the words its output drops", () => {
    const words = (t: string) => t.toLowerCase().replace(/[^a-z ]/g, " ").split(/\s+/).filter(Boolean);
    const raw = CLEANUP_LEVELS.raw.split(" ");
    for (const level of CLEANUP_LEVELS.levels) {
      const kept = raw.filter((_, i) => !(level.dropped as readonly number[]).includes(i));
      expect(words([...level.paragraphs, ...level.list].join(" ")), level.id).toEqual(kept);
    }
  });

  test("the cleanup picker has the app's four levels, Light by default", () => {
    expect(CLEANUP_LEVELS.levels.map((l) => l.id)).toEqual(["none", "light", "medium", "high"]);
    expect(CLEANUP_LEVELS.defaultLevel).toBe("light");
  });

  test("install has its real steps, and the checksum line matches the release file name", () => {
    expect(INSTALL_GUIDE.steps.length).toBe(4);
    expect(INSTALL_GUIDE.checksumCommand).toBe("shasum -a 256 -c peluni-<version>.dmg.sha256");
    expect(readme).toContain("shasum -a 256 -c peluni-<version>.dmg.sha256");
  });
});
