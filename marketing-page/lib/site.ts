// Single source of truth for every product fact on the site.
// __tests__/site.test.ts cross-checks README_FACTS against the repo README.

const repoUrl = "https://github.com/FredrikHaugen/Local-Flow";

export const SITE = {
  name: "LocalFlow",
  tagline: "Voice dictation that never leaves your Mac.",
  description:
    "LocalFlow is free, open-source voice dictation for macOS. Hold Right ⌥, speak, and clean text appears in any app — transcribed and cleaned up entirely on-device.",
  repoUrl,
  // /releases rather than /releases/latest: the latter 404s until the first release is published.
  releasesUrl: `${repoUrl}/releases`,
  version: "0.1.0",
  license: "MIT",
} as const;

export const HERO_FINEPRINT = `Free & open source · macOS 14+ · Apple Silicon · v${SITE.version}`;

export const NAV = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#under-the-hood", label: "Under the hood" },
  { href: "#privacy", label: "Privacy" },
  { href: "#requirements", label: "Requirements" },
] as const;

export const DEMO = {
  raw: "um so I think we should uh ship it friday",
  cleaned: "I think we should ship it Friday.",
} as const;

export const STEPS = [
  {
    title: "Hold Right ⌥",
    body: "Anywhere — your editor, a chat window, a browser form. A small waveform shows LocalFlow is listening.",
  },
  {
    title: "Speak naturally",
    body: "Ums, restarts and missing punctuation are fine. Add your names and jargon to the vocabulary and they come out right.",
  },
  {
    title: "Let go",
    body: "Clean text is pasted where your cursor is, and your clipboard is put back exactly as it was.",
  },
] as const;

export const CONTROLS = [
  { action: "Push-to-talk", keys: "Hold Right ⌥" },
  { action: "Hands-free", keys: "Double-tap Right ⌥, press once to stop" },
  { action: "Cancel", keys: "Esc" },
] as const;

export const PIPELINE = [
  { name: "Capture", body: "The mic is recorded at 16 kHz and streamed to the waveform overlay." },
  { name: "Trim", body: "Silence is stripped. Under 0.3 s of speech counts as an accidental tap and is discarded." },
  {
    name: "Transcribe",
    body: "whisper.cpp on the Metal GPU, biased toward your vocabulary, with non-speech artifacts like “[Music]” filtered out.",
  },
  {
    name: "Clean up",
    body: "A small local LLM on Apple MLX removes filler words and fixes punctuation. If it errors or takes too long, you get the raw text — never nothing.",
  },
  { name: "Inject", body: "Pasted into the focused app, with your clipboard snapshotted and restored." },
] as const;

export const PRIVACY_POINTS = [
  {
    title: "No cloud",
    body: "Speech recognition and cleanup run on your Mac. Audio and text never leave it.",
  },
  {
    title: "No telemetry",
    body: "No analytics, no crash reporting, no accounts — not even optional ones.",
  },
  {
    title: "One kind of network request",
    body: "Downloading models from Hugging Face, and only when you ask. Everything else works offline.",
  },
  {
    title: "Password fields are off-limits",
    body: "LocalFlow detects secure fields and never types into them or writes to your clipboard there.",
  },
] as const;

export const REQUIREMENTS = [
  { title: "macOS 14 (Sonoma) or later", detail: "LocalFlow lives in the menu bar; there's no Dock icon." },
  {
    title: "Apple Silicon (M1 or later)",
    detail: "Built for arm64 only — Intel Macs aren't supported.",
  },
  {
    title: "148 MB to get started",
    detail:
      "The recommended Base speech model. Speech models range from 78 MB to 1.6 GB; the optional cleanup LLM is 0.7 GB or 2.3 GB.",
  },
  {
    title: "Microphone and Accessibility access",
    detail: "A setup window walks you through both permissions and the first model download.",
  },
] as const;

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
