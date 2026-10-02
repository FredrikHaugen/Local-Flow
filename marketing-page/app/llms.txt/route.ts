import { FAQ, PRIVACY_POINTS, REQUIREMENTS, SITE } from "@/lib/site";

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
    ...REQUIREMENTS.map((r) => `- ${r.title}: ${r.detail}`),
    "",
    "## Privacy",
    "",
    ...PRIVACY_POINTS.map((p) => `- ${p.title}: ${p.body}`),
    "",
    "## FAQ",
    "",
    ...FAQ.items.flatMap((item) => [`### ${item.q}`, "", item.a, ""]),
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
