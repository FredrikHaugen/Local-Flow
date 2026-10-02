import { describe, expect, test } from "vitest";
import { SITE } from "@/lib/site";

describe("site facts", () => {
  test("links point at the GitHub repo", () => {
    expect(SITE.repoUrl).toBe("https://github.com/FredrikHaugen/peluni");
    expect(SITE.releasesUrl).toBe(`${SITE.repoUrl}/releases`);
  });
});
