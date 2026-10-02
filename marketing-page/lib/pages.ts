// Every page on the site, in navigation order. Metadata, the sitemap, the header, the footer and
// JSON-LD are all built from this list. Each page's copy is in lib/pages/<name>.ts.
import { INTRO } from "@/lib/content";
import { SEO, SITE } from "@/lib/site";

export type PageInfo = {
  path: string;
  /** The link text in the header and footer. */
  nav: string;
  title: string;
  description: string;
  h1: string;
  /** Linked from the header as well as the footer. */
  header: boolean;
};

export const PAGES: readonly PageInfo[] = [
  {
    path: "/",
    nav: "Home",
    title: SEO.title,
    description: SITE.description,
    h1: INTRO.title,
    header: false,
  },
];

export function page(path: string): PageInfo {
  const found = PAGES.find((p) => p.path === path);
  if (!found) throw new Error(`No page registered at ${path}`);
  return found;
}

export function pageUrl(path: string): string {
  return path === "/" ? `${SITE.url}/` : `${SITE.url}${path}`;
}
