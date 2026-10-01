import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Anywhere } from "@/components/Anywhere";
import { Hero } from "@/components/Hero";
import { Header } from "@/components/Header";
import { Requirements } from "@/components/Requirements";
import { ANYWHERE, HERO_REQUIREMENT, INSTALL, NAV, PHONE, SITE } from "@/lib/site";

describe("MobileMenu", () => {
  test("opens a sheet with every section link, Download and the requirement, and closes on a tap", () => {
    const { container } = render(<Header />);
    const toggle = screen.getByRole("button", { name: PHONE.menu });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector("#mobile-menu")).toBeNull();

    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: PHONE.close }).getAttribute("aria-expanded")).toBe("true");
    const sheet = container.querySelector<HTMLElement>("#mobile-menu")!;
    for (const item of NAV) {
      expect(within(sheet).getByRole("link", { name: item.label }).getAttribute("href")).toBe(item.href);
    }
    expect(within(sheet).getByRole("link", { name: /download/i }).getAttribute("href")).toBe(SITE.releasesUrl);
    expect(sheet.textContent).toContain(HERO_REQUIREMENT);

    fireEvent.click(within(sheet).getByRole("link", { name: NAV[0].label }));
    expect(container.querySelector("#mobile-menu")).toBeNull();
  });

  test("closes on Escape", () => {
    const { container } = render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: PHONE.menu }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(container.querySelector("#mobile-menu")).toBeNull();
  });
});

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
