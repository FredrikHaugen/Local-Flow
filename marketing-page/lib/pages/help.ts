import type { PageCopy } from "@/lib/blocks";
import { SITE } from "@/lib/site";

// Sources: README.md (Quick start, Requirements, Upgrading), OnboardingWindow.swift, the Settings tabs, the overlay and
// menu messages in DictationController.swift and TranscriptionEngine.swift, DownloadErrorMessage.swift,
// ModelManager.swift (disk margin). Messages containing a dash are described, never quoted.

/** App messages this page quotes word for word; __tests__/help.test.ts finds each in Sources/. */
export const QUOTED_MESSAGES = [
  "Microphone access is off. Allow it in peluni Setup.",
  "No transcription model installed. Open Settings → Models.",
  "Could not load the transcription model.",
  "Didn't catch that",
] as const;

export const HELP: PageCopy = {
  lead: [
    "How to build and set up peluni, what each Settings tab holds, and what to do when peluni shows a message you didn't expect.",
  ],
  sections: [
    {
      id: "install",
      heading: "Building from source",
      blocks: [
        { p: ["peluni isn't released yet, so there's no app to download. You build it on your Mac instead."] },
        {
          list: [
            [
              "Install Xcode 16.3 or later, which itself needs macOS 15.2 on a Mac with Apple Silicon. On Xcode 26 or later, also run ",
              { code: "xcodebuild -downloadComponent MetalToolchain" },
              " once.",
            ],
            [
              "Clone ",
              { text: "the repository", href: SITE.repoUrl },
              " and run ",
              { code: "make run" },
              " in its folder. The first build takes several minutes; later ones are quicker. peluni opens in the menu bar and has no Dock icon.",
            ],
            [
              "The peluni Setup window asks for Microphone access, so peluni can hear you while you hold the key, and Accessibility access, so it can paste into the app you're using.",
            ],
            [
              "Download the speech model it offers, Base at 148 MB. After that, peluni works without an internet connection.",
            ],
            ["Hold Right ⌥ anywhere and talk."],
          ],
          ordered: true,
        },
        { p: ["Once built, peluni runs on macOS 14 (Sonoma) or later with Apple Silicon (M1 or later). The newer macOS is only for Xcode."] },
      ],
    },
    {
      id: "upgrading",
      heading: "Upgrading from the old name",
      blocks: [
        {
          p: [
            "peluni (formerly LocalFlow) moves your downloaded models, vocabulary and settings over on first launch, so nothing is downloaded again. macOS sees it as a new app, so it asks for Microphone and Accessibility again, and Launch at login has to be switched back on. Once peluni works, delete the old app from Applications.",
          ],
        },
      ],
    },
    {
      id: "settings",
      heading: "Settings",
      blocks: [
        { p: ["Open Settings from the peluni menu in the menu bar. It has five tabs:"] },
        {
          table: {
            caption: "Settings tabs",
            head: ["Tab", "What's there"],
            rows: [
              ["General", "Cleanup level, an extra shortcut to toggle dictation, and Launch peluni at login"],
              ["Models", "Speech models, the dictation language, and the cleanup model"],
              ["Vocabulary", "Your terms, and what each one tends to come out as"],
              ["Permissions", "Whether Microphone and Accessibility are allowed, with a button to open System Settings"],
              [
                "Advanced",
                "Whether text is pasted or typed, and the length under which cleanup is skipped (50 characters)",
              ],
            ],
          },
        },
        {
          p: [
            "General also has an Autocomplete (experimental) switch. It isn't finished: it loads a model but shows no suggestions yet, so leave it off.",
          ],
        },
      ],
    },
    {
      id: "messages",
      heading: "Messages and what to do",
      blocks: [
        {
          table: {
            caption: "Messages peluni shows",
            head: ["peluni says", "What to do"],
            rows: [
              [
                "Microphone access is off. Allow it in peluni Setup.",
                "Click Allow in the setup window, or switch peluni on in System Settings → Privacy & Security → Microphone.",
              ],
              [
                "No transcription model installed. Open Settings → Models.",
                "Download a speech model in Settings → Models. Base (148 MB) is the usual choice.",
              ],
              ["Could not load the transcription model.", "Delete the model in Settings → Models, and download it again."],
              [
                "Didn't catch that",
                "peluni heard no words. Check the input device in System Settings → Sound, and try again closer to the microphone.",
              ],
              [
                "A note that the field is secure and dictation was blocked",
                "Your cursor is in a password field, where peluni never types. Click into a normal text field.",
              ],
              [
                "A note that the text was copied and you should press ⌘V",
                "peluni couldn't send the keystrokes into the app, so the text is on your clipboard. Press ⌘V yourself.",
              ],
              [
                "Couldn't download, followed by the reason",
                "The reason says what failed: no connection, a timeout, Hugging Face out of reach, an incomplete download or too little disk space. Fix that and press Retry. A speech model download also needs its own size plus 200 MB free.",
              ],
            ],
          },
        },
      ],
    },
    {
      id: "no-text",
      heading: "No text and no message",
      blocks: [
        {
          p: [
            "peluni sends the paste but can't see whether the app took it. If nothing appears and peluni shows no message, the app probably ignores pastes from other programs. Copy the text again from Recent transcripts in the menu bar menu, and set Settings → Advanced → Method to Type character-by-character for next time.",
          ],
        },
      ],
    },
    {
      id: "permissions",
      heading: "Checking permissions",
      blocks: [
        {
          p: [
            "If text stops appearing, open Settings → Permissions. Both Microphone and Accessibility should show a check. If one shows a cross, click Open System Settings and switch peluni on there.",
          ],
        },
      ],
    },
    {
      id: "more",
      heading: "Still stuck",
      blocks: [
        {
          p: [
            { text: "Open an issue on GitHub", href: `${SITE.repoUrl}/issues` },
            " with your macOS version, your Mac's chip and what peluni showed. Issues are public, so leave out any transcript you'd rather keep to yourself.",
          ],
        },
      ],
    },
  ],
};
