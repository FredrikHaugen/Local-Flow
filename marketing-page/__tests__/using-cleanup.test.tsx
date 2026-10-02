import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Cleanup } from "@/components/Cleanup";
import { DesktopScene } from "@/components/DesktopScene";
import { Using } from "@/components/Using";
import { CLEANUP_LEVELS, USING } from "@/lib/content";

describe("Using it", () => {
  test("is one line and a key legend", () => {
    render(<Using />);
    const region = screen.getByRole("region", { name: USING.title });
    expect(region.id).toBe("using");
    for (const p of USING.paragraphs) expect(within(region).getByText(p)).toBeDefined();
    const legend = region.querySelector(`dl[aria-label="${USING.keysLabel}"]`)!;
    expect(legend.querySelectorAll("dt kbd")).toHaveLength(USING.keys.length);
    expect(within(region).getByText(USING.keysEnd)).toBeDefined();
  });
});

describe("DesktopScene", () => {
  test("its overlay is decorative", () => {
    const { container } = render(<DesktopScene />);
    expect(container.querySelector(".wave-bar")?.closest("[aria-hidden='true']")).not.toBeNull();
  });

  test("the menu bar menu truncates recent transcripts the way the app does", () => {
    render(<DesktopScene />);
    const menu = screen.getByRole("list", { name: USING.menu.recentTitle });
    const items = within(menu).getAllByRole("listitem");
    expect(items).toHaveLength(USING.menu.recent.length);
    for (const item of items) expect(item.textContent!.length).toBeLessThanOrEqual(USING.menu.truncateAt + 1);
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
