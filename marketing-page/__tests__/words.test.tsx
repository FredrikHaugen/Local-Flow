import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Words } from "@/components/Words";
import { WORDS } from "@/lib/content";

describe("Vocabulary and speech models", () => {
  test("shows what was heard and what landed, the terms, and every model with its size", () => {
    render(<Words />);
    const region = screen.getByRole("region", { name: WORDS.title });
    expect(region.id).toBe("vocabulary");
    const moment = within(region).getByRole("figure", { name: WORDS.vocabTitle });
    expect(moment.textContent).toContain(WORDS.typed);
    expect(within(moment).getByRole("list", { name: WORDS.vocabTitle }).children).toHaveLength(WORDS.terms.length);
    const models = within(region).getByRole("list", { name: WORDS.modelsTitle });
    expect(models.children).toHaveLength(WORDS.models.length);
    for (const m of WORDS.models) expect(models.textContent).toContain(m.size);
  });
});
