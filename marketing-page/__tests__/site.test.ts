import { describe, expect, test } from "vitest";
import { DEMO, SITE } from "@/lib/site";

describe("site facts", () => {
  test("links point at the GitHub repo", () => {
    expect(SITE.repoUrl).toBe("https://github.com/FredrikHaugen/peluni");
    expect(SITE.releasesUrl).toBe(`${SITE.repoUrl}/releases`);
  });

  test("the demo only drops fillers and adds punctuation", () => {
    const words = (t: string) => t.toLowerCase().replace(/[^a-z ]/g, "").split(/\s+/).filter(Boolean);
    const kept = words(DEMO.raw).filter((w) => !(DEMO.fillers as readonly string[]).includes(w));
    expect(words(DEMO.cleaned)).toEqual(kept);
  });
});
