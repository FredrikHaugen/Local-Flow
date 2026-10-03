// The characters the fonts in app/fonts/ are subset to: printable ASCII plus every character in the
// site's source (copy in lib/, strings in components/ and app/) and ../CHANGELOG.md, which the
// changelog page renders. scripts/fonts.sh writes the result to app/fonts/charset.txt and
// __tests__/fonts.test.ts fails when the source holds a character the fonts don't.
// Run directly to print the set: `node scripts/font-charset.mjs`.
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const SOURCES = ["lib", "components", "app"];
const EXTENSIONS = /\.(ts|tsx)$/;

// Never in the latin files Google serves; browsers draw them from a system font.
export const FALLBACK_SYMBOLS = "→⌘⌥";

// JSX may spell a character as an HTML entity ("There&rsquo;s"); count what it renders as.
const NAMED = { rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", nbsp: "\u00a0", apos: "'", quot: '"', amp: "&" };
const decode = (text) =>
  text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (m, name) => NAMED[name] ?? m);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

/** @returns {string} the sorted characters, one string */
export function siteCharset() {
  const chars = new Set();
  for (let code = 0x20; code <= 0x7e; code++) chars.add(String.fromCharCode(code));
  const files = SOURCES.flatMap((dir) => walk(join(ROOT, dir)).filter((f) => EXTENSIONS.test(f)));
  files.push(join(ROOT, "../CHANGELOG.md"));
  for (const file of files) {
    for (const c of decode(readFileSync(file, "utf8"))) if (c.codePointAt(0) >= 0x20) chars.add(c);
  }
  return [...chars].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join("");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.stdout.write(siteCharset());
