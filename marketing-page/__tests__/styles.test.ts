import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");

test("the waveform stops for reduced-motion users", () => {
  expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.wave-bar\s*\{\s*animation: none;/);
});

test("links get a visible keyboard focus ring", () => {
  expect(css).toMatch(/:focus-visible\s*\{[^}]*outline: 2px solid var\(--accent\)/);
});

test("every color token is defined for dark mode too", () => {
  const tokens = [
    "--background",
    "--foreground",
    "--muted",
    "--card",
    "--border",
    "--accent",
    "--accent-foreground",
    "--ink",
    "--ink-foreground",
    "--ink-muted",
    "--ink-border",
    "--ink-accent",
  ];
  const dark = css.slice(css.indexOf("@media (prefers-color-scheme: dark)"));
  for (const token of tokens) {
    expect(css).toContain(`${token}:`);
    expect(dark).toContain(`${token}:`);
  }
});

test("every looping animation is stopped for reduced-motion users", () => {
  const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  for (const cls of [".caret", ".rec-dot"]) expect(reduced).toContain(cls);
  expect(reduced).toMatch(/animation: none !important;/);
});

test("ink and accent surfaces keep a visible focus ring", () => {
  expect(css).toMatch(/\.surface-ink :focus-visible\s*\{\s*outline-color: var\(--ink-accent\);/);
  expect(css).toMatch(/\.surface-accent :focus-visible\s*\{\s*outline-color: var\(--accent-foreground\);/);
});
