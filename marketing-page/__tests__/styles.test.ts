import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");

test("the waveform stops for reduced-motion users", () => {
  expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.wave-bar\s*\{\s*animation: none;/);
});

test("links get a visible keyboard focus ring", () => {
  expect(css).toMatch(/:focus-visible\s*\{[^}]*outline: 2px solid var\(--foreground\)/);
});

test("every color token is defined for dark mode too", () => {
  const tokens = [
    "--background",
    "--foreground",
    "--muted",
    "--card",
    "--border",
    "--desk",
    "--select",
    "--select-foreground",
    "--rec",
    "--logo-tile",
    "--logo-stroke",
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

test("headings and reading text use the serif, interface text the sans", () => {
  expect(css).toMatch(/body\s*\{[^}]*font-family: var\(--font-text\)/);
  expect(css).toMatch(/--font-sans: var\(--font-ui\)/);
  expect(css).toMatch(/--font-serif: var\(--font-text\)/);
  expect(css).toMatch(/--font-mono: var\(--font-code\)/);
  expect(css).not.toMatch(/archivo|geist/i);
});
