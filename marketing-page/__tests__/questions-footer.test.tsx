import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Footer } from "@/components/Footer";
import { Questions } from "@/components/Questions";
import { FOOTER_NOTE, INSTALL_GUIDE, QUESTIONS, USING, WORDS } from "@/lib/content";
import { SITE } from "@/lib/site";

describe("Questions", () => {
  test("answers everything in the open, speed first", () => {
    render(<Questions />);
    const region = screen.getByRole("region", { name: QUESTIONS.title });
    expect(region.id).toBe("faq");
    expect(region.querySelectorAll("details")).toHaveLength(0);
    expect(within(region).getAllByRole("heading", { level: 3 })[0].textContent).toBe(USING.speedTitle);
    expect(region.textContent).toContain(USING.paragraphs[0]);
    expect(region.textContent).toContain(USING.keysEnd);
    for (const item of QUESTIONS.items) expect(within(region).getByRole("heading", { name: item.q, level: 3 })).toBeDefined();
    const models = within(region).getByRole("table", { name: WORDS.modelsTitle });
    expect(models.querySelectorAll("tr")).toHaveLength(WORDS.models.length);
    for (const m of WORDS.models) expect(models.textContent).toContain(m.size);
    for (const r of INSTALL_GUIDE.requirements) {
      expect(within(region).getByText(r.title)).toBeDefined();
      expect(within(region).getByText(r.detail)).toBeDefined();
    }
    expect(within(region).getByText(INSTALL_GUIDE.checksumCommand).closest("pre")).not.toBeNull();
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
