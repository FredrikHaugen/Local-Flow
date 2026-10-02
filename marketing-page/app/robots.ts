import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Static: generated once at build time into out/robots.txt (required by output: "export").
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
