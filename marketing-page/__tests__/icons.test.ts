import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";
import manifest from "@/app/manifest";
import { SITE } from "@/lib/site";

const at = (p: string) => resolve(process.cwd(), p);

test("icons sit where Next.js picks them up", () => {
  for (const p of ["app/favicon.ico", "app/icon.svg", "app/apple-icon.png", "public/android-chrome-192x192.png", "public/android-chrome-512x512.png"]) {
    expect(existsSync(at(p)), p).toBe(true);
  }
  expect(existsSync(at("app/favicon")), "upload folder removed").toBe(false);
});

test("the SVG icon is the logomark and switches variant with the browser theme", () => {
  const svg = readFileSync(at("app/icon.svg"), "utf8");
  expect(svg).toContain("M20 41H43.6522L68.7826 83H88");
  expect(svg).toContain("#9DDEB9");
  expect(svg).toMatch(/@media \(prefers-color-scheme: dark\)/);
});

test("the manifest names the product and lists the android icons", () => {
  const m = manifest();
  expect(m.name).toBe(SITE.name);
  expect(m.short_name).toBe(SITE.name);
  expect(m.icons?.map((i) => i.src)).toEqual(["/android-chrome-192x192.png", "/android-chrome-512x512.png"]);
});
