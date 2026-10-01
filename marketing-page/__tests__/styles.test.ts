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
  const tokens = ["--background", "--foreground", "--muted", "--card", "--border", "--accent", "--accent-foreground"];
  const dark = css.slice(css.indexOf("@media (prefers-color-scheme: dark)"));
  for (const token of tokens) {
    expect(css).toContain(`${token}:`);
    expect(dark).toContain(`${token}:`);
  }
});
