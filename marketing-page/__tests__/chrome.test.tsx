import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Header } from "@/components/Header";
import { PAGES } from "@/lib/pages";
import { SITE } from "@/lib/site";

describe("Header", () => {
  test("has the wordmark linking home, the page links and Download", () => {
    render(<Header />);
    expect(screen.getByText(SITE.name).closest("a")?.getAttribute("href")).toBe("/");
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Download" }).getAttribute("href")).toBe(SITE.releasesUrl);
    const pageLinks = within(nav)
      .getAllByRole("link")
      .filter((a) => a.textContent !== "Download");
    expect(pageLinks.map((a) => a.getAttribute("href"))).toEqual(PAGES.filter((p) => p.header).map((p) => p.path));
  });
});
