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
  paragraphs: [
    "peluni lives in the menu bar, and the text lands in whichever app has focus, typically in about a second with the base model.",
  ],
  sceneLabel: "Dictating into Reminders",
  // The app the desktop shot is dictating into.
  window: {
    app: "Reminders",
    // What you said, and the indexes of the words the cleanup dropped from it.
    raw: "um pick up the uh charger and like oat milk on the way home",
    dropped: [0, 4, 7] as number[],
    text: "Pick up the charger and oat milk on the way home.",
  },
  keysLabel: "Keys",
  // The key legend under the hero scene.
  keys: [
    { how: "Hold", key: "Right ⌥", result: "to record" },
    { how: "Double-tap", key: "Right ⌥", result: "to keep recording with your hands free" },
    { how: "Press", key: "Esc", result: "to cancel" },
  ],
  keysEnd: "A tap shorter than 0.3 seconds is ignored, and if a paste can't land, the text waits on your clipboard.",
  // The real overlay's label while recording (Sources/PeluniApp/UI/OverlayView.swift).
  overlayLabel: "Listening…  (esc to cancel)",
} as const;

// Level names and descriptions are the app's own (Sources/PeluniApp/UI/GeneralTab.swift);
// the outputs illustrate what each level changes.
export const CLEANUP_LEVELS = {
  title: "Cleanup levels",
  intro:
    "Whisper writes down everything you say, false starts included. You choose how much of it gets pasted, and if the model errors or takes over ten seconds you get the raw transcript.",
  raw: "um so the demo moved to thursday no wait friday and uh we still need the slides the script a backup laptop and the hdmi adapter",
  legend: "The same take at each cleanup level",
  defaultLevel: "light",
  defaultNote: "default",
  levels: [
    {
      id: "none",
      // Indexes of the words in `raw` this level drops.
      dropped: [] as number[],
      name: "None",
      detail: "raw transcript",
      paragraphs: [
        "um so the demo moved to thursday no wait friday and uh we still need the slides the script a backup laptop and the hdmi adapter",
      ],
      list: [] as string[],
    },
    {
      id: "light",
      dropped: [0, 11] as number[],
      name: "Light",
      detail: "fillers and punctuation",
      paragraphs: [
        "So the demo moved to Thursday, no wait, Friday, and we still need the slides, the script, a backup laptop and the HDMI adapter.",
      ],
      list: [] as string[],
    },
    {
      id: "medium",
      dropped: [0, 1, 6, 7, 8, 11] as number[],
      name: "Medium",
      detail: "also grammar and false starts",
      paragraphs: ["The demo moved to Friday, and we still need the slides, the script, a backup laptop and the HDMI adapter."],
      list: [] as string[],
    },
    {
      id: "high",
      dropped: [0, 1, 6, 7, 8, 10, 11, 22] as number[],
      name: "High",
      detail: "also structure and lists",
      paragraphs: ["The demo moved to Friday. We still need:"],
      list: ["The slides", "The script", "A backup laptop", "The HDMI adapter"],
    },
  ],
} as const;

// Speech models from Sources/PeluniCore/ModelCatalog.swift (sizes rounded, decimal units as in the README).
export const WORDS = {
  title: "Vocabulary",
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
  modelsTitle: "Which speech model should I use?",
  modelsBody: "Start with Base. Larger models are more accurate, and each is downloaded only when you pick it in Settings.",
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
    knownTitle: "Known networks",
    known: ["Home", "Studio 4F"],
    app: "Messages",
    contact: "Sam",
    incoming: "Still on for 6?",
    text: "Running ten minutes late, start without me and I'll catch up on the notes.",
  },
  display: "Turn Wi-Fi off and keep dictating.",
  paragraphs: [
    "Transcription and cleanup run in memory on your Mac, and the app only goes online to fetch a model when you ask for one.",
  ],
  sourceBefore: "The code for all of this is",
  sourceLink: "on GitHub",
  sourceAfter: ", MIT licensed.",
} as const;

export const INSTALL_GUIDE = {
  title: "Installing",
  steps: [
    { before: "Download the DMG from the", link: "releases page", after: "." },
    { before: "Drag peluni to Applications. It runs from the menu bar.", link: "", after: "" },
    { before: "Allow Microphone and Accessibility when the setup window asks.", link: "", after: "" },
    { before: "Get the Base speech model (148 MB), then hold Right ⌥ and talk.", link: "", after: "" },
  ],
  checkTitle: "How do I check the download?",
  checksumBody:
    "Releases are signed with a Developer ID and notarized by Apple. To check a download, put the .sha256 file published with it in the same folder and run:",
  checksumCommand: "shasum -a 256 -c peluni-<version>.dmg.sha256",
  download: "Download for Mac",
  requirementsTitle: "What does my Mac need?",
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
