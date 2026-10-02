import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Static: generated once at build time into out/sitemap.xml (required by output: "export").
// No lastModified: a build-time date would change on every deploy and teach crawlers to ignore it.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE.url}/` }];
}
