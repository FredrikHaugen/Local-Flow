import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { type Inline, type PageCopy, inlineText } from "@/lib/blocks";
import { FEATURES } from "@/lib/pages/features";
import { HOW_IT_WORKS } from "@/lib/pages/how-it-works";
import { SECURITY } from "@/lib/pages/security";
import { UPSTREAM } from "@/lib/site";

const repo = (path: string) => readFileSync(resolve(process.cwd(), "..", path), "utf8");

function paragraphs(copy: PageCopy, sectionId?: string): (readonly Inline[])[] {
  const sections = sectionId ? copy.sections.filter((s) => s.id === sectionId) : copy.sections;
  if (!sections.length) throw new Error(`no section ${sectionId}`);
  return sections.flatMap((s) => s.blocks.flatMap((b) => ("p" in b ? [b.p] : [])));
}

function linkTo(parts: readonly Inline[], href: string) {
  return parts.find((p): p is { text: string; href: string } => typeof p === "object" && "href" in p && p.href === href);
}

describe("upstream links", () => {
  test("point at the projects the app is built from", () => {
    // Makefile downloads whisper.cpp from ggml-org; Package.swift depends on ml-explore's MLX Swift packages.
    expect(repo("Makefile")).toContain(UPSTREAM.whisperCpp.replace("https://", ""));
    expect(repo("Package.swift")).toContain("https://github.com/ml-explore/");
    expect(UPSTREAM.mlx).toBe("https://github.com/ml-explore/mlx-swift");
    expect(UPSTREAM.notarization).toMatch(/^https:\/\/developer\.apple\.com\/documentation\//);
    expect(repo("scripts/release.sh")).toContain("notarytool");
  });

  test("how it works links whisper.cpp and MLX, with the text unchanged", () => {
    const [transcribe] = paragraphs(HOW_IT_WORKS, "transcribe");
    expect(linkTo(transcribe, UPSTREAM.whisperCpp)?.text).toBe("whisper.cpp");
    expect(inlineText(transcribe)).toMatch(/^whisper\.cpp turns the audio into text on your Mac's GPU/);

    const [cleanup] = paragraphs(HOW_IT_WORKS, "clean-up");
    expect(linkTo(cleanup, UPSTREAM.mlx)?.text).toBe("MLX");
    expect(inlineText(cleanup)).toMatch(/^A small language model, run through Apple's MLX framework, tidies/);
  });

  test("features links whisper.cpp", () => {
    const para = paragraphs(FEATURES).find((p) => inlineText(p).startsWith("peluni transcribes with whisper.cpp"));
    expect(para && linkTo(para, UPSTREAM.whisperCpp)?.text).toBe("whisper.cpp");
  });

  test("security links Apple's notarization docs", () => {
    const [signing] = paragraphs(SECURITY, "signing");
    expect(linkTo(signing, UPSTREAM.notarization)?.text).toBe("notarize");
    expect(inlineText(signing)).toContain("and has Apple notarize the build, and it stops if any of those checks fails.");
  });
});
