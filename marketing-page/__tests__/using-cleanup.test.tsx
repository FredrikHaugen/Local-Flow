import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Cleanup } from "@/components/Cleanup";
import { Using } from "@/components/Using";
import { CLEANUP_LEVELS, USING } from "@/lib/content";

describe("Using it", () => {
  test("is prose and a real table of keys", () => {
    render(<Using />);
    const region = screen.getByRole("region", { name: USING.title });
    expect(region.id).toBe("using");
    for (const p of USING.paragraphs) expect(within(region).getByText(p)).toBeDefined();
    const table = within(region).getByRole("table", { name: USING.caption });
    expect(within(table).getAllByRole("row")).toHaveLength(USING.keys.length + 1);
    expect(table.parentElement?.className).toContain("overflow-x-auto");
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
