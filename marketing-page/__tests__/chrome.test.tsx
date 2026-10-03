import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PAGES } from "@/lib/pages";
import { SITE } from "@/lib/site";

describe("Header", () => {
  test("has the wordmark linking home and the page links", () => {
    render(<Header />);
    expect(screen.getByText(SITE.name).closest("a")?.getAttribute("href")).toBe("/");
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(
      PAGES.filter((p) => p.header).map((p) => p.path),
    );
  });
});

describe("tap targets", () => {
  // 44 px (Tailwind min-h-11) for every standalone link in the header and footer lists.
  test("header links are at least 44 px tall", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    const links = [screen.getByText(SITE.name).closest("a")!, ...within(nav).getAllByRole("link")];
    for (const a of links) expect(a.className).toContain("min-h-11");
  });

  test("footer list links are at least 44 px tall", () => {
    const { container } = render(<Footer />);
    const links = [...container.querySelectorAll("ul a")];
    expect(links.length).toBeGreaterThan(0);
    for (const a of links) expect(a.className).toContain("min-h-11");
  });
});
