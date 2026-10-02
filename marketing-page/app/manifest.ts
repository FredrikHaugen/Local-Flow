import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Static: generated once at build time into out/manifest.webmanifest (required by output: "export").
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f5f1",
    theme_color: "#141413",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
