import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Marked, Marker } from "@/components/Brand";
import { Footer } from "@/components/Footer";
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
