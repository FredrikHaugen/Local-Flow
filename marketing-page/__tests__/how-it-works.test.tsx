import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { HowItWorks } from "@/components/HowItWorks";
import { Anywhere } from "@/components/Anywhere";
import { Speed } from "@/components/Speed";
import { ANYWHERE, CONTROLS, SPEED, STEPS } from "@/lib/site";

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

  test("lists every keyboard control with its keys", () => {
    const { container } = render(<HowItWorks />);
    expect(screen.getByRole("heading", { level: 3, name: "Keyboard controls" })).toBeDefined();
    const rows = [...container.querySelectorAll("[data-control]")];
    expect(rows.map((r) => r.querySelector("dt")?.textContent)).toEqual(CONTROLS.map((c) => c.action));
    CONTROLS.forEach((control, i) => expect(rows[i].querySelector("dd")?.textContent).toBe(control.keys));
  });
});

describe("Speed", () => {
  test("is a region with the sourced headline and the to-scale caption", () => {
    render(<Speed />);
    const region = screen.getByRole("region", { name: SPEED.title });
    expect(region.id).toBe("speed");
    expect(within(region).getByText(SPEED.scaleNote)).toBeDefined();
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
