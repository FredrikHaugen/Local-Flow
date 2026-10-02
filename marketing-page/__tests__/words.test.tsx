import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Words } from "@/components/Words";
import { WORDS } from "@/lib/content";

describe("Vocabulary", () => {
  test("shows what was heard and what landed, with every term", () => {
    render(<Words />);
    const region = screen.getByRole("region", { name: WORDS.title });
    expect(region.id).toBe("vocabulary");
    const moment = within(region).getByRole("figure", { name: WORDS.vocabTitle });
    expect(moment.textContent).toContain(WORDS.typed);
    expect(within(moment).getByRole("list", { name: WORDS.vocabTitle }).children).toHaveLength(WORDS.terms.length);
  });
});
