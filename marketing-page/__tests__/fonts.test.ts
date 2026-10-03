import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const serif = resolve(process.cwd(), "app/fonts/source-serif-4-latin.woff2");

const hasUvx = (() => {
  try {
    execFileSync("uvx", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

describe("Source Serif 4", () => {
  // The h1 and reading text are the mobile LCP element; this file was 122 KB with weights 200 to 900.
  test("stays under 90 KB", () => {
    expect(statSync(serif).size).toBeLessThan(90_000);
  });

  test("is still a woff2 file", () => {
    expect(readFileSync(serif).subarray(0, 4).toString("latin1")).toBe("wOF2");
  });

  test("README states the axes the file actually has", () => {
    const readme = readFileSync(resolve(process.cwd(), "app/fonts/README.md"), "utf8");
    expect(readme).toContain("Google serves `wght 200–900`");
    expect(readme).toContain("`opsz 8–60`, `wght 400–700`");
  });

  test("layout falls back to a serif while it loads", () => {
    const layout = readFileSync(resolve(process.cwd(), "app/layout.tsx"), "utf8");
    expect(layout).toMatch(/source-serif-4-latin\.woff2"[\s\S]*?adjustFontFallback: "Times New Roman"/);
  });

  // Skipped without uv, so a machine without it still runs the rest.
  test.skipIf(!hasUvx)(
    "keeps the weights the site uses (400 to 700) and optical sizing",
    () => {
      const script =
        "import sys; from fontTools.ttLib import TTFont; f = TTFont(sys.argv[1]); " +
        "print(' '.join(f'{a.axisTag}={a.minValue:g}:{a.maxValue:g}' for a in f['fvar'].axes))";
      const axes = execFileSync("uvx", ["--from", "fonttools[woff]", "python", "-c", script, serif], {
        encoding: "utf8",
      }).trim();
      expect(axes).toBe("wght=400:700 opsz=8:60");
    },
    60_000,
  );
});
