import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

// Reads the color tokens straight from globals.css and checks the pairs the site actually uses.
const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");
const darkAt = css.indexOf("@media (prefers-color-scheme: dark)");
const themeAt = css.indexOf("@theme inline");

function tokens(block: string) {
  const map: Record<string, string> = {};
  for (const m of block.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)) map[m[1]] = m[2].toLowerCase();
  return map;
}

const light = tokens(css.slice(0, darkAt));
const dark = { ...light, ...tokens(css.slice(darkAt, themeAt)) };

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  if (!a || !b) throw new Error(`missing token: ${a} / ${b}`);
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe.each([
  ["light", light],
  ["dark", dark],
])("%s theme", (_, t) => {
  test.each([
    ["--foreground", "--background"],
    ["--foreground", "--card"],
    ["--muted", "--background"],
    ["--muted", "--card"],
    ["--foreground", "--desk"],
    ["--select-foreground", "--select"],
    ["--overlay-foreground", "--overlay"],
    ["--logo-stroke", "--logo-tile"],
  ])("%s on %s is readable (4.5:1)", (fg, bg) => {
    expect(contrast(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
  });

  test("the logo teal is the record light", () => {
    expect(t["--rec"]).toBe("#9ddeb9");
  });
});

test("dark mode is charcoal, not near-black", () => {
  expect(luminance(dark["--background"])).toBeGreaterThanOrEqual(0.01);
});
