import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { HowItWorks } from "@/components/HowItWorks";
import { Anywhere } from "@/components/Anywhere";
import { Pipeline } from "@/components/Pipeline";
import { ANYWHERE, CONTROLS, PIPELINE, STEPS } from "@/lib/site";

describe("HowItWorks", () => {
  test("lists the three steps in order", () => {
    render(<HowItWorks />);
    const region = screen.getByRole("region", { name: "How it works" });
    expect(region.id).toBe("how-it-works");
    const items = within(region).getAllByRole("listitem");
    expect(items.map((li) => within(li).getByRole("heading", { level: 3 }).textContent)).toEqual(
      STEPS.map((s) => s.title),
    );
  });

  test("has a controls table with every shortcut", () => {
    render(<HowItWorks />);
    const table = screen.getByRole("table", { name: "Keyboard controls" });
    for (const control of CONTROLS) {
      const row = within(table).getByRole("row", { name: new RegExp(control.action) });
      expect(row.textContent).toContain(control.keys);
    }
  });
});

describe("Pipeline", () => {
  test("shows all five stages in order", () => {
    render(<Pipeline />);
    const region = screen.getByRole("region", { name: "Under the hood" });
    expect(region.id).toBe("under-the-hood");
    expect(within(region).getAllByRole("heading", { level: 4 }).map((h) => h.textContent)).toEqual(
      PIPELINE.map((s) => s.name),
    );
  });
});

describe("Anywhere", () => {
  test("shows the dictation landing in every example app", () => {
    render(<Anywhere />);
    const region = screen.getByRole("region", { name: ANYWHERE.title });
    expect(region.id).toBe("anywhere");
    expect(within(region).getAllByRole("heading", { level: 3 })).toHaveLength(ANYWHERE.apps.length);
    // Read the text a screen reader gets: decorative (aria-hidden) labels removed.
    const spoken = region.cloneNode(true) as HTMLElement;
    for (const hidden of spoken.querySelectorAll("[aria-hidden='true']")) hidden.remove();
    for (const app of ANYWHERE.apps) {
      expect(within(region).getByRole("heading", { level: 3, name: app.caption })).toBeDefined();
      expect(spoken.textContent).toContain(app.body);
    }
  });
});
