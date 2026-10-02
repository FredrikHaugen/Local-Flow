import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Cleanup } from "@/components/Cleanup";
import { Using } from "@/components/Using";
import { CLEANUP_LEVELS, USING } from "@/lib/content";

describe("Using it", () => {
  test("is prose and the keys, drawn as keycaps", () => {
    const { container } = render(<Using />);
    const region = screen.getByRole("region", { name: USING.title });
    expect(region.id).toBe("using");
    for (const p of USING.paragraphs) expect(within(region).getByText(p)).toBeDefined();
    const keys = region.querySelector(`dl[aria-label="${USING.keysLabel}"]`)!;
    expect(keys.querySelectorAll("dt")).toHaveLength(USING.keys.length);
    expect(keys.querySelectorAll("dt kbd")).toHaveLength(USING.keys.length);
    for (const k of USING.keys) expect(within(region).getByText(k.result)).toBeDefined();
    expect(container.querySelector("table")).toBeNull();
  });
});

test("the desktop shot's overlay is decorative", () => {
  const { container } = render(<Using />);
  expect(container.querySelector(".wave-bar")?.closest("[aria-hidden='true']")).not.toBeNull();
});

test("the menu bar menu truncates recent transcripts the way the app does", () => {
  render(<Using />);
  const menu = screen.getByRole("list", { name: USING.menu.recentTitle });
  const items = within(menu).getAllByRole("listitem");
  expect(items).toHaveLength(USING.menu.recent.length);
  for (const item of items) expect(item.textContent!.length).toBeLessThanOrEqual(USING.menu.truncateAt + 1);
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
