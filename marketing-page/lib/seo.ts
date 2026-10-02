import type { Metadata } from "next";
import { page } from "@/lib/pages";
import { SITE } from "@/lib/site";

// Each page's title, description, canonical link and share card, from the registry. The share image
// is app/opengraph-image.png, which Next adds to every page.
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
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.description,
    },
  };
}
