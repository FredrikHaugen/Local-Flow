// The page's copy. Product facts are backed by ../README.md and ../docs/PROJECT.md; tests in
// __tests__/content.test.ts and __tests__/copy-style.test.ts keep both the facts and the voice honest.
import { SITE } from "@/lib/site";

const introBefore = "Hold";
const introKey = "Right ⌥";
const introAfter =
  "and talk. When you let go, peluni transcribes the recording with whisper.cpp, lets a small language model remove the ums and fix the punctuation, and pastes the text where your cursor is, typically in about a second with the base model. The audio stays on your Mac the whole time.";

export const INTRO = {
  title: "peluni types what you say into any app on your Mac.",
  bodyBefore: introBefore,
  key: introKey,
  bodyAfter: introAfter,
  // The same sentence as one string, for the sourced-claim test.
  body: `${introBefore} ${introKey} ${introAfter}`,
  download: "Download for Mac",
  requirement: "Needs macOS 14 or later on an Apple Silicon Mac.",
  release: `Version ${SITE.version}, free and MIT licensed.`,
} as const;

export const USING = {
  title: "Using it",
  paragraphs: [
    "peluni lives in the menu bar and waits for the right Option key. While it listens, a small overlay with a level meter sits at the bottom of the screen, so you can see that it hears you.",
    "It pastes into whichever app has focus: Mail, Slack, Xcode, a terminal, a form in Safari. If a paste can't land, the text stays on your clipboard and the overlay asks you to press ⌘V. Your last ten transcripts are also in the menu bar, kept in memory until you quit.",
  ],
  caption: "Keys",
  columns: ["Do this", "What happens"],
  keys: [
    { press: "Hold Right ⌥", result: "Records while the key is down. Let go and the text is pasted." },
    { press: "Double-tap Right ⌥", result: "Keeps recording with your hands free. Press Right ⌥ once more to finish." },
    { press: "Esc", result: "Cancels at any point, and nothing is pasted." },
    { press: "Tap Right ⌥ briefly", result: "Ignored. Less than 0.3 seconds of speech counts as an accidental press." },
  ],
} as const;

// Level names and descriptions are the app's own (Sources/PeluniApp/UI/GeneralTab.swift);
// the outputs illustrate what each level changes.
export const CLEANUP_LEVELS = {
  title: "Cleanup levels",
  paragraphs: [
    "Whisper writes down everything you say, false starts included. The cleanup pass decides how much of that you keep. Light, the default, drops filler words and adds punctuation. High also turns a spoken list into a written one.",
    "If the cleanup model errors or takes longer than ten seconds, peluni pastes the raw transcript instead, so a slow model never costs you the sentence.",
  ],
  legend: "Cleanup level",
  heardLabel: "You said",
  typedLabel: "Pasted",
  defaultLevel: "light",
  raw: "um so the demo moved to thursday no wait friday and uh we still need the slides the script a backup laptop and the hdmi adapter",
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
    { name: "Small", size: "488 MB", note: "the best balance" },
    { name: "Medium", size: "1.5 GB", note: "accents and noisy rooms" },
    { name: "Large v3 Turbo", size: "1.6 GB", note: "the most accurate" },
  ],
} as const;

export const AUDIO = {
  title: "Where your audio goes",
  paragraphs: [
    "It stays in memory on your Mac. The microphone is read at 16 kHz, silence is trimmed off, whisper.cpp transcribes on the GPU and the cleanup model runs through Apple's MLX before the text is pasted. None of those steps uses the network.",
    "The app goes online for one reason: to download a model from Hugging Face when you ask for one. Once you have a model you can turn Wi-Fi off and keep dictating. There is no analytics or crash reporting in the app, and you don't sign in to anything.",
    "Password fields are detected through the Accessibility API. While one has focus, peluni won't type into it or touch the clipboard.",
  ],
  storageBefore: "Models are kept in",
  storagePath: "~/Library/Application Support/peluni/",
  storageAfter: "and your vocabulary is a plain JSON file in the same folder.",
  sourceBefore: "All of it is in",
  sourceLink: "the source on GitHub",
  sourceAfter: ", under the MIT license.",
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
      a: "Nothing at all. peluni detects secure fields and neither types into them nor writes to the clipboard while one has focus.",
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
  site: "This site loads Microsoft Clarity only if you allow it, and serves its own fonts.",
  made: "Made for macOS on Apple Silicon.",
} as const;
