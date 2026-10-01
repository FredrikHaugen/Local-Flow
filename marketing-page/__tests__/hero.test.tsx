import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Hero } from "@/components/Hero";
import { DEMO, SITE } from "@/lib/site";

describe("Hero", () => {
  test("leads with the tagline as the h1, emphasis included", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1, name: SITE.tagline })).toBeDefined();
  });

  test("offers Download and GitHub", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: "Download for Mac" }).getAttribute("href")).toBe(SITE.releasesUrl);
    expect(screen.getByRole("link", { name: "View on GitHub" }).getAttribute("href")).toBe(SITE.repoUrl);
  });

  test("states the requirements right next to the Download button", () => {
    render(<Hero />);
    const download = screen.getByRole("link", { name: "Download for Mac" });
    const ctaBlock = download.closest("[data-cta]");
    expect(ctaBlock?.textContent).toContain("macOS 14+");
    expect(ctaBlock?.textContent).toContain("Apple Silicon");
    expect(ctaBlock?.textContent).toContain(`v${SITE.version}`);
  });

  test("labels both halves of the demo: what you said and what got typed", () => {
    render(<Hero />);
    expect(screen.getByText(DEMO.heardLabel)).toBeDefined();
    expect(screen.getByText(DEMO.typedLabel)).toBeDefined();
  });

  test("shows the before/after cleanup example, waveform hidden from screen readers", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("[data-demo='raw']")?.textContent).toBe(DEMO.raw);
    expect(screen.getByText(DEMO.cleaned)).toBeDefined();
    const struck = [...container.querySelectorAll("[data-demo='raw'] s")].map((s) => s.textContent);
    expect(struck).toEqual([...DEMO.fillers]);
    const bar = container.querySelector(".wave-bar");
    expect(bar?.closest("[aria-hidden='true']")).not.toBeNull();
  });
});
