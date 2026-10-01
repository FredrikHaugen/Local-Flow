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
  { href: "#how-it-works", label: "How it works" },
  { href: "#anywhere", label: "Use it anywhere" },
  { href: "#privacy", label: "Privacy" },
  { href: "#requirements", label: "Requirements" },
  { href: "#faq", label: "FAQ" },
] as const;

// Phone visitors: LocalFlow is a Mac app, so the phone's job is to get this page onto the Mac.
export const PHONE = {
  menu: "Menu",
  close: "Close",
  menuTitle: "On this page",
  handoffLead: "Reading on a phone?",
  handoffNote: "LocalFlow runs on your Mac. Send yourself the link and download it there.",
  handoff: "Send this page to my Mac",
  shareTitle: "LocalFlow: voice dictation for your Mac",
  copied: "Link copied. Open it on your Mac.",
  swipe: "Swipe",
} as const;

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
  railLabel: "Example apps",
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
  yours: "Settings",
  speed: "Speed",
  privacy: "Privacy",
  requirements: "Install",
  faq: "FAQ",
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
  { action: "Push-to-talk", keys: "Hold Right ⌥", note: "Talk while the key is down. Let go to paste." },
  {
    action: "Hands-free",
    keys: "Double-tap Right ⌥, press once to stop",
    note: "For long takes: lock it on, put your hands down, press once when you're done.",
  },
  { action: "Cancel", keys: "Esc", note: "Changed your mind? Esc stops it at any stage, and nothing is pasted." },
] as const;

// Labels drawn on the controls' timing diagrams.
export const CONTROL_TRACKS = {
  held: "⌥ held",
  locked: "hands-free",
  cancelled: "esc",
} as const;

// "Make it yours": the real settings, each shown as a working piece of UI.
// Level names and descriptions are the app's own (Sources/LocalFlowApp/UI/GeneralTab.swift);
// the outputs are an illustration of what each level changes.
export const YOURS = {
  title: "Tuned to how you talk",
  mark: "how you talk",
  intro:
    "Every card here is a real setting in LocalFlow. Choose how much it tidies, teach it your words, pick the model that fits your Mac.",
} as const;

export const CLEANUP = {
  title: "Choose how much it tidies",
  body: "Four cleanup levels, from your exact words to tidy lists. Light is the default.",
  legend: "Cleanup level",
  heardLabel: "You said",
  typedLabel: "LocalFlow types",
  exampleNote: "Example output",
  raw: "um so the demo moved to thursday no wait friday and uh we still need three things the slides the script and a backup laptop",
  // The app's own promise, shown under the picker.
  promise: "Cleanup never rewrites your meaning; if the model misbehaves, the raw transcript is used.",
  defaultLevel: "light",
  levels: [
    {
      id: "none",
      name: "None",
      detail: "raw transcript",
      paragraphs: [
        "um so the demo moved to thursday no wait friday and uh we still need three things the slides the script and a backup laptop",
      ],
      list: [] as string[],
    },
    {
      id: "light",
      name: "Light",
      detail: "fillers & punctuation",
      paragraphs: [
        "So the demo moved to Thursday, no wait, Friday, and we still need three things: the slides, the script and a backup laptop.",
      ],
      list: [] as string[],
    },
    {
      id: "medium",
      name: "Medium",
      detail: "also grammar & false starts",
      paragraphs: ["The demo moved to Friday, and we still need three things: the slides, the script and a backup laptop."],
      list: [] as string[],
    },
    {
      id: "high",
      name: "High",
      detail: "also structure & lists",
      paragraphs: ["The demo moved to Friday. We still need three things:"],
      list: ["The slides", "The script", "A backup laptop"],
    },
  ],
} as const;

// The Vocabulary tab, with "sounds like" aliases (docs/PROJECT.md, "Custom vocabulary").
export const VOCAB = {
  title: "Your words, spelled right",
  body: "Add names and jargon once. They steer recognition, and “sounds like” aliases are fixed the same way every time.",
  panelTitle: "Vocabulary",
  terms: [
    { term: "Priya", soundsLike: [] as string[] },
    { term: "LocalFlow", soundsLike: ["local flow"] },
    { term: "MLX", soundsLike: ["em el ex"] },
  ],
  heard: "ship the local flow build to priya",
  typed: "Ship the LocalFlow build to Priya.",
} as const;

// Speech models from Sources/LocalFlowCore/ModelCatalog.swift (sizes rounded, decimal units as in the README).
export const MODELS = {
  title: "Pick your model",
  body: "Start with Base. Bigger models trade disk space for accuracy, and each is downloaded from Hugging Face only when you ask.",
  maxMb: 1625,
  list: [
    { name: "Tiny", note: "fast, rough", size: "78 MB", mb: 78 },
    { name: "Base", note: "recommended start", size: "148 MB", mb: 148, current: true },
    { name: "Small", note: "best balance", size: "488 MB", mb: 488 },
    { name: "Medium", note: "high accuracy, slower", size: "1.5 GB", mb: 1534 },
    { name: "Large v3 Turbo", note: "max accuracy", size: "1.6 GB", mb: 1625 },
  ],
} as const;

// The menu bar menu and the paste-failure notice (Sources/LocalFlowApp/App/LocalFlowApp.swift, DictationController.swift).
export const NEVER_LOST = {
  title: "Nothing you say gets lost",
  body: "If a paste can't land, the text waits on your clipboard and the overlay tells you to press ⌘V. Your last ten transcripts sit in the menu bar, one click from your clipboard — kept in memory, never written to disk.",
  overlay: "Copied — press ⌘V",
  menuStatus: "Ship the LocalFlow build to Priya.",
  submenu: "Recent transcripts",
  // Full transcripts; the menu truncates them at 48 characters, as the app does.
  recent: [
    "Ship the LocalFlow build to Priya.",
    "Running ten minutes late — start without me and I'll catch up on the notes.",
    "Hey Priya, the build is ready. I just need to fix the signing step.",
  ],
  truncateAt: 48,
  menuItems: [
    { label: "Settings…", shortcut: "⌘," },
    { label: "Quit LocalFlow", shortcut: "⌘Q" },
  ],
} as const;

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

// "Don't take our word for it": three things anyone can check without trusting this page (README, Install + Privacy).
export const VERIFY = {
  title: "Don't take our word for it",
  intro: "A privacy promise is only worth what you can check. Here are three ways to check this one.",
  checks: [
    {
      id: "offline",
      title: "Pull the plug",
      body: "Turn Wi-Fi off once a model is downloaded. Dictation, cleanup and pasting keep working, because none of them ever needed the network.",
      wifi: "Wi-Fi",
      wifiState: "Off",
      overlay: "Listening…",
    },
    {
      id: "source",
      title: "Read every line",
      body: "LocalFlow is MIT licensed and built in the open. The audio pipeline, the model downloader and the paste code are all on GitHub.",
      link: "Browse the source",
      files: ["AudioCaptureService.swift", "TranscriptionEngine.swift", "CleanupEngine.swift", "ModelManager.swift", "TextInjector.swift"],
    },
    {
      id: "download",
      title: "Check the download",
      body: "Releases are signed with a Developer ID and notarized by Apple, so the app opens without Gatekeeper warnings. A SHA-256 checksum is published next to each one.",
      command: `shasum -a 256 -c LocalFlow-${SITE.version}.dmg.sha256`,
      result: `LocalFlow-${SITE.version}.dmg: OK`,
    },
  ],
} as const;

// The install section: the README's three install steps, drawn.
export const INSTALL = {
  railLabel: "Install steps",
  title: "Three steps to your first sentence",
  mark: "first sentence",
  intro: "Download, drag, allow two permissions. A setup window walks you through the rest, then you hold ⌥ and talk.",
  checkTitle: "Will it run on my Mac?",
  checkHow: "Apple menu → About This Mac",
  checkRows: [
    { label: "Chip", need: "Apple M1 or later" },
    { label: "macOS", need: "Sonoma 14 or later" },
  ],
  checkNo: "Intel Mac, or macOS 13 and earlier? LocalFlow won't run there. It is built for Apple Silicon only.",
  steps: [
    {
      title: "Drag it to Applications",
      body: "Open the DMG and drag LocalFlow onto Applications. It lives in the menu bar; there's no Dock icon.",
      app: "LocalFlow",
      folder: "Applications",
    },
    {
      title: "Allow two permissions",
      body: "Microphone, so it can hear you. Accessibility, so it can paste where your cursor is.",
      permissions: ["Microphone", "Accessibility"],
      allowed: "Allowed",
    },
    {
      title: "Get the speech model",
      body: "Base, 148 MB, downloaded from Hugging Face. It is the only download LocalFlow makes until you ask for another.",
      model: "Base",
      size: "148 MB",
      source: "huggingface.co",
    },
  ],
  done: "Then hold Right ⌥ anywhere and talk.",
  requirementsTitle: "Requirements",
} as const;

// Questions a careful visitor asks before installing. Every answer is backed by README.md or docs/PROJECT.md.
export const FAQ = {
  title: "Fair questions",
  mark: "questions",
  intro: "The honest answers, including the ones where the answer is no.",
  askTitle: "Something else?",
  askBody: "Open an issue on GitHub. It is an early project, and questions make it better.",
  askLink: "Ask on GitHub",
  items: [
    {
      q: "Is it really free?",
      a: "Yes. LocalFlow is MIT licensed open source: no account, no subscription, no trial and no paid tier. You can read, build and change every line.",
    },
    {
      q: "Does anything I say leave my Mac?",
      a: "No. Audio is recorded, transcribed and cleaned up on your Mac, and the text is pasted locally. The only network traffic LocalFlow ever produces is downloading model files from Hugging Face, and only when you ask.",
    },
    {
      q: "Does it work offline?",
      a: "Yes, once a model is downloaded. You need an internet connection only while downloading models; everything else works offline.",
    },
    {
      q: "Will it run on my Intel Mac?",
      a: "No. LocalFlow is built for Apple Silicon (M1 or later) only, and needs macOS 14 (Sonoma) or later.",
    },
    {
      q: "Which languages does it understand?",
      a: "The speech models are multilingual, with automatic language detection. Larger models are more accurate; you can switch any time in Settings → Models.",
    },
    {
      q: "Does it keep my transcripts?",
      a: "Only your last ten, in memory, so you can copy one back from the menu bar. Nothing is written to disk, and quitting clears them.",
    },
    {
      q: "What happens in password fields?",
      a: "Nothing. LocalFlow detects secure fields and never types into them or writes to your clipboard there.",
    },
  ],
} as const;

export const FINAL_CTA = {
  title: "Hold ⌥ and start talking.",
  mark: "start talking.",
  body: "One download, one setup window, and every word stays on your Mac.",
  secondary: "Read the source",
  // Under the buttons: what makes the download safe to open (README, Install).
  trust: ["Signed & notarized", "SHA-256 published", "No account"],
} as const;

export const FOOTER = {
  blurb: "Free, open-source voice dictation for macOS. Speech recognition and cleanup run on your Mac, and nowhere else.",
  pageTitle: "On this page",
  projectTitle: "Project",
  project: [
    { label: "Source on GitHub", href: repoUrl },
    { label: "Releases", href: `${repoUrl}/releases` },
    { label: "Report an issue", href: `${repoUrl}/issues` },
    { label: "MIT License", href: `${repoUrl}/blob/main/LICENSE` },
  ],
  siteTitle: "This site",
  siteNote: "No analytics, no cookies and no third-party requests. Even the fonts are served from here.",
  legal: `v${SITE.version} · MIT licensed · Made for macOS on Apple Silicon`,
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
