import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Home from "@/app/page";
import { SITE } from "@/lib/site";

describe("Home page", () => {
  test("has exactly one h1", () => {
    render(<Home />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  test("sections come in this order", () => {
    const { container } = render(<Home />);
    expect([...container.querySelectorAll("main > section")].map((s) => s.id)).toEqual([
      "top",
      "cleanup",
      "vocabulary",
      "faq",
      "privacy",
      "install",
    ]);
  });

  test("every in-page anchor points at an element that exists", () => {
    const { container } = render(<Home />);
    for (const a of container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
      expect(container.querySelector(`[id="${a.getAttribute("href")!.slice(1)}"]`)).not.toBeNull();
    }
  });

  test("every link has an accessible name and every Download goes to the releases page", () => {
    render(<Home />);
    for (const link of screen.getAllByRole("link")) expect(link.textContent?.trim() || link.getAttribute("aria-label")).toBeTruthy();
    const downloads = screen.getAllByRole("link", { name: /download/i });
    expect(downloads.length).toBeGreaterThanOrEqual(2);
    for (const link of downloads) expect(link.getAttribute("href")).toBe(SITE.releasesUrl);
  });
});

describe("no template tells", () => {
  test("no em or en dashes anywhere on the page", () => {
    const { container } = render(<Home />);
    expect(container.textContent).not.toMatch(/[—–]/);
  });

  test("the version is stated once", () => {
    const { container } = render(<Home />);
    expect(container.textContent!.split(SITE.version).length - 1).toBe(1);
  });

  test("section headings are plain: no highlight, no full stop", () => {
    const { container } = render(<Home />);
    for (const h of container.querySelectorAll("h2")) {
      expect(h.querySelector("mark, .typed, .selected"), h.textContent!).toBeNull();
      expect(h.textContent).not.toMatch(/[.!]$/);
    }
  });

  test("no lists of three short slogans", () => {
    const { container } = render(<Home />);
    for (const list of container.querySelectorAll("main ul, main ol")) {
      const items = [...list.children].map((li) => li.textContent!.trim());
      const slogans = items.length === 3 && items.every((t) => t.split(/\s+/).length <= 3);
      expect(slogans, items.join(" / ")).toBe(false);
    }
  });

  test("tables scroll inside their own container", () => {
    const { container } = render(<Home />);
    for (const t of container.querySelectorAll("table")) expect(t.parentElement?.className).toContain("overflow-x-auto");
  });

  test("no final call-to-action band and no oversized footer name", () => {
    const { container } = render(<Home />);
    expect(container.querySelector(".wallpaper, .footer-name, .cta-key")).toBeNull();
  });
});
