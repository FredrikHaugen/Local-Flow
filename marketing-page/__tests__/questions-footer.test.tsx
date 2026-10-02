import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Footer } from "@/components/Footer";
import { Questions } from "@/components/Questions";
import { FOOTER_NOTE, INSTALL_GUIDE, QUESTIONS, USING } from "@/lib/content";
import { SITE } from "@/lib/site";

describe("Questions", () => {
  test("answers a buyer's questions in the open, speed first, and points to the README for reference detail", () => {
    render(<Questions />);
    const region = screen.getByRole("region", { name: QUESTIONS.title });
    expect(region.id).toBe("faq");
    expect(region.querySelectorAll("details, table, pre")).toHaveLength(0);
    const asked = within(region).getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(asked[0]).toBe(USING.speedTitle);
    expect(asked.length).toBeLessThanOrEqual(7);
    expect(region.textContent).toContain(USING.paragraphs[0]);
    expect(region.textContent).toContain(USING.keysEnd);
    for (const r of INSTALL_GUIDE.requirements) expect(within(region).getByText(r.title)).toBeDefined();
    for (const item of QUESTIONS.items) expect(within(region).getByText(item.a)).toBeDefined();
    expect(QUESTIONS.items[0].q).not.toMatch(/is it free|really free|cost|price/i);
    expect(within(region).getByRole("link", { name: QUESTIONS.detailsLink }).getAttribute("href")).toBe(`${SITE.repoUrl}#readme`);
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
