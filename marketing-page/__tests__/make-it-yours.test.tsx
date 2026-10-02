import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MakeItYours } from "@/components/MakeItYours";
import { CLEANUP, MODELS, NEVER_LOST, README_FACTS, VOCAB, YOURS } from "@/lib/site";

describe("MakeItYours", () => {
  test("is a region with one card per setting", () => {
    render(<MakeItYours />);
    const region = screen.getByRole("region", { name: YOURS.title });
    expect(region.id).toBe("yours");
    for (const title of [CLEANUP.title, VOCAB.title, MODELS.title, NEVER_LOST.title]) {
      expect(within(region).getByRole("heading", { level: 3, name: title })).toBeDefined();
    }
  });

  test("the cleanup picker is a real radio group with the app's four levels, Light checked", () => {
    render(<MakeItYours />);
    const group = screen.getByRole("group", { name: CLEANUP.legend });
    const radios = within(group).getAllByRole("radio");
    expect(radios.map((r) => (r as HTMLInputElement).value)).toEqual(["none", "light", "medium", "high"]);
    expect(within(group).getByRole("radio", { name: "Light" })).toHaveProperty("checked", true);
  });

  test("every cleanup level has an output", () => {
    const { container } = render(<MakeItYours />);
    for (const level of CLEANUP.levels) expect(container.querySelector(`[data-out="${level.id}"]`)).not.toBeNull();
  });

  test("model sizes agree with the README facts", () => {
    const sizes = MODELS.list.map((m) => m.size);
    for (const fact of ["78 MB", "148 MB", "1.6 GB"]) {
      expect(README_FACTS).toContain(fact);
      expect(sizes).toContain(fact);
    }
  });

  test("recent transcripts are truncated the way the menu does it", () => {
    render(<MakeItYours />);
    const menu = screen.getByRole("list", { name: NEVER_LOST.submenu });
    for (const item of within(menu).getAllByRole("listitem")) {
      expect(item.textContent!.length).toBeLessThanOrEqual(NEVER_LOST.truncateAt + 1);
    }
  });
});
