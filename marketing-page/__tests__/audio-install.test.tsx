import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Audio } from "@/components/Audio";
import { Install } from "@/components/Install";
import { AUDIO, INSTALL_GUIDE } from "@/lib/content";
import { SITE } from "@/lib/site";

describe("Where your audio goes", () => {
  test("shows dictation working with Wi-Fi off", () => {
    render(<Audio />);
    const region = screen.getByRole("region", { name: AUDIO.title });
    expect(region.id).toBe("privacy");
    const scene = within(region).getByRole("figure", { name: AUDIO.scene.label });
    expect(within(scene).getByText(AUDIO.scene.wifiState)).toBeDefined();
    expect(region.querySelectorAll("h2")).toHaveLength(1);
  });

  test("then says it in one paragraph, with a link to the source", () => {
    render(<Audio />);
    const region = screen.getByRole("region", { name: AUDIO.title });
    expect(region.textContent).toContain(AUDIO.paragraphs[0]);
    expect(within(region).getByRole("link", { name: AUDIO.sourceLink }).getAttribute("href")).toBe(SITE.repoUrl);
  });
});

describe("Building it yourself", () => {
  test("ends the page on the real build steps", () => {
    render(<Install />);
    const region = screen.getByRole("region", { name: INSTALL_GUIDE.title });
    expect(region.id).toBe("install");
    expect(region.querySelectorAll("ol > li")).toHaveLength(INSTALL_GUIDE.steps.length);
    expect(within(region).getByRole("link", { name: "peluni repository" }).getAttribute("href")).toBe(SITE.repoUrl);
    expect(region.querySelector("ol code")?.textContent).toBe("xcodebuild -downloadComponent MetalToolchain");
    expect([...region.querySelectorAll("ol code")].map((c) => c.textContent)).toContain("make run");
  });
});
