import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Anywhere } from "@/components/Anywhere";
import { Hero } from "@/components/Hero";
import { Requirements } from "@/components/Requirements";
import { ANYWHERE, HERO_REQUIREMENT, INSTALL, PHONE } from "@/lib/site";

describe("Phone handoff", () => {
  test("the hero offers to send the page to a Mac, after the requirement", () => {
    render(<Hero />);
    const send = screen.getByRole("button", { name: new RegExp(PHONE.handoff) });
    const cta = screen.getByRole("link", { name: "Download for Mac" }).closest("[data-cta]")!;
    const text = cta.textContent!;
    expect(text.indexOf(HERO_REQUIREMENT)).toBeLessThan(text.indexOf(PHONE.handoff));
    expect(send.closest("[data-cta]")).toBe(cta);
  });
});

describe("Swipe rails", () => {
  test("the app examples and install steps stay keyboard-reachable lists", () => {
    render(
      <>
        <Anywhere />
        <Requirements />
      </>,
    );
    for (const [label, count] of [
      [ANYWHERE.railLabel, ANYWHERE.apps.length],
      [INSTALL.railLabel, INSTALL.steps.length],
    ] as const) {
      const rail = screen.getByRole("list", { name: label });
      expect(rail.getAttribute("tabindex")).toBe("0");
      expect(rail.children).toHaveLength(count);
    }
  });
});
