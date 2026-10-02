import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Footer } from "@/components/Footer";
import { Audio } from "@/components/Audio";
import { Install } from "@/components/Install";
import { AUDIO, FOOTER_NOTE, QUESTIONS } from "@/lib/content";
import { SITE } from "@/lib/site";

describe("Answers in place", () => {
  test("the privacy line also covers password fields", () => {
    render(<Audio />);
    const region = screen.getByRole("region", { name: AUDIO.title });
    expect(region.textContent).toContain("password field");
  });

  test("the closing download says how to dictate hands-free, and points to the README and to issues", () => {
    const { container } = render(<Install />);
    expect(container.textContent).toContain(QUESTIONS.items[0].a);
    expect(screen.getByRole("link", { name: QUESTIONS.detailsLink }).getAttribute("href")).toBe(`${SITE.repoUrl}#readme`);
    expect(screen.getByRole("link", { name: QUESTIONS.moreLink }).getAttribute("href")).toBe(`${SITE.repoUrl}/issues`);
  });
});

describe("Footer", () => {
  test("links the project, says analytics are opt-in, and shows no version", () => {
    const { container } = render(<Footer />);
    for (const link of FOOTER_NOTE.links) {
      expect(screen.getByRole("link", { name: link.label }).getAttribute("href")).toBe(link.href);
    }
    expect(screen.getByText(FOOTER_NOTE.site, { exact: false })).toBeDefined();
    expect(container.textContent).not.toContain(SITE.version);
    expect(container.querySelector(".footer-name")).toBeNull();
  });
});
