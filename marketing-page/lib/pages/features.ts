import type { PageCopy } from "@/lib/blocks";

// Sources: Settings tabs (Sources/PeluniApp/UI/*Tab.swift), ModelCatalog.swift, CleanupEngine.swift,
// TextInjector.swift, docs/PROJECT.md. Autocomplete is left out: it shows no suggestions yet.
export const FEATURES: PageCopy = {
  lead: [
    "What peluni does once you hold Right ⌥, and the settings that change it. Every setting named here is in peluni's Settings window, under the tab given.",
  ],
  sections: [
    {
      id: "cleanup",
      heading: "Cleanup levels",
      blocks: [
        {
          p: [
            "Whisper writes down every word you say, false starts included. A small language model running on your Mac then tidies the text before it's pasted. You choose how much it changes in Settings → General → Cleanup level.",
          ],
        },
        {
          table: {
            caption: "Cleanup levels",
            head: ["Level", "What changes"],
            rows: [
              ["None", "Nothing. You get the raw transcript."],
              ["Light (default)", "Filler words like um and uh go, and punctuation and capitals get fixed."],
              ["Medium", "Also grammar, and false starts are dropped."],
              ["High", "Also sentence structure, and a dictated list becomes a list."],
            ],
          },
        },
        {
          p: [
            "Cleanup never holds up your text. If the model fails, or takes longer than ten seconds, peluni pastes the raw transcript. Its output is checked before it's used, and if it added words you didn't say or cut most of what you did, you get the raw transcript instead.",
          ],
        },
        {
          p: [
            "Dictations under 50 characters skip cleanup and are pasted as transcribed. You can change that number in Settings → Advanced.",
          ],
        },
        {
          p: [
            "The cleanup model is its own download, chosen in Settings → Models: Qwen3 4B (2.3 GB) gives the best results, and Llama 3.2 1B (0.7 GB) is lighter and faster.",
          ],
        },
      ],
    },
    {
      id: "vocabulary",
      heading: "Vocabulary",
      blocks: [
        {
          p: [
            "Speech models get names and jargon wrong in predictable ways. In Settings → Vocabulary, you add each term as it should be written, and optionally what it tends to come out as.",
          ],
        },
        {
          list: [
            [
              "Every term is passed to whisper as a hint before it transcribes, which nudges it toward your spelling. Cleanup is told to keep these terms exactly as written.",
            ],
            [
              "Each “sounds like” alias is replaced with its term after transcription, matching whole words and ignoring case. Replacements run in a single pass, so one rule's output is never rewritten by another.",
            ],
          ],
        },
        {
          p: [
            "Your list is plain JSON in ~/Library/Application Support/peluni/vocabulary.json, so you can back it up or edit it by hand.",
          ],
        },
      ],
    },
    {
      id: "models",
      heading: "Speech models",
      blocks: [
        {
          p: [
            "peluni transcribes with whisper.cpp on your Mac's GPU. The setup window downloads one speech model, and you can switch any time in Settings → Models. Every model understands several languages.",
          ],
        },
        {
          table: {
            caption: "Speech models",
            head: ["Model", "Download", "Good for"],
            rows: [
              ["Tiny", "78 MB", "Quick notes where a wrong word doesn't matter"],
              ["Base", "148 MB", "Where to start, and the one setup offers"],
              ["Small", "488 MB", "A better balance of accuracy and speed"],
              ["Medium", "1.5 GB", "Higher accuracy, but slower"],
              ["Large v3 Turbo", "1.6 GB", "The most accurate"],
            ],
          },
        },
        {
          p: [
            "Language is set to Auto-detect. If it picks the wrong one, set it to English, Norwegian, Swedish, Danish, German, Spanish or French in the same tab.",
          ],
        },
      ],
    },
    {
      id: "controls",
      heading: "Keys and hands-free dictation",
      blocks: [
        {
          table: {
            caption: "Keys",
            head: ["To", "Press"],
            rows: [
              ["Dictate while holding", "Hold Right ⌥, talk, let go"],
              ["Dictate hands-free", "Double-tap Right ⌥, then press it once to stop"],
              ["Cancel", "Esc"],
              ["Toggle with another shortcut", "Set one in Settings → General → Shortcuts"],
            ],
          },
        },
        {
          p: [
            "If a recording holds less than 0.3 seconds of speech, peluni treats it as an accidental tap and pastes nothing, so brushing the key is harmless.",
          ],
        },
      ],
    },
    {
      id: "pasting",
      heading: "Pasting and history",
      blocks: [
        {
          p: [
            "peluni pastes into whatever app has your cursor, with the same ⌘V you would use. It saves your clipboard first and puts it back afterwards, unless something else changed the clipboard in the meantime.",
          ],
        },
        {
          p: [
            "Some apps refuse pastes from other programs. For those, set Settings → Advanced → Method to Type character-by-character. It's slower, and it gets through.",
          ],
        },
        {
          p: [
            "If a paste can't land, your text stays on the clipboard and peluni tells you to press ⌘V. In a password field it types nothing and leaves the clipboard alone.",
          ],
        },
        {
          p: [
            "Your last ten transcripts are in the menu bar menu under Recent transcripts; click one to copy it again. They're kept in memory and never written to disk. peluni has no Dock icon, and Settings → General → Launch peluni at login keeps it ready after a restart.",
          ],
        },
      ],
    },
  ],
};
