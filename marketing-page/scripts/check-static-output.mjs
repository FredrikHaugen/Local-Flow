// Post-build guard: the site must not make third-party requests.
// Run via `pnpm check` (next build + this script).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { findExternalCssUrls, findExternalRefs } from "./external-refs.mjs";

const OUT = "out";

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

if (!existsSync(join(OUT, "index.html"))) {
  console.error(`${OUT}/index.html not found — run \`pnpm build\` first (is output: "export" set?).`);
  process.exit(1);
}

const files = walk(OUT);
const problems = files.flatMap((file) => {
  if (file.endsWith(".html")) {
    const html = readFileSync(file, "utf8");
    // CSS is inlined into <style> tags (experimental.inlineCss), so scan those for remote url()s too.
    const inlineCss = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
    return [...findExternalRefs(html), ...findExternalCssUrls(inlineCss)].map((u) => `${file}: ${u}`);
  }
  if (file.endsWith(".css")) return findExternalCssUrls(readFileSync(file, "utf8")).map((u) => `${file}: ${u}`);
  return [];
});

if (problems.length > 0) {
  console.error(`Third-party requests found in ${OUT}/:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`OK: scanned ${files.length} files in ${OUT}/, no third-party requests.`);
