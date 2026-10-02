import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

// The old palette's utilities would now silently do nothing. Fail instead.
const STALE = /\b(?:bg|text|border|fill|stroke|decoration|ring|outline|from|to|shadow)-(?:accent|ink|cta-edge|wallpaper)(?:-[\w]+)?\b|\bfont-display\b|\bsurface-(?:ink|accent)\b/;

test("components use only the current tokens", () => {
  const dir = resolve(process.cwd(), "components");
  const offenders = readdirSync(dir)
    .filter((f) => f.endsWith(".tsx"))
    .flatMap((f) =>
      readFileSync(resolve(dir, f), "utf8")
        .split("\n")
        .map((line, i) => ({ where: `${f}:${i + 1}`, line }))
        .filter(({ line }) => STALE.test(line)),
    )
    .map(({ where }) => where);
  expect(offenders).toEqual([]);
});
