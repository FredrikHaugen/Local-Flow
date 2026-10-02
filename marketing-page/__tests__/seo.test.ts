import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test, vi } from "vitest";
import { metadata } from "@/app/layout";
import { GET, llmsTxt } from "@/app/llms.txt/route";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { jsonLd } from "@/components/JsonLd";
import { FAQ, README_FACTS, SEO, SITE } from "@/lib/site";

// next/font only works inside a Next build; the layout's metadata is all this file needs.
vi.mock("next/font/local", () => ({ default: () => ({ variable: "" }) }));

const readme = readFileSync(resolve(process.cwd(), "../README.md"), "utf8");

describe("search metadata", () => {
  test("one canonical origin everywhere", () => {
    expect(SITE.url).toBe("https://peluni.app");
    expect(metadata.metadataBase?.toString()).toBe(`${SITE.url}/`);
    expect(metadata.alternates?.canonical).toBe("/");
    expect(sitemap()).toEqual([{ url: `${SITE.url}/` }]);
    expect(robots().sitemap).toBe(`${SITE.url}/sitemap.xml`);
  });

  test("robots lets every crawler in", () => {
    expect(robots().rules).toEqual([{ userAgent: "*", allow: "/" }]);
  });

  test("the title names what people search for", () => {
    expect(metadata.title).toBe(SEO.title);
    for (const word of ["dictation", "Mac", "offline"]) expect(SEO.title).toContain(word);
    // "Offline" is only true because the FAQ says everything but model downloads works offline.
    expect(FAQ.items.some((i) => i.a.includes("works offline"))).toBe(true);
  });

  test("shares get a large preview card", () => {
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(metadata.openGraph).toMatchObject({ siteName: SITE.name, url: "/" });
    const png = readFileSync(resolve(process.cwd(), "app/opengraph-image.png"));
    // PNG header: width and height at bytes 16-23.
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  });
});

describe("JSON-LD", () => {
  const graph = jsonLd()["@graph"];
  const app = graph.find((n) => n["@type"] === "SoftwareApplication")!;

  test("describes a free macOS app at the current version", () => {
    expect(app).toMatchObject({
      name: SITE.name,
      softwareVersion: SITE.version,
      isAccessibleForFree: true,
      downloadUrl: SITE.releasesUrl,
      offers: { price: "0" },
    });
  });

  test("requirements are the README's own words", () => {
    for (const req of [SEO.operatingSystem, SEO.processor]) {
      expect(README_FACTS).toContain(req);
      expect(readme).toContain(req);
    }
  });

  test("carries no ratings, reviews or FAQPage", () => {
    const json = JSON.stringify(jsonLd());
    for (const banned of ["aggregateRating", "review", "FAQPage", "HowTo"]) expect(json).not.toContain(banned);
  });
});

describe("llms.txt", () => {
  test("is Markdown built from the site's facts", async () => {
    const text = llmsTxt();
    expect(text.startsWith(`# ${SITE.name}\n\n> ${SITE.description}`)).toBe(true);
    expect(text).toContain(SITE.releasesUrl);
    for (const item of FAQ.items) expect(text).toContain(item.a);
    expect(await GET().text()).toBe(text);
  });
});
