// After `next build`: every page in out/sitemap.xml has one h1, a title and description no other page
// shares, a canonical link to itself, a share image, and JSON-LD that parses and names the page.
// No page outside the sitemap except the 404, which must be noindex. Run by `pnpm check`.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const out = join(process.cwd(), "out");
const urls = [...readFileSync(join(out, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const errors = [];
const seen = { title: new Map(), description: new Map() };
const meta = (html, attr, name) => html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1];
const fileFor = (path) => join(out, path === "/" ? "index.html" : `${path.slice(1)}.html`);

for (const url of urls) {
  const path = new URL(url).pathname;
  const file = fileFor(path);
  if (!existsSync(file)) {
    errors.push(`${path}: ${file} is missing`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1s !== 1) errors.push(`${path}: ${h1s} h1 elements`);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const description = meta(html, "name", "description");
  for (const [key, value] of [
    ["title", title],
    ["description", description],
  ]) {
    if (!value) errors.push(`${path}: no ${key}`);
    else if (seen[key].has(value)) errors.push(`${path}: same ${key} as ${seen[key].get(value)}`);
    else seen[key].set(value, path);
  }

  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (!canonical || new URL(canonical).href !== new URL(url).href) errors.push(`${path}: canonical is ${canonical}`);
  if (!meta(html, "property", "og:image")) errors.push(`${path}: no og:image`);
  if (!meta(html, "property", "og:url")) errors.push(`${path}: no og:url`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  let data = [];
  try {
    data = blocks.map((b) => JSON.parse(b));
  } catch (e) {
    errors.push(`${path}: JSON-LD doesn't parse (${e.message})`);
  }
  const nodes = data.flatMap((d) => d["@graph"] ?? [d]);
  const types = nodes.map((n) => n["@type"]);
  if (path === "/") {
    if (!types.includes("SoftwareApplication")) errors.push(`/: no SoftwareApplication JSON-LD`);
  } else {
    const pageNode = nodes.find((n) => n["@type"] === "WebPage" || n["@type"] === "FAQPage");
    if (!pageNode) errors.push(`${path}: no WebPage JSON-LD`);
    else if (new URL(pageNode.url).href !== new URL(url).href) errors.push(`${path}: JSON-LD url is ${pageNode.url}`);
  }
  if (types.includes("FAQPage") !== (path === "/faq")) errors.push(`${path}: FAQPage belongs on /faq only`);
}

const listed = new Set(urls.map((u) => fileFor(new URL(u).pathname)));
for (const name of readdirSync(out).filter((n) => n.endsWith(".html"))) {
  const file = join(out, name);
  if (listed.has(file)) continue;
  if (name === "404.html" || name.startsWith("_")) {
    if (name === "404.html" && !/<meta name="robots" content="noindex/.test(readFileSync(file, "utf8")))
      errors.push("404.html: not noindex");
    continue;
  }
  errors.push(`${name}: a page that isn't in the sitemap`);
}

if (errors.length) {
  console.error(`check-seo-output: ${errors.length} problem(s)\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(
  `OK: ${urls.length} pages in the sitemap, each with one h1, its own title and description, a canonical link, a share image and JSON-LD.`,
);
