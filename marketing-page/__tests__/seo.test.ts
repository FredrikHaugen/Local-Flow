import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test, vi } from "vitest";
import { metadata as layoutMetadata } from "@/app/layout";
import { metadata } from "@/app/page";
import { GET, llmsTxt } from "@/app/llms.txt/route";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { homeJsonLd as jsonLd, pageJsonLd } from "@/components/JsonLd";
import { AUDIO, QUESTIONS } from "@/lib/content";
import { PAGES } from "@/lib/pages";
import { FAQ, faqForJsonLd } from "@/lib/pages/faq";
import { README_FACTS, SEO, SITE } from "@/lib/site";

// next/font only works inside a Next build; the layout's metadata base is all this file needs from it.
vi.mock("next/font/local", () => ({ default: () => ({ variable: "" }) }));

const readme = readFileSync(resolve(process.cwd(), "../README.md"), "utf8");

describe("search metadata", () => {
  test("one canonical origin everywhere", () => {
    expect(SITE.url).toBe("https://peluni.app");
    expect(layoutMetadata.metadataBase?.toString()).toBe(`${SITE.url}/`);
    expect(metadata.alternates?.canonical).toBe("/");
    expect(sitemap()).toEqual(
      PAGES.map((p) => ({ url: p.path === "/" ? `${SITE.url}/` : `${SITE.url}${p.path}` })),
    );
    expect(robots().sitemap).toBe(`${SITE.url}/sitemap.xml`);
  });

  test("robots lets every crawler in", () => {
    expect(robots().rules).toEqual([{ userAgent: "*", allow: "/" }]);
  });

  test("the title names what people search for", () => {
    expect(metadata.title).toBe(SEO.title);
    for (const word of ["dictation", "Mac", "offline"]) expect(SEO.title).toContain(word);
    // "Offline" is only true because the app goes online just to fetch a model, as the Wi-Fi band says.
    expect(AUDIO.display).toContain("Wi-Fi off");
    expect(AUDIO.paragraphs.join(" ")).toContain("only goes online to fetch a model");
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

describe("FAQ JSON-LD", () => {
  test("is a FAQPage carrying every visible question and answer", () => {
    const data = pageJsonLd("/faq", faqForJsonLd());
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity?.map((q) => q.name)).toEqual(FAQ.items.map((i) => i.q));
  });

  test("other pages are plain WebPages", () => {
    expect(pageJsonLd("/features")["@type"]).toBe("WebPage");
  });
});

describe("llms.txt", () => {
  test("is Markdown built from the site's facts", async () => {
    const text = llmsTxt();
    expect(text.startsWith(`# ${SITE.name}\n\n> ${SITE.description}`)).toBe(true);
    expect(text).toContain(SITE.releasesUrl);
    for (const item of QUESTIONS.items) expect(text).toContain(item.a);
    expect(await GET().text()).toBe(text);
  });
});

describe("llms.txt pages", () => {
  test("lists every page with its address and description", () => {
    const text = llmsTxt();
    for (const p of PAGES.filter((p) => p.path !== "/")) {
      expect(text).toContain(`[${p.nav}](${SITE.url}${p.path})`);
      expect(text).toContain(p.description);
    }
  });
});
