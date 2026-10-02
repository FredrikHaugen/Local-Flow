import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { DesktopDemo } from "@/components/DesktopDemo";
import { DEMO } from "@/lib/site";

describe("DesktopDemo", () => {
  test("shows what you said, with the fillers struck, and what was pasted", () => {
    const { container } = render(<DesktopDemo />);
    expect(screen.getByText(DEMO.heardLabel)).toBeDefined();
    expect(screen.getByText(DEMO.typedLabel)).toBeDefined();
    expect(container.querySelector("[data-demo='raw']")?.textContent).toBe(DEMO.raw);
    const struck = [...container.querySelectorAll("[data-demo='raw'] s")].map((s) => s.textContent);
    expect(struck).toEqual([...DEMO.fillers]);
    expect(container.querySelector("[data-demo='cleaned']")?.textContent).toBe(DEMO.cleaned);
  });

  test("pasted text wears the selection color; the overlay is decorative", () => {
    const { container } = render(<DesktopDemo />);
    expect(container.querySelector("[data-demo='cleaned']")?.classList.contains("selected")).toBe(true);
    expect(container.querySelector(".wave-bar")?.closest("[aria-hidden='true']")).not.toBeNull();
  });

  test("no promise checklist under the demo", () => {
    const { container } = render(<DesktopDemo />);
    expect(container.querySelectorAll("ul")).toHaveLength(0);
  });
});
