// The page's copy. Product facts are backed by ../README.md and ../docs/PROJECT.md; tests in
// __tests__/content.test.ts and __tests__/copy-style.test.ts keep both the facts and the voice honest.
import { SITE } from "@/lib/site";

const introBefore = "Hold";
const introKey = "Right ⌥";
const introAfter = "and talk. When you let go, your words are pasted where your cursor is, already cleaned up.";

export const INTRO = {
  title: "peluni types what you say into any app on your Mac.",
  bodyBefore: introBefore,
  key: introKey,
  bodyAfter: introAfter,
  body: `${introBefore} ${introKey} ${introAfter}`,
  download: "Download for Mac",
  requirement: "Needs macOS 14 or later on an Apple Silicon Mac.",
  release: `Free and open source, version ${SITE.version}.`,
} as const;

export const USING = {
  title: "Using it",
  paragraphs: [
    "peluni lives in the menu bar, and the text lands in whichever app has focus, typically in about a second with the base model.",
  ],
  // Under the scene: what the keys do, and what happens when a paste can't land.
  sceneNote:
    "If a paste can't land, the text stays on your clipboard and the overlay asks you to press ⌘V. Your last ten transcripts wait in the menu, in memory, until you quit.",
  // The menu bar menu (Sources/PeluniApp/App/PeluniApp.swift); the app truncates entries at 48 characters.
  menu: {
    label: "peluni's menu bar menu",
    recentTitle: "Recent transcripts",
    recent: [
      "Ship the peluni build to Priya.",
      "Running ten minutes late, start without me and I'll catch up on the notes.",
      "Hey Priya, the build is ready. I just need to fix the signing step.",
      "Pick up the charger and oat milk on the way home.",
    ],
    truncateAt: 48,
    commands: [
      { label: "Settings…", shortcut: "⌘," },
      { label: "Quit peluni", shortcut: "⌘Q" },
    ],
  },
  // The app the desktop shot is dictating into.
  window: {
    app: "Notes",
    text: "Onboarding: send the welcome email after the first model download finishes, not before. Most people want to try it right away.",
  },
  keysLabel: "Keys",
  // One sentence, four clauses, keys drawn inline.
  keys: [
    { how: "Hold", key: "Right ⌥", result: "to record" },
    { how: "double-tap", key: "Right ⌥", result: "to keep recording with your hands free" },
    { how: "press", key: "Esc", result: "to cancel" },
  ],
  keysEnd: "and a tap shorter than 0.3 seconds is ignored.",
} as const;

// Level names and descriptions are the app's own (Sources/PeluniApp/UI/GeneralTab.swift);
// the outputs illustrate what each level changes.
export const CLEANUP_LEVELS = {
  title: "Cleanup levels",
  intro: "Whisper writes down everything you say, false starts included. You choose how much of it gets pasted.",
  fallback: "If the cleanup model errors or takes longer than ten seconds, peluni pastes the raw transcript instead.",
  legend: "Cleanup level",
  defaultLevel: "light",
  levels: [
    {
      id: "none",
      name: "None",
      detail: "raw transcript",
      paragraphs: [
        "um so the demo moved to thursday no wait friday and uh we still need the slides the script a backup laptop and the hdmi adapter",
      ],
      list: [] as string[],
    },
    {
      id: "light",
      name: "Light",
      detail: "fillers and punctuation",
      paragraphs: [
        "So the demo moved to Thursday, no wait, Friday, and we still need the slides, the script, a backup laptop and the HDMI adapter.",
      ],
      list: [] as string[],
    },
    {
      id: "medium",
      name: "Medium",
      detail: "also grammar and false starts",
      paragraphs: ["The demo moved to Friday, and we still need the slides, the script, a backup laptop and the HDMI adapter."],
      list: [] as string[],
    },
    {
      id: "high",
      name: "High",
      detail: "also structure and lists",
      paragraphs: ["The demo moved to Friday. We still need:"],
      list: ["The slides", "The script", "A backup laptop", "The HDMI adapter"],
    },
  ],
} as const;

// Speech models from Sources/PeluniCore/ModelCatalog.swift (sizes rounded, decimal units as in the README).
export const WORDS = {
  title: "Vocabulary and speech models",
  vocabTitle: "Vocabulary",
  vocabBody:
    "Add the words whisper keeps getting wrong, like your colleagues' names or the acronyms your team uses. peluni passes them to whisper as hints, and any alias you list under “sounds like” is replaced the same way every time.",
  terms: [
    { term: "Priya", soundsLike: [] as string[] },
    { term: "peluni", soundsLike: ["pell oony"] },
    { term: "MLX", soundsLike: ["em el ex"] },
    { term: "Kubernetes", soundsLike: ["cooper netties"] },
  ],
  heardLabel: "Heard",
  heard: "ship the pell oony build to priya",
  typedLabel: "Pasted",
  typed: "Ship the peluni build to Priya.",
  modelsTitle: "Speech models",
  modelsBody:
    "Start with Base. The larger models are more accurate and take more disk space, and each one is downloaded from Hugging Face only when you pick it in Settings.",
  modelsColumns: ["Model", "Size", "Good for"],
  models: [
    { name: "Tiny", size: "78 MB", note: "older Macs, quick notes" },
    { name: "Base", size: "148 MB", note: "where to start" },
    { name: "Small", size: "488 MB", note: "fewer mistakes, still quick" },
    { name: "Medium", size: "1.5 GB", note: "accents and noisy rooms" },
    { name: "Large v3 Turbo", size: "1.6 GB", note: "the most accurate" },
  ],
} as const;

export const AUDIO = {
  title: "Where your audio goes",
  // The scene: dictating into Messages with Wi-Fi switched off.
  scene: {
    label: "Dictating with Wi-Fi off",
    wifi: "Wi-Fi",
    wifiState: "Off",
    app: "Messages",
    contact: "Sam",
    incoming: "Still on for 6?",
    text: "Running ten minutes late, start without me and I'll catch up on the notes.",
  },
  paragraphs: [
    "Turn Wi-Fi off and keep dictating. The microphone is read at 16 kHz, whisper.cpp transcribes on the GPU and the cleanup model runs through MLX, all in memory on your Mac. The app only goes online to download a model from Hugging Face when you ask for one, and it won't type into a password field or touch the clipboard while one has focus.",
  ],
  storageBefore: "Models are kept in",
  storagePath: "~/Library/Application Support/peluni/",
  storageAfter: "and your vocabulary is a plain JSON file in the same folder.",
  sourceBefore: "The code for all of this is",
  sourceLink: "on GitHub",
  sourceAfter: ", MIT licensed.",
} as const;

export const INSTALL_GUIDE = {
  title: "Installing",
  steps: [
    { before: "Download the DMG from the", link: "releases page", after: "on GitHub." },
    { before: "Open it and drag peluni to Applications. It runs from the menu bar and has no Dock icon.", link: "", after: "" },
    {
      before: "Allow Microphone and Accessibility when the setup window asks. Accessibility is what lets it paste into other apps.",
      link: "",
      after: "",
    },
    { before: "Download the Base speech model (148 MB) from the same window. Then hold Right ⌥ and talk.", link: "", after: "" },
  ],
  // The setup window (Sources/PeluniApp/UI/OnboardingWindow.swift), finished.
  setup: {
    title: "Welcome to peluni",
    rows: [
      { name: "Microphone", state: "Allowed" },
      { name: "Accessibility", state: "Allowed" },
      { name: "Speech model", state: "Base, 148 MB" },
    ],
  },
  checkTitle: "Check the download",
  checksumBody:
    "Releases are signed with a Developer ID and notarized by Apple. To check a download, put the .sha256 file published with it in the same folder and run:",
  checksumCommand: "shasum -a 256 -c peluni-<version>.dmg.sha256",
  requirementsTitle: "Requirements",
  requirements: [
    { title: "macOS 14 (Sonoma) or later", detail: "peluni runs from the menu bar." },
    { title: "Apple Silicon (M1 or later)", detail: "It is built for arm64 only, so Intel Macs can't run it." },
    {
      title: "148 MB to get started",
      detail: "That's the Base speech model. Speech models range from 78 MB to 1.6 GB, and the optional cleanup model is 0.7 GB or 2.3 GB.",
    },
    { title: "Microphone and Accessibility access", detail: "Granted once, in the setup window." },
  ],
} as const;

export const QUESTIONS = {
  title: "Questions",
  items: [
    {
      q: "Which languages does it understand?",
      a: "The speech models are multilingual and detect the language on their own. Larger models are more accurate, and you can switch in Settings → Models.",
    },
    {
      q: "Does it work offline?",
      a: "Yes, once a model is downloaded. You only need a connection to download models.",
    },
    {
      q: "Will it run on an Intel Mac?",
      a: "No. It needs Apple Silicon (M1 or later) and macOS 14 or later.",
    },
    {
      q: "Does it keep my transcripts?",
      a: "The last ten stay in memory so you can copy one again from the menu bar. Nothing is written to disk, and quitting clears them.",
    },
    {
      q: "What happens in a password field?",
      a: "peluni detects secure fields and won't type into them or write to the clipboard while one has focus.",
    },
    {
      q: "What does it cost?",
      a: "Nothing. It's MIT licensed, and you can build it from the source yourself.",
    },
  ],
  moreBefore: "Anything else: ",
  moreLink: "open an issue on GitHub",
  moreAfter: ".",
} as const;

export const FOOTER_NOTE = {
  links: [
    { label: "Source", href: SITE.repoUrl },
    { label: "Releases", href: SITE.releasesUrl },
    { label: "Issues", href: `${SITE.repoUrl}/issues` },
    { label: "MIT License", href: `${SITE.repoUrl}/blob/main/LICENSE` },
  ],
  site: "The app has no analytics. This website loads Microsoft Clarity only if you allow it.",
  made: "Made for macOS on Apple Silicon.",
} as const;
