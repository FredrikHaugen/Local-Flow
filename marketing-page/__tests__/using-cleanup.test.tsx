import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Cleanup } from "@/components/Cleanup";
import { CLEANUP_LEVELS } from "@/lib/content";

describe("Cleanup levels", () => {
  test("all four levels are shown at once, in order, with Light marked as the default", () => {
    render(<Cleanup />);
    const region = screen.getByRole("region", { name: CLEANUP_LEVELS.title });
    expect(region.id).toBe("cleanup");
    const list = within(region).getByRole("list", { name: CLEANUP_LEVELS.legend });
    const rows = within(list).getAllByRole("listitem").filter((li) => li.parentElement === list);
    expect(rows.map((r) => r.getAttribute("data-out"))).toEqual(["none", "light", "medium", "high"]);
    expect(within(rows[1]).getByText(CLEANUP_LEVELS.defaultNote)).toBeTruthy();
    expect(within(region).queryByRole("radio")).toBeNull();
  });

  test("the section does not repeat the hero's struck-through take", () => {
    const { container } = render(<Cleanup />);
    expect(container.querySelector("s")).toBeNull();
  });

  test("every level has an output", () => {
    const { container } = render(<Cleanup />);
    for (const level of CLEANUP_LEVELS.levels) expect(container.querySelector(`[data-out="${level.id}"]`)).not.toBeNull();
  });
});
