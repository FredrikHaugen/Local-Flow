import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Home from "@/app/page";
import { ANYWHERE, NAV, SITE } from "@/lib/site";

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
    for (const name of [ANYWHERE.title, "How it works", "Under the hood", "Private by construction", "Requirements"]) {
      expect(screen.getByRole("region", { name })).toBeDefined();
    }
  });
});
