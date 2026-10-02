import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Cleanup } from "@/components/Cleanup";
import { DesktopScene } from "@/components/DesktopScene";
import { CLEANUP_LEVELS } from "@/lib/content";

describe("DesktopScene", () => {
  test("its overlay is decorative", () => {
    const { container } = render(<DesktopScene />);
    expect(container.querySelector(".wave-bar")?.closest("[aria-hidden='true']")).not.toBeNull();
  });

});

describe("Cleanup levels", () => {
  test("the picker is a real radio group, Light checked", () => {
    render(<Cleanup />);
    const region = screen.getByRole("region", { name: CLEANUP_LEVELS.title });
    expect(region.id).toBe("cleanup");
    const group = within(region).getByRole("group", { name: CLEANUP_LEVELS.legend });
    const radios = within(group).getAllByRole("radio");
    expect(radios.map((r) => (r as HTMLInputElement).value)).toEqual(["none", "light", "medium", "high"]);
    expect(within(group).getByRole("radio", { name: "Light" })).toHaveProperty("checked", true);
  });

  test("every level has an output", () => {
    const { container } = render(<Cleanup />);
    for (const level of CLEANUP_LEVELS.levels) expect(container.querySelector(`[data-out="${level.id}"]`)).not.toBeNull();
  });
});
