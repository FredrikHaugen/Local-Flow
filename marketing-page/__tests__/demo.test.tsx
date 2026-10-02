import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { DesktopDemo } from "@/components/DesktopDemo";
import { DEMO } from "@/lib/site";

describe("DesktopDemo", () => {
  test("shows what you said, with the fillers marked, and what was pasted", () => {
    const { container } = render(<DesktopDemo />);
    expect(screen.getByText(DEMO.heardLabel)).toBeDefined();
    expect(screen.getByText(DEMO.typedLabel)).toBeDefined();
    expect(container.querySelector("[data-demo='raw']")?.textContent).toBe(DEMO.raw);
    const dropped = [...container.querySelectorAll("[data-demo='raw'] [data-filler]")].map((s) => s.textContent);
    expect(dropped).toEqual([...DEMO.fillers]);
    expect(container.querySelector("[data-demo='cleaned']")?.textContent).toBe(DEMO.cleaned);
  });

  test("the spoken take is ghosted behind the paragraph that landed", () => {
    const { container } = render(<DesktopDemo />);
    expect(container.querySelector("[data-demo='raw']")?.className).toContain("ghost-fade");
    expect(container.querySelector("[data-demo='cleaned']")?.classList.contains("selected")).toBe(false);
  });

  test("no promise checklist under the demo", () => {
    const { container } = render(<DesktopDemo />);
    expect(container.querySelectorAll("ul")).toHaveLength(0);
  });
});
