import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Intro } from "@/components/Intro";
import { INTRO } from "@/lib/content";
import { PHONE, SITE } from "@/lib/site";

describe("Intro", () => {
  test("is the page's h1, with Download, the requirement and the version", () => {
    render(<Intro />);
    const region = screen.getByRole("region", { name: INTRO.title });
    expect(region.id).toBe("top");
    expect(within(region).getByRole("heading", { level: 1, name: INTRO.title })).toBeDefined();
    const download = within(region).getByRole("link", { name: INTRO.download });
    expect(download.getAttribute("href")).toBe(SITE.releasesUrl);
    const cta = download.closest("[data-cta]")!;
    expect(cta.textContent).toContain(INTRO.requirement);
    expect(cta.textContent).toContain(SITE.version);
  });

  test("offers phones a way to send the page to a Mac, after the requirement", () => {
    render(<Intro />);
    const cta = screen.getByRole("link", { name: INTRO.download }).closest("[data-cta]")!;
    const send = screen.getByRole("button", { name: new RegExp(PHONE.handoff) });
    expect(send.closest("[data-cta]")).toBe(cta);
    expect(cta.textContent!.indexOf(INTRO.requirement)).toBeLessThan(cta.textContent!.indexOf(PHONE.handoff));
  });
});
