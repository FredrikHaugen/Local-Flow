import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Footer } from "@/components/Footer";
import { Audio } from "@/components/Audio";
import { Install } from "@/components/Install";
import { Intro } from "@/components/Intro";
import { AUDIO, FOOTER_NOTE, QUESTIONS, USING } from "@/lib/content";
import { SITE } from "@/lib/site";

describe("Answers in place", () => {
  test("speed and hands-free sit under the hero scene", () => {
    const { container } = render(<Intro />);
    expect(container.textContent).toContain(USING.paragraphs[0]);
    expect(container.textContent).toContain(QUESTIONS.items[0].a);
  });

  test("transcripts and password fields sit in the privacy band", () => {
    render(<Audio />);
    const region = screen.getByRole("region", { name: AUDIO.title });
    for (const item of QUESTIONS.items.slice(1)) expect(within(region).getByText(item.a)).toBeDefined();
  });

  test("the download points to the README and to issues", () => {
    render(<Install />);
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
