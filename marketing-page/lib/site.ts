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

// Shown right under the hero Download button, so an Intel or macOS 13 visitor knows before clicking.
export const HERO_REQUIREMENT = "macOS 14+ · Apple Silicon";
export const HERO_TERMS = `Free & open source · v${SITE.version}`;
export const HERO_FINEPRINT = `Free & open source · ${HERO_REQUIREMENT} · v${SITE.version}`;

export const NAV = [
  { href: "#anywhere", label: "Use it anywhere" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#privacy", label: "Privacy" },
  { href: "#requirements", label: "Requirements" },
] as const;

export const HERO = {
  eyebrow: "Free, open-source dictation for macOS",
  // The h1 is SITE.tagline; this is the phrase set as "just typed" (selected, cursor after it).
  emphasis: "never leaves your Mac.",
  pitchBefore: "Hold",
  pitchAfter:
    ", speak, let go — clean text appears in whatever app you're using. Transcription and cleanup run entirely on-device.",
} as const;

export const DEMO = {
  // A rambling spoken take and what the conservative cleanup pass makes of it:
  // fillers dropped, capitals and punctuation added, nothing reworded.
  raw: "um hey priya so the build is basically ready uh I just need to fix the signing step and run the tests one more time I think we can like ship it friday afternoon if nothing breaks",
  cleaned:
    "Hey Priya, the build is ready. I just need to fix the signing step and run the tests one more time. I think we can ship it Friday afternoon if nothing breaks.",
  // Words in `raw` that the cleanup pass drops (shown struck through in the hero).
  fillers: ["um", "so", "basically", "uh", "like"],
  app: "Mail",
  to: "Priya",
  subject: "Friday release",
  heardLabel: "What you said",
  typedLabel: "What LocalFlow typed",
  // The key you're holding while the overlay listens.
  holdKey: "right ⌥",
  // The real overlay's label while recording (Sources/LocalFlowApp/UI/OverlayView.swift).
  overlayLabel: "Listening…  (esc to cancel)",
  menuItems: ["Mail", "File", "Edit", "View", "Message"],
  clock: "Fri 4:12 PM",
} as const;

// The speed proof. Both quoted phrases are from docs/PROJECT.md (pinned by site.test.ts).
export const SPEED = {
  source: "typically in about a second with the base model",
  realtime: ">15× real-time",
  kicker: "Speed",
  title: "Let go. It's typed in about a second.",
  mark: "about a second.",
  intro:
    "There's no upload and no server queue. The moment you release the key, your Mac transcribes, tidies and pastes — typically in about a second with the Base model.",
  // Shown as a giant numeral; "≈ 1 s" is the sourced "about a second".
  numeral: "1",
  numeralUnit: "s",
  numeralLabel: "from letting go to text on screen",
  // The to-scale bars: >15× real-time means 15 s of speech transcribes in under 1 s.
  talkLabel: "You talk",
  talkValue: "15 s",
  transcribeLabel: "Transcription",
  transcribeValue: "< 1 s",
  scaleNote: "Drawn to scale. Transcription runs >15× real-time on Apple Silicon, so a 15-second take is done in under one.",
  // What the speed and the on-device design mean for you (README: "everything else works offline").
  facts: [
    { value: "Offline", label: "Works on a plane once your model is downloaded" },
    { value: "No sign-up", label: "No account, no email, no API key to paste" },
    { value: "Clipboard", label: "Put back exactly as it was after every paste" },
  ],
  // The small stamp on the hero's Mail window.
  stamp: "Pasted about a second after you let go",
} as const;

// "Use it anywhere": the same hotkey in different apps. LocalFlow pastes into whatever field is focused.
export const ANYWHERE = {
  title: "Wherever your cursor is",
  mark: "your cursor is",
  intro:
    "If you can type there, you can talk there. LocalFlow pastes into the focused app — no plugins, no integrations, nothing to switch to.",
  apps: [
    {
      app: "Messages",
      caption: "Quick replies",
      contact: "Sam",
      incoming: "Still on for 6?",
      body: "Running ten minutes late — start without me and I'll catch up on the notes.",
    },
    {
      app: "Notes",
      caption: "Long thoughts",
      title: "Onboarding ideas",
      body: "Send the welcome email after the first model download finishes, not before. Most people want to try it right away, so keep the setup to one window.",
    },
    {
      app: "Code editor",
      caption: "Your jargon, spelled right",
      body: "// Retry the MLX load once, then fall back to the raw transcript.",
      // A vocabulary term, highlighted to show recognition biasing.
      term: "MLX",
      termNote: "From your vocabulary",
      file: "Transcriber.swift",
      before: ["func load() async throws {", "  do {"],
      after: ["    try await model.load()", "  }"],
    },
  ],
} as const;

// The short promises under the hero; each one is backed by the README.
export const PROMISES = ["No cloud", "No telemetry", "No accounts", "MIT licensed"] as const;

// Section labels, each set in the overlay-capsule marker.
export const KICKERS = {
  anywhere: "Any app",
  "how-it-works": "Three moves",
  speed: "Speed",
  privacy: "Privacy",
  requirements: "Install",
} as const;

// The privacy diagram doubles as the pipeline: five on-device stages inside the "Your Mac" line.
export const UNDER_THE_HOOD = {
  title: "Under the hood",
  intro: "Five on-device stages, all inside the line. If any one fails, your words still land somewhere you can see them.",
} as const;

// The "How it works" storyboard.
export const HOW = {
  title: "How it works",
  mark: "works",
  intro: "One key, held. No app to switch to, no window to click — it works wherever your cursor is.",
  keyLegend: "option",
  keySide: "right",
  // Stamped on the rail above each move.
  moments: ["key down", "you talk", "key up · ≈1 s later"],
  pasted: "Running ten minutes late — start without me.",
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
  {
    name: "Capture",
    tag: "Your mic, on your Mac",
    body: "The mic is recorded at 16 kHz and streamed to the waveform overlay.",
  },
  {
    name: "Trim",
    tag: "Silence cut, stray taps ignored",
    body: "Silence is stripped. Under 0.3 s of speech counts as an accidental tap and is discarded.",
  },
  {
    name: "Transcribe",
    tag: "Speech to text, on your GPU",
    body: "whisper.cpp on the Metal GPU, biased toward your vocabulary, with non-speech artifacts like “[Music]” filtered out.",
  },
  {
    name: "Clean up",
    tag: "Fillers out, punctuation in",
    body: "A small local LLM on Apple MLX removes filler words and fixes punctuation. If it errors or takes too long, you get the raw text — never nothing.",
  },
  {
    name: "Inject",
    tag: "Pasted, clipboard put back",
    body: "Pasted into the focused app, with your clipboard snapshotted and restored.",
  },
] as const;

// The boundary diagram in the Privacy section.
export const PRIVACY_DIAGRAM = {
  boundary: "Your Mac",
  outside: "Hugging Face",
  outsideNote: "Model downloads only, when you ask",
} as const;

export const PRIVACY = {
  title: "Private by construction",
  mark: "construction",
  intro: "Not a privacy setting — the architecture. There's no server for your voice to go to.",
} as const;

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

export const FINAL_CTA = {
  title: "Hold ⌥ and start talking.",
  mark: "start talking.",
  body: "One download, one setup window, and every word stays on your Mac.",
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
