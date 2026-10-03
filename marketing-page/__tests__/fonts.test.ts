import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { FALLBACK_SYMBOLS, siteCharset } from "../scripts/font-charset.mjs";

const font = (name: string) => resolve(process.cwd(), "app/fonts", `${name}.woff2`);
const FONTS = ["source-serif-4-latin", "atkinson-hyperlegible-next-latin", "atkinson-hyperlegible-mono-latin"];
const charset = readFileSync(resolve(process.cwd(), "app/fonts/charset.txt"), "utf8");

const hasUvx = (() => {
  try {
    execFileSync("uvx", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

describe("font subsets", () => {
  // Fonts carry only the characters the site uses (scripts/fonts.sh). A character added to the copy or
  // CHANGELOG.md that isn't in charset.txt would render in a fallback font, so run scripts/fonts.sh.
  test("every character in the copy and changelog is in the subset", () => {
    const missing = [...siteCharset()].filter((c) => !charset.includes(c));
    expect(missing, "run `sh scripts/fonts.sh` to rebuild the fonts").toEqual([]);
  });

  test("reads characters written as HTML entities in JSX", () => {
    // app/not-found.tsx writes "There&rsquo;s"; the page renders a curly apostrophe.
    expect(siteCharset()).toContain("’");
  });

  test("always keeps printable ASCII", () => {
    for (let code = 0x20; code <= 0x7e; code++) expect(charset).toContain(String.fromCharCode(code));
  });

  // The h1 and reading text are the mobile LCP element: 122 KB with weights 200 to 900 and the full
  // latin range, 52 KB as subset here.
  test.each([
    ["source-serif-4-latin", 60_000],
    ["atkinson-hyperlegible-next-latin", 25_000],
    ["atkinson-hyperlegible-mono-latin", 13_000],
  ])("%s stays under %i bytes", (name, max) => {
    expect(statSync(font(name)).size).toBeLessThan(max);
  });

  test.each(FONTS)("%s is still a woff2 file", (name) => {
    expect(readFileSync(font(name)).subarray(0, 4).toString("latin1")).toBe("wOF2");
  });

  test("README says how the files are made", () => {
    const readme = readFileSync(resolve(process.cwd(), "app/fonts/README.md"), "utf8");
    expect(readme).toContain("scripts/fonts.sh");
    expect(readme).toContain("Google serves `wght 200–900`");
  });

  test("layout falls back to a serif while it loads", () => {
    const layout = readFileSync(resolve(process.cwd(), "app/layout.tsx"), "utf8");
    expect(layout).toMatch(/source-serif-4-latin\.woff2"[\s\S]*?adjustFontFallback: "Times New Roman"/);
  });

  // Skipped without uv, so a machine without it still runs the rest.
  const py = (script: string, ...args: string[]) =>
    execFileSync("uvx", ["--from", "fonttools[woff]", "python", "-c", script, ...args], { encoding: "utf8" }).trim();

  test.skipIf(!hasUvx)(
    "serif keeps the weights the site uses (400 to 700) and optical sizing",
    () => {
      const axes = py(
        "import sys; from fontTools.ttLib import TTFont; f = TTFont(sys.argv[1]); " +
          "print(' '.join(f'{a.axisTag}={a.minValue:g}:{a.maxValue:g}' for a in f['fvar'].axes))",
        font("source-serif-4-latin"),
      );
      expect(axes).toBe("wght=400:700 opsz=8:60");
    },
    60_000,
  );

  test.skipIf(!hasUvx)(
    "each font draws every character in the subset",
    () => {
      for (const name of FONTS) {
        const missing = py(
          "import sys; from fontTools.ttLib import TTFont; m = TTFont(sys.argv[1]).getBestCmap(); " +
            "print(''.join(c for c in open(sys.argv[2], encoding='utf-8').read() if ord(c) not in m))",
          font(name),
          resolve(process.cwd(), "app/fonts/charset.txt"),
        );
        // These symbols were never in the latin files Google serves; they come from the system font.
        expect([...missing].filter((c) => !FALLBACK_SYMBOLS.includes(c)), name).toEqual([]);
      }
    },
    120_000,
  );
});
