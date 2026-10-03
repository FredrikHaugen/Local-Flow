import type { MetadataRoute } from "next";
import { PAGES, pageUrl } from "@/lib/pages";

// Static: generated once at build time into out/sitemap.xml (required by output: "export").
// No lastModified: a build-time date would change on every deploy and teach crawlers to ignore it.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({ url: pageUrl(p.path) }));
}
