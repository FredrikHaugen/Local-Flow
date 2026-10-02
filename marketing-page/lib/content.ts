// The page's copy. Product facts are backed by ../README.md and ../docs/PROJECT.md; tests in
// __tests__/content.test.ts and __tests__/copy-style.test.ts keep both the facts and the voice honest.
import { SITE } from "@/lib/site";

const introBefore = "Hold";
const introKey = "Right ⌥";
const introAfter = "and talk.";
const introMore = "When you let go, your words are pasted where your cursor is, already cleaned up.";

export const INTRO = {
  title: `${introBefore} ${introKey} ${introAfter}`,
  summary: "peluni types what you say into any app on your Mac.",
  bodyBefore: introBefore,
  key: introKey,
  bodyAfter: introAfter,
  bodyMore: introMore,
  body: `${introBefore} ${introKey} ${introAfter} ${introMore}`,
  download: "Download for Mac",
  release: `Free and open source, version ${SITE.version}.`,
} as const;

export const USING = {
  paragraphs: [
    "Typically about a second after you let go of the key, with the base model.",
  ],
  sceneLabel: "Dictating into Reminders",
  // The hero scene: a Reminders list where the last dictation has landed and the next one is being spoken.
  window: {
    app: "Reminders",
    list: "Errands",
    // Reminders already on the list, above the one that just landed.
    earlier: ["Return the library books"],
    heardLabel: "Heard",
    // What you said, and the indexes of the words the cleanup dropped from it.
    raw: "um pick up the uh charger and like oat milk on the way home",
    dropped: [0, 4, 7] as number[],
    text: "Pick up the charger and oat milk on the way home.",
  },
  speedTitle: "How fast is it?",
  // The real overlay's label while recording (Sources/PeluniApp/UI/OverlayView.swift).
  overlayLabel: "Listening…  (esc to cancel)",
} as const;

// Level names and descriptions are the app's own (Sources/PeluniApp/UI/GeneralTab.swift);
// the outputs illustrate what each level changes.
export const CLEANUP_LEVELS = {
  title: "Cleanup levels",
  intro:
    "Whisper writes down everything you say, false starts included. You choose how much of it gets pasted. If cleanup fails or takes more than ten seconds, you get the raw transcript.",
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
} as const;

export const AUDIO = {
  title: "Where your audio goes",
  // The scene: Wi-Fi switched off, and a reply landing in Messages anyway.
  scene: {
    label: "Dictating with Wi-Fi off",
    wifi: "Wi-Fi",
    wifiState: "Off",
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
  sourceAfter: ".",
} as const;

export const INSTALL_GUIDE = {
  title: "Download",
  steps: [
    { before: "Download the DMG from the", link: "releases page", after: "." },
    { before: "Drag peluni to Applications.", link: "", after: "" },
    { before: "Allow Microphone and Accessibility when the setup window asks.", link: "", after: "" },
    { before: "Download the Base speech model when the setup window offers it.", link: "", after: "" },
  ],
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

// The questions people ask, each answered where it belongs on the page (and as Q&A in /llms.txt), so
// every answer reads on its own: hands-free under the hero, transcripts and passwords in the privacy band.
export const QUESTIONS = {
  items: [
    {
      q: "Can I dictate hands-free?",
      a: "Double-tap Right ⌥ to keep recording with your hands free, and press it once more to stop. Esc cancels at any point, and a tap shorter than 0.3 seconds is ignored.",
    },
    {
      q: "Does it keep my transcripts?",
      a: "peluni keeps your last ten transcripts in memory so you can copy one again from the menu bar. Nothing is written to disk, and quitting clears them. If a paste can't land, the text waits on your clipboard.",
    },
    {
      q: "What happens in a password field?",
      a: "peluni detects secure fields and won't type into them or write to the clipboard while one has focus.",
    },
  ],
  detailsBefore: "Speech model sizes and how to check a download are in the ",
  detailsLink: "README",
  detailsAfter: ".",
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
