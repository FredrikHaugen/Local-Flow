import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { SITE } from "@/lib/site";

describe("site facts", () => {
  test("links point at the GitHub repo", () => {
    expect(SITE.repoUrl).toBe("https://github.com/FredrikHaugen/peluni");
    expect(SITE.buildUrl).toBe(`${SITE.repoUrl}#quick-start-from-source`);
  });
});

describe("the version", () => {
  test("is the app's own, from Info.plist", () => {
    const plist = readFileSync(resolve(process.cwd(), "../Packaging/Info.plist"), "utf8");
    const app = plist.match(/<key>CFBundleShortVersionString<\/key><string>([^<]+)<\/string>/)?.[1];
    expect(app).toBe("0.0.1");
    expect(SITE.version).toBe(app);
  });
});
