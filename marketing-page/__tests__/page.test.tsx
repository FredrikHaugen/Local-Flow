import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Home from "@/app/page";
import { ANYWHERE, FAQ, FINAL_CTA, INSTALL, NAV, SITE, SPEED, YOURS } from "@/lib/site";

describe("Home page", () => {
  test("has exactly one h1", () => {
    render(<Home />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  test("every in-page anchor points at an element that exists", () => {
    const { container } = render(<Home />);
    const anchors = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    expect(anchors.length).toBeGreaterThanOrEqual(NAV.length);
    for (const a of anchors) {
      const id = a.getAttribute("href")!.slice(1);
      expect(container.querySelector(`[id="${id}"]`), `missing target for ${a.getAttribute("href")}`).not.toBeNull();
    }
  });

  test("every link has an accessible name", () => {
    render(<Home />);
    for (const link of screen.getAllByRole("link")) {
      expect(link.textContent?.trim() || link.getAttribute("aria-label")).toBeTruthy();
    }
  });

  test("every Download link goes to the releases page", () => {
    render(<Home />);
    const downloads = screen.getAllByRole("link", { name: /download/i });
    expect(downloads.length).toBeGreaterThanOrEqual(3);
    for (const link of downloads) expect(link.getAttribute("href")).toBe(SITE.releasesUrl);
  });

  test("all content sections are present", () => {
    render(<Home />);
    for (const name of [ANYWHERE.title, "How it works", YOURS.title, SPEED.title, "Private by construction", INSTALL.title, FAQ.title, FINAL_CTA.title]) {
      expect(screen.getByRole("region", { name })).toBeDefined();
    }
    expect(screen.getByRole("figure", { name: "Under the hood" })).toBeDefined();
  });

  test("the speed band comes straight after the hero", () => {
    const { container } = render(<Home />);
    const sections = [...container.querySelectorAll("main > section")].map((s) => s.id);
    expect(sections.slice(0, 2)).toEqual(["top", "speed"]);
  });
});
