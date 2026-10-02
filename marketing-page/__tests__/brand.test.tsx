import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Marked, Marker } from "@/components/Brand";
import { Footer } from "@/components/Footer";
import { Wordmark } from "@/components/Wordmark";
import { ANYWHERE, FINAL_CTA, HERO, HOW, PRIVACY, SITE, SPEED } from "@/lib/site";

describe("Marked headline", () => {
  test("every headline's typed phrase is part of its title", () => {
    const pairs: [string, string][] = [
      [SITE.tagline, HERO.emphasis],
      [ANYWHERE.title, ANYWHERE.mark],
      [HOW.title, HOW.mark],
      [SPEED.title, SPEED.mark],
      [PRIVACY.title, PRIVACY.mark],
      [FINAL_CTA.title, FINAL_CTA.mark],
    ];
    for (const [title, mark] of pairs) expect(title).toContain(mark);
  });

  test("keeps the full text readable and hides the cursor from screen readers", () => {
    render(
      <h2>
        <Marked text={PRIVACY.title} mark={PRIVACY.mark} />
      </h2>,
    );
    const heading = screen.getByRole("heading", { level: 2, name: PRIVACY.title });
    expect(heading.querySelector(".typed")?.textContent).toBe(PRIVACY.mark);
    expect(heading.querySelector(".typed-caret")?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Marker", () => {
  test("shows its label with the decorative capsule hidden", () => {
    const { container } = render(<Marker label="Privacy" />);
    expect(screen.getByText("Privacy")).toBeDefined();
    expect(container.querySelector(".wave-bar")?.closest("[aria-hidden='true']")).not.toBeNull();
  });
});

describe("Footer", () => {
  test("has no ghosted giant wordmark", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("[data-word]")).toBeNull();
  });
});

describe("Wordmark", () => {
  test("is the logomark plus the name, with the mark hidden from screen readers", () => {
    const { container } = render(<Wordmark />);
    expect(container.textContent).toBe(SITE.name);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 112 112");
  });

  test("Logomark uses theme tokens, so dark mode gets the dark variant", () => {
    const { container } = render(<Wordmark />);
    expect(container.querySelector("rect")?.getAttribute("class")).toContain("fill-logo-tile");
    expect(container.querySelector("path")?.getAttribute("class")).toContain("stroke-logo-stroke");
    expect(container.querySelector("circle")?.getAttribute("class")).toContain("fill-accent");
  });
});
