// Product identity, the demo's sample take and the analytics settings. Page copy is in lib/content.ts.
// __tests__/content.test.ts cross-checks README_FACTS against the repo README.

const repoUrl = "https://github.com/FredrikHaugen/peluni";

export const SITE = {
  name: "peluni",
  description:
    "peluni is free, open-source voice dictation for macOS. Hold Right ⌥, speak, and the text appears in whatever app you're using, transcribed and cleaned up on your Mac.",
  repoUrl,
  // /releases rather than /releases/latest: the latter 404s until the first release is published.
  releasesUrl: `${repoUrl}/releases`,
  version: "0.1.0",
  license: "MIT",
} as const;

// Phone visitors: peluni is a Mac app, so the phone's job is to get this page onto the Mac.
export const PHONE = {
  handoffLead: "Reading on a phone?",
  handoffNote: "peluni runs on your Mac. Send yourself the link and download it there.",
  handoff: "Send this page to my Mac",
  shareTitle: "peluni: voice dictation for your Mac",
  copied: "Link copied. Open it on your Mac.",
} as const;

export const DEMO = {
  // A rambling spoken take and what the conservative cleanup pass makes of it:
  // fillers dropped, capitals and punctuation added, nothing reworded.
  raw: "um hey priya so the build is basically ready uh I just need to fix the signing step and run the tests one more time I think we can like ship it friday afternoon if nothing breaks",
  cleaned:
    "Hey Priya, the build is ready. I just need to fix the signing step and run the tests one more time. I think we can ship it Friday afternoon if nothing breaks.",
  // Words in `raw` that the cleanup pass drops (shown struck through in the demo).
  fillers: ["um", "so", "basically", "uh", "like"],
  app: "Mail",
  to: "Priya",
  subject: "Friday release",
  heardLabel: "What you said",
  typedLabel: "What peluni typed",
  // The real overlay's label while recording (Sources/PeluniApp/UI/OverlayView.swift).
  overlayLabel: "Listening…  (esc to cancel)",
} as const;

// Opt-in page analytics. Nothing from Clarity loads, and no cookie is set, until the visitor allows it.
export const ANALYTICS = {
  clarityId: "yreithgab3",
  storageKey: "lf-analytics",
  banner:
    "Can we use Microsoft Clarity to see how people use this page? It sets cookies and records anonymous sessions. It stays off unless you allow it.",
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
