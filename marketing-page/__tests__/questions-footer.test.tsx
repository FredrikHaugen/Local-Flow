import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Footer } from "@/components/Footer";
import { Questions } from "@/components/Questions";
import { FOOTER_NOTE, QUESTIONS } from "@/lib/content";
import { SITE } from "@/lib/site";

describe("Questions", () => {
  test("answers each question in a native disclosure, practical questions first", () => {
    render(<Questions />);
    const region = screen.getByRole("region", { name: QUESTIONS.title });
    expect(region.id).toBe("faq");
    expect(region.querySelectorAll("details")).toHaveLength(QUESTIONS.items.length);
    for (const item of QUESTIONS.items) expect(within(region).getByText(item.a)).toBeDefined();
    expect(QUESTIONS.items[0].q).not.toMatch(/free|cost|price/i);
    expect(within(region).getByRole("link", { name: QUESTIONS.moreLink }).getAttribute("href")).toBe(`${SITE.repoUrl}/issues`);
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
