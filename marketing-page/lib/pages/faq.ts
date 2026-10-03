import type { Inline } from "@/lib/blocks";
import { inlineText } from "@/lib/blocks";
import { QUESTIONS, USING } from "@/lib/content";
import { SITE } from "@/lib/site";

// The questions a careful buyer asks, including the ones with "no" for an answer. Three answers are
// shared with the home page (QUESTIONS) so they never drift apart. The 1.0 pricing answer is
// Fredrik's statement of 2026-10-02.
const [handsFree, transcripts, passwordFields] = QUESTIONS.items;

export const FAQ = {
  lead: [
    "Answers to what people ask before installing peluni. If yours isn't here, ",
    { text: "ask on GitHub", href: `${SITE.repoUrl}/issues` },
    ".",
  ] as readonly Inline[],
  items: [
    {
      id: "offline",
      q: "Does peluni work offline?",
      a: [
        "Yes. Once the models are downloaded, transcription and cleanup run without a connection. peluni goes online only to download a model, when you press Download.",
      ],
    },
    {
      id: "data",
      q: "Does any of my audio or text leave my Mac?",
      a: [
        "No. Audio is recorded into memory, transcribed and cleaned up on your Mac, and never written to disk. The app has no analytics, crash reporting or update checks, and its logs record how long a transcript was, never what it said. The ",
        { text: "privacy page", href: "/privacy" },
        " has the details.",
      ],
    },
    {
      id: "price",
      q: "Will peluni stay free?",
      a: [
        "Every version before 1.0 is free. From 1.0, peluni will include some form of payment; how that works isn't decided yet. The source code is MIT licensed.",
      ],
    },
    {
      id: "intel",
      q: "Does it run on Intel Macs?",
      a: [
        "No. peluni is built for Apple Silicon (M1 or later) only. Its cleanup runs on Apple's MLX framework, which supports only Apple Silicon.",
      ],
    },
    {
      id: "languages",
      q: "Which languages does it understand?",
      a: [
        "Every speech model is multilingual. Language is set to Auto-detect, and you can set it to English, Norwegian, Swedish, Danish, German, Spanish or French in Settings → Models. See ",
        { text: "speech models", href: "/features#models" },
        ".",
      ],
    },
    {
      id: "platforms",
      q: "Is there a version for Windows, Linux or iPhone?",
      a: ["No, and none is planned for now. peluni is a Mac app."],
    },
    { id: "speed", q: "How fast is it?", a: [USING.paragraphs[0]] },
    { id: "hands-free", q: handsFree.q, a: [handsFree.a] },
    { id: "transcripts", q: transcripts.q, a: [transcripts.a] },
    { id: "password-fields", q: passwordFields.q, a: [passwordFields.a] },
    {
      id: "learning",
      q: "Does peluni learn from my corrections?",
      a: [
        "No. It doesn't watch what you edit afterwards. Add words it gets wrong in Settings → Vocabulary, and they'll be spelled your way from then on.",
      ],
    },
    {
      id: "app-store",
      q: "Why isn't peluni in the Mac App Store?",
      a: [
        "Pasting into other apps needs Accessibility access, which sandboxed apps can't use that way, and the App Store requires the sandbox. So once it's released, peluni will be published on GitHub instead. The ",
        { text: "security page", href: "/security" },
        " explains what it does with that access.",
      ],
    },
  ],
} as const;

export function faqForJsonLd(): { q: string; a: string }[] {
  return FAQ.items.map((item) => ({ q: item.q, a: inlineText(item.a) }));
}
