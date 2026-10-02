import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
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

describe("Footer", () => {
  test("states the license, links the source, and says analytics are opt-in", () => {
    render(<Footer />);
    expect(screen.getByText(/MIT licensed/)).toBeDefined();
    expect(screen.getByRole("link", { name: "Source on GitHub" }).getAttribute("href")).toBe(SITE.repoUrl);
    expect(screen.getByText(/unless you allow analytics/i)).toBeDefined();
  });
});

describe("Section", () => {
  test("is a region labelled by its h2", () => {
    render(
      <Section id="demo" title="Demo title" intro="Intro text">
        <p>Body</p>
      </Section>,
    );
    const region = screen.getByRole("region", { name: "Demo title" });
    expect(region.id).toBe("demo");
    expect(within(region).getByRole("heading", { level: 2, name: "Demo title" })).toBeDefined();
    expect(within(region).getByText("Intro text")).toBeDefined();
  });
});
