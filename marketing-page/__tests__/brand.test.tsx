import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Wordmark } from "@/components/Wordmark";
import { SITE } from "@/lib/site";

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
    expect(container.querySelector("circle")?.getAttribute("class")).toContain("fill-rec");
  });
});
