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
    expect(region.textContent).toContain(INTRO.bodyAfter);
  });

  test("the scene is honest: the last take has landed, the overlay listens over an empty new row", () => {
    const { container } = render(<Intro />);
    expect(container.textContent).toContain(USING.window.text);
    expect(container.querySelector(".wave-bar")).not.toBeNull();
    const rows = [...container.querySelectorAll("figure ul:not([aria-hidden]) > li")];
    expect(rows.at(-2)!.textContent).toBe(USING.window.text);
    expect(rows.at(-1)!.textContent).toBe("");
  });

  test("offers phones a way to send the page to a Mac", () => {
    render(<Intro />);
    expect(screen.getByRole("button", { name: new RegExp(PHONE.handoff) })).toBeDefined();
  });
});

describe("Installing", () => {
  test("shows the keys as a legend next to the steps", () => {
    const { container } = render(<Install />);
    const legend = container.querySelector(`dl[aria-label="${USING.keysLabel}"]`)!;
    expect(legend.querySelectorAll("dt kbd")).toHaveLength(USING.keys.length);
  });
});

describe("The closing download", () => {
  test("carries the requirement and the page's one version mention", () => {
    render(<Install />);
    const cta = screen.getByRole("link", { name: INSTALL_GUIDE.download }).closest("[data-cta]")!;
    expect(cta.textContent).toContain(INTRO.requirement);
    expect(cta.textContent).toContain(SITE.version);
  });
});
