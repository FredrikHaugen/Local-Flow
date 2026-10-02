import type { Metadata } from "next";
import { page } from "@/lib/pages";
import { SEO, SITE } from "@/lib/site";

// Each page's title, description, canonical link and share card, from the registry. The share image
// is app/opengraph-image.png; Next only attaches the file to the home segment once a page sets its own
// openGraph, so every page names it here (scripts/check-seo-output.mjs checks the built HTML).
const SHARE_IMAGE = { url: "/opengraph-image.png", width: 1200, height: 630, alt: SEO.ogImageAlt };

export function pageMetadata(path: string): Metadata {
  const p = page(path);
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: p.path },
    openGraph: {
      title: p.title,
      description: p.description,
      url: p.path,
      siteName: SITE.name,
      locale: "en_US",
      type: "website",
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.description,
      images: [SHARE_IMAGE],
    },
  };
}
