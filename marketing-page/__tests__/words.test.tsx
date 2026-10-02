import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Words } from "@/components/Words";
import { WORDS } from "@/lib/content";

describe("Vocabulary and speech models", () => {
  test("has a vocabulary example and a models table", () => {
    render(<Words />);
    const region = screen.getByRole("region", { name: WORDS.title });
    expect(region.id).toBe("vocabulary");
    expect(within(region).getByRole("heading", { level: 3, name: WORDS.vocabTitle })).toBeDefined();
    expect(within(region).getByRole("heading", { level: 3, name: WORDS.modelsTitle })).toBeDefined();
    for (const t of WORDS.terms) expect(within(region).getAllByText(t.term).length).toBeGreaterThan(0);
    const table = within(region).getByRole("table", { name: WORDS.modelsTitle });
    expect(within(table).getAllByRole("row")).toHaveLength(WORDS.models.length + 1);
    expect(table.parentElement?.className).toContain("overflow-x-auto");
  });
});
