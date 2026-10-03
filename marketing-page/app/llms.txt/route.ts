import { AUDIO, INSTALL_GUIDE, QUESTIONS, USING } from "@/lib/content";
import { PAGES } from "@/lib/pages";
import { SITE } from "@/lib/site";

// /llms.txt (llmstxt.org): a plain-Markdown summary for AI tools, built from the same facts as the page.
// Static: rendered once at build time into out/llms.txt (required by output: "export").
export const dynamic = "force-static";

export function llmsTxt() {
  return [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `${SITE.name} is ${SITE.license} licensed, version ${SITE.version}. Speech recognition runs on whisper.cpp on the Metal GPU; an optional small LLM on Apple MLX removes filler words and fixes punctuation.`,
    "",
    "## Requirements",
    "",
    ...INSTALL_GUIDE.requirements.map((r) => `- ${r.title}: ${r.detail}`),
    "",
    "## Privacy",
    "",
    `${AUDIO.display} ${AUDIO.paragraphs.join(" ")}`,
    "",
    "## FAQ",
    "",
    `### ${USING.speedTitle}`,
    "",
    USING.paragraphs[0],
    "",
    ...QUESTIONS.items.flatMap((item) => [`### ${item.q}`, "", item.a, ""]),
    "## Pages",
    "",
    ...PAGES.filter((p) => p.path !== "/").map((p) => `- [${p.nav}](${SITE.url}${p.path}): ${p.description}`),
    "",
    "## Links",
    "",
    `- [Website](${SITE.url}/)`,
    `- [Download (GitHub Releases)](${SITE.releasesUrl})`,
    `- [Source code and README](${SITE.repoUrl})`,
    "",
  ].join("\n");
}

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
