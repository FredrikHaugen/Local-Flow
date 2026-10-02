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

describe("Installing", () => {
  test("lists the real steps, the checksum command and every requirement", () => {
    render(<Install />);
    const region = screen.getByRole("region", { name: INSTALL_GUIDE.title });
    expect(region.id).toBe("install");
    expect(region.querySelectorAll("ol > li")).toHaveLength(INSTALL_GUIDE.steps.length);
    expect(within(region).getByRole("link", { name: INSTALL_GUIDE.steps[0].link }).getAttribute("href")).toBe(SITE.releasesUrl);
    expect(within(region).getByText(INSTALL_GUIDE.checksumCommand).closest("pre")).not.toBeNull();
    expect(within(region).getByRole("link", { name: INSTALL_GUIDE.download }).getAttribute("href")).toBe(SITE.releasesUrl);
    for (const r of INSTALL_GUIDE.requirements) {
      expect(within(region).getByText(r.title)).toBeDefined();
      expect(within(region).getByText(r.detail)).toBeDefined();
    }
  });
});
