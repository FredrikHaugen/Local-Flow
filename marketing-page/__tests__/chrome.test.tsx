import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Header } from "@/components/Header";
import { SITE } from "@/lib/site";

describe("Header", () => {
  test("has the wordmark, the source and a Download link, and nothing else", () => {
    render(<Header />);
    expect(screen.getByText(SITE.name)).toBeDefined();
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Source" }).getAttribute("href")).toBe(SITE.repoUrl);
    expect(within(nav).getByRole("link", { name: "Download" }).getAttribute("href")).toBe(SITE.releasesUrl);
    expect(within(nav).getAllByRole("link")).toHaveLength(2);
  });
});
