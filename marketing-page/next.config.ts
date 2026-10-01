import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain HTML/CSS in out/ — no server, hostable anywhere.
  output: "export",
  // One-page site, mostly first-time visitors: inline the (small, Tailwind) CSS so the hero
  // paints without waiting on a render-blocking stylesheet request.
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;
