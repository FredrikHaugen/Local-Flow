import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

// The brand teal is pale: a fill behind ink text, never text or a thin stroke on paper.
// Those use accent-ink. The one exception is teal on an ink chip (bg-accent-foreground).
const LOW_CONTRAST = /(?<![\w:-])(?:text|border|decoration|outline)-accent(?![\w-])|marker:text-accent(?![\w-])/;

test("no pale-teal text or strokes outside ink chips", () => {
  const dir = resolve(process.cwd(), "components");
  const offenders = readdirSync(dir)
    .filter((f) => f.endsWith(".tsx"))
    .flatMap((f) =>
      readFileSync(resolve(dir, f), "utf8")
        .split("\n")
        .map((line, i) => ({ where: `${f}:${i + 1}`, line }))
        .filter(({ line }) => LOW_CONTRAST.test(line) && !line.includes("bg-accent-foreground")),
    )
    .map(({ where }) => where);
  expect(offenders).toEqual([]);
});
