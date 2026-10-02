import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Audio } from "@/components/Audio";
import { Install } from "@/components/Install";
import { AUDIO, INSTALL_GUIDE } from "@/lib/content";
import { SITE } from "@/lib/site";

describe("Where your audio goes", () => {
  test("shows dictation working with Wi-Fi off, then the path in one line", () => {
    render(<Audio />);
    const region = screen.getByRole("region", { name: AUDIO.title });
    expect(region.id).toBe("privacy");
    const scene = within(region).getByRole("figure", { name: AUDIO.scene.label });
    expect(within(scene).getByText(AUDIO.scene.wifiState)).toBeDefined();
    expect(within(scene).getByText(AUDIO.caption)).toBeDefined();
    const path = within(region).getByRole("list", { name: AUDIO.pathLabel });
    expect([...path.querySelectorAll("li")].map((li) => li.textContent?.replace("→", ""))).toEqual([...AUDIO.stages]);
  });

  test("then says it in prose, with the storage path and a link to the source", () => {
    render(<Audio />);
    const region = screen.getByRole("region", { name: AUDIO.title });
    for (const p of AUDIO.paragraphs) expect(within(region).getByText(p)).toBeDefined();
    expect(within(region).getByText(AUDIO.storagePath).tagName).toBe("CODE");
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
    for (const row of INSTALL_GUIDE.setup.rows) expect(within(region).getByText(row.name)).toBeDefined();
    for (const r of INSTALL_GUIDE.requirements) {
      expect(within(region).getByText(r.title)).toBeDefined();
      expect(within(region).getByText(r.detail)).toBeDefined();
    }
  });
});
