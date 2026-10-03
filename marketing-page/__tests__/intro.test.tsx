import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Install } from "@/components/Install";
import { Intro } from "@/components/Intro";
import { INSTALL_GUIDE, INTRO, USING } from "@/lib/content";
import { PHONE, SITE } from "@/lib/site";

describe("Intro", () => {
  test("is the page's h1 and where the release stands, then one take from speech to text", () => {
    render(<Intro />);
    const region = screen.getByRole("region", { name: INTRO.title });
    expect(region.id).toBe("top");
    expect(within(region).getByRole("heading", { level: 1, name: INTRO.title })).toBeDefined();
    expect(region.textContent).toContain(INTRO.bodyMore);
    expect(within(region).getByRole("link", { name: "build it from the source" }).getAttribute("href")).toBe(SITE.buildUrl);
    expect(within(region).getByRole("figure", { name: USING.sceneLabel })).toBeDefined();
  });

  test("the scene is honest: the last take has landed, the overlay listens over an empty new row", () => {
    const { container } = render(<Intro />);
    expect(container.textContent).toContain(USING.window.text);
    expect(container.querySelector(".wave-bar")).not.toBeNull();
    const rows = [...container.querySelectorAll("figure ul > li")];
    expect(rows.at(-2)!.textContent).toContain(USING.window.text);
    const next = rows.at(-1)!.cloneNode(true) as HTMLElement;
    next.querySelectorAll("[aria-hidden='true']").forEach((n) => n.remove());
    expect(next.textContent).toBe("");
  });

  test("offers phones a way to send the page to a Mac", () => {
    render(<Intro />);
    expect(screen.getByRole("button", { name: new RegExp(PHONE.handoff) })).toBeDefined();
  });
});

describe("The closing status", () => {
  test("closes on how to use it, the run requirements and the page's one version mention", () => {
    const { container } = render(<Install />);
    expect(container.textContent).toContain(USING.paragraphs[0]);
    const status = container.querySelector("[data-status]")!;
    for (const r of INSTALL_GUIDE.requirements.slice(0, 2)) expect(status.textContent).toContain(r.title);
    expect(status.textContent).toContain(SITE.version);
  });
});
