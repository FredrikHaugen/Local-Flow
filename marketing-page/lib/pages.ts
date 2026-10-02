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
  {
    path: "/features",
    nav: "Features",
    title: "peluni features: cleanup levels, vocabulary, speech models",
    description:
      "Cleanup levels, custom vocabulary, five whisper speech models from 78 MB to 1.6 GB, hands-free dictation, and how peluni pastes into any Mac app.",
    h1: "What peluni does",
    header: true,
  },
  {
    path: "/how-it-works",
    nav: "How it works",
    title: "How peluni works: dictation that stays on your Mac",
    description:
      "The five stages between holding Right ⌥ and seeing text: capture, silence trimming, whisper transcription, local cleanup and pasting.",
    h1: "How peluni turns speech into text",
    header: true,
  },
  {
    path: "/help",
    nav: "Help",
    title: "peluni help: setup, settings and messages",
    description:
      "Install peluni, allow Microphone and Accessibility, pick a speech model, and find out what each peluni message means and what to do about it.",
    h1: "Help with peluni",
    header: true,
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
