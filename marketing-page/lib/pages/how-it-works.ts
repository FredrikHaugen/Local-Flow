import type { PageCopy } from "@/lib/blocks";
import { SITE, UPSTREAM } from "@/lib/site";

// Sources: README.md "How it works", docs/PROJECT.md "The processing pipeline" and "Reliability
// principles", DictationController.swift and TranscriptionEngine.swift for the messages.
export const HOW_IT_WORKS: PageCopy = {
  lead: [
    "Between pressing Right ⌥ and seeing your words, peluni runs five stages, all on your Mac. Esc cancels at any stage, and a failure at any stage still leaves you with your text or a message saying what to fix.",
  ],
  sections: [
    {
      id: "capture",
      heading: "Capture",
      blocks: [
        {
          p: [
            "While you hold the key, peluni records your microphone at 16 kHz in mono, the format whisper expects. The waveform in the overlay is drawn from the live audio level.",
          ],
        },
      ],
    },
    {
      id: "trim",
      heading: "Trimming silence",
      blocks: [
        {
          p: [
            "Silence at the start and end is cut. If less than 0.3 seconds of speech is left, peluni treats the recording as an accidental tap and stops there.",
          ],
        },
      ],
    },
    {
      id: "transcribe",
      heading: "Transcription",
      blocks: [
        {
          p: [
            { text: "whisper.cpp", href: UPSTREAM.whisperCpp },
            " turns the audio into text on your Mac's GPU, with your vocabulary passed in as hints. A filter then removes what whisper invents when it hears noise instead of speech, such as [Music] or (applause), while keeping parentheses you actually said. Your “sounds like” aliases are replaced after that.",
          ],
        },
      ],
    },
    {
      id: "clean-up",
      heading: "Cleanup",
      blocks: [
        {
          p: [
            "A small language model, run through Apple's ",
            { text: "MLX", href: UPSTREAM.mlx },
            " framework, tidies the text at the level you chose. It works under one rule: it can't block or corrupt a dictation. An error, an output that adds or drops too much, or a run longer than ten seconds all fall back to the raw transcript.",
          ],
        },
        {
          p: [
            "The model loads from disk the first time you need it and unloads after ten minutes without use, to give the memory back. Once it's downloaded, loading it doesn't touch the network.",
          ],
        },
      ],
    },
    {
      id: "paste",
      heading: "Pasting",
      blocks: [
        {
          p: [
            "The text is pasted into the focused app with a synthesized ⌘V, and the text on your clipboard is saved before and restored after (an image or file you had copied isn't kept). peluni asks macOS whether the focused field is a password field before pasting, and asks again just before the paste lands, in case focus moved. In a password field it pastes nothing; if focus moved into one at the last moment, it puts your clipboard text back.",
          ],
        },
      ],
    },
    {
      id: "failures",
      heading: "When something goes wrong",
      blocks: [
        {
          list: [
            [
              "No speech model downloaded: the overlay says “No transcription model installed. Open Settings → Models.” before anything is recorded.",
            ],
            ["Microphone access turned off: peluni says so and opens the setup window, also before recording."],
            ["peluni can't send the keystrokes: your text stays on the clipboard and the overlay tells you to press ⌘V."],
            ["Cleanup fails or runs out of time: the raw transcript is pasted, with no error."],
          ],
        },
      ],
    },
    {
      id: "code",
      heading: "Reading the code",
      blocks: [
        {
          p: [
            "The decisions above (the state machine, the silence trimmer, the whisper filter and the vocabulary rules) live in one module with no system dependencies, covered by unit tests that run without a microphone or a model. ",
            { text: "Read it on GitHub", href: `${SITE.repoUrl}/tree/main/Sources/PeluniCore` },
            ".",
          ],
        },
      ],
    },
  ],
};
