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
  // README "## Quick start (from source)". There is no release yet, so this is how to get peluni.
  buildUrl: `${repoUrl}#quick-start-from-source`,
  version: "0.0.1",
  license: "MIT",
} as const;

// Projects peluni is built on, linked from the copy so a reader can check what it says about them.
// whisper.cpp: Makefile WHISPER_ZIP_URL. MLX: Package.swift (mlx-swift-lm builds on mlx-swift).
export const UPSTREAM = {
  whisperCpp: "https://github.com/ggml-org/whisper.cpp",
  mlx: "https://github.com/ml-explore/mlx-swift",
  notarization: "https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution",
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
