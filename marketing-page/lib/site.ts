// Product identity and the analytics settings. Page copy is in lib/content.ts.
// __tests__/content.test.ts cross-checks README_FACTS against the repo README.

const repoUrl = "https://github.com/FredrikHaugen/peluni";

export const SITE = {
  name: "peluni",
  // The canonical origin: metadataBase, the canonical link, sitemap, robots and JSON-LD all derive from it.
  url: "https://peluni.app",
  description:
    "peluni is free, open-source voice dictation for macOS. Hold Right ⌥, speak, and the text lands in the app you're using, transcribed and cleaned up on your Mac.",
  repoUrl,
  // /releases rather than /releases/latest: the latter 404s until the first release is published.
  releasesUrl: `${repoUrl}/releases`,
  version: "0.1.0",
  license: "MIT",
} as const;

// Search and share metadata. The <title> carries the words people search for ("dictation", "Mac",
// "offline"); "offline" is the Wi-Fi band's claim (content.ts AUDIO).
export const SEO = {
  title: `${SITE.name}: free offline voice dictation for Mac`,
  ogImageAlt: `${SITE.name}: free, open-source voice dictation for macOS that runs on your Mac.`,
  // JSON-LD: the requirement strings below are README_FACTS, so they stay in sync with the README.
  operatingSystem: "macOS 14 (Sonoma) or later",
  processor: "Apple Silicon (M1 or later)",
  category: "UtilitiesApplication",
} as const;

// Phone visitors: peluni is a Mac app, so the phone's job is to get this page onto the Mac.
export const PHONE = {
  handoffLead: "Reading on a phone?",
  handoffNote: "peluni runs on your Mac. Send yourself the link and download it there.",
  handoff: "Send this page to my Mac",
  shareTitle: "peluni: voice dictation for your Mac",
  copied: "Link copied. Open it on your Mac.",
} as const;

// Opt-in page analytics. Nothing from Clarity loads, and no cookie is set, until the visitor allows it.
export const ANALYTICS = {
  clarityId: "yreithgab3",
  storageKey: "lf-analytics",
  // Kept short: on a phone this bar sits over the hero until it's answered.
  banner: "Allow Microsoft Clarity analytics? It sets cookies and records anonymous sessions. Off unless you allow it.",
  allow: "Allow",
  decline: "No thanks",
  settings: "Analytics settings",
} as const;

// Strings that must appear verbatim in both the repo README and REQUIREMENTS.
export const README_FACTS = [
  "macOS 14 (Sonoma) or later",
  "Apple Silicon (M1 or later)",
  "148 MB",
  "78 MB",
  "1.6 GB",
  "0.7 GB",
  "2.3 GB",
] as const;
