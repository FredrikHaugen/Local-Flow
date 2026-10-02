// Post-build: start loading the Next.js runtime after the page has painted, not alongside it.
//
// The page is static HTML; its only client code is the phone menu and the send-to-Mac button.
// Left as-is, ~140 KB of async runtime scripts are requested in the same instant as the HTML and
// compete with the fonts for the first paint on slow connections. This moves each async
// <script src> (and its <link rel="preload" as="script">) into a tiny inline loader that adds them
// once the window has loaded. Same files, same order of magnitude of work, just after first paint.
// Inline only: nothing here talks to anything but this origin.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname;

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

const SCRIPT = /<script src="([^"]+)"(?: id="([^"]+)")? async=""><\/script>/g;
const PRELOAD = /<link rel="preload" as="script"[^>]*>/g;

let total = 0;
for (const file of htmlFiles(OUT)) {
  const html = readFileSync(file, "utf8");
  const scripts = [];
  let next = html.replace(SCRIPT, (_, src, id) => {
    scripts.push(id ? [src, id] : [src]);
    return "";
  });
  if (scripts.length === 0) continue;
  next = next.replace(PRELOAD, "");
  const loader =
    `<script>(function(){var s=${JSON.stringify(scripts)};function go(){s.forEach(function(x){` +
    `var e=document.createElement("script");e.src=x[0];e.setAttribute("async","");if(x[1])e.id=x[1];` +
    `document.head.appendChild(e)})}if(document.readyState==="complete")setTimeout(go);` +
    `else addEventListener("load",function(){setTimeout(go)})})()</script>`;
  next = next.replace("</body>", `${loader}</body>`);
  writeFileSync(file, next);
  total += scripts.length;
}

if (total === 0) {
  console.error("defer-hydration: found no async runtime scripts to defer; has the Next.js output changed?");
  process.exit(1);
}
console.log(`defer-hydration: deferred ${total} runtime scripts until after load.`);
