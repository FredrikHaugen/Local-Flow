import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Install } from "@/components/Install";
import { Intro } from "@/components/Intro";
import { INSTALL_GUIDE, INTRO, USING } from "@/lib/content";
import { PHONE, SITE } from "@/lib/site";

describe("Intro", () => {
  test("is the page's h1 and the download, then one take from speech to text", () => {
    render(<Intro />);
    const region = screen.getByRole("region", { name: INTRO.title });
    expect(region.id).toBe("top");
    expect(within(region).getByRole("heading", { level: 1, name: INTRO.title })).toBeDefined();
    expect(within(region).getByRole("link", { name: INTRO.download }).getAttribute("href")).toBe(SITE.releasesUrl);
    expect(within(region).getByRole("figure", { name: USING.sceneLabel })).toBeDefined();
  });

  test("the scene is honest: the last take has landed, the overlay listens over an empty new row", () => {
    const { container } = render(<Intro />);
    expect(container.textContent).toContain(USING.window.text);
    expect(container.querySelector(".wave-bar")).not.toBeNull();
    const rows = [...container.querySelectorAll("figure ul > li")];
    expect(rows.at(-2)!.textContent).toContain(USING.window.text);
    expect(rows.at(-1)!.textContent).toBe("");
  });

  test("offers phones a way to send the page to a Mac", () => {
    render(<Intro />);
    expect(screen.getByRole("button", { name: new RegExp(PHONE.handoff) })).toBeDefined();
  });
});

describe("The closing download", () => {
  test("closes on how to use it, the requirements and the page's one version mention", () => {
    const { container } = render(<Install />);
    expect(container.textContent).toContain(INTRO.bodyMore);
    const cta = screen.getByRole("link", { name: INSTALL_GUIDE.download }).closest("[data-cta]")!;
    for (const r of INSTALL_GUIDE.requirements.slice(0, 2)) expect(cta.textContent).toContain(r.title);
    expect(cta.textContent).toContain(SITE.version);
  });
});
