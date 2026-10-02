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

  test("the take shows the overlay cleaning up, not listening, over finished text", () => {
    const { container } = render(<Intro />);
    expect(container.textContent).toContain(USING.cleaningLabel);
    expect(container.textContent).not.toContain(USING.overlayLabel.split("  ")[0]);
    expect(container.textContent).toContain(USING.window.text);
  });

  test("offers phones a way to send the page to a Mac", () => {
    render(<Intro />);
    expect(screen.getByRole("button", { name: new RegExp(PHONE.handoff) })).toBeDefined();
  });
});

describe("Installing", () => {
  test("next to the steps: the key legend, the speed line and the paste fallback", () => {
    const { container } = render(<Install />);
    expect(container.textContent).toContain(USING.paragraphs[0]);
    expect(container.textContent).toContain(USING.keysEnd);
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
