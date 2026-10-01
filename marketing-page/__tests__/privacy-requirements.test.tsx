import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Privacy } from "@/components/Privacy";
import { Requirements } from "@/components/Requirements";
import { PIPELINE, PRIVACY_POINTS, REQUIREMENTS, SITE } from "@/lib/site";

describe("Privacy", () => {
  test("lists every guarantee", () => {
    render(<Privacy />);
    const region = screen.getByRole("region", { name: "Private by construction" });
    expect(region.id).toBe("privacy");
    for (const point of PRIVACY_POINTS) {
      expect(within(region).getByRole("heading", { level: 3, name: point.title })).toBeDefined();
      expect(within(region).getByText(point.body)).toBeDefined();
    }
  });

  test("draws the five pipeline stages inside the Your Mac boundary", () => {
    render(<Privacy />);
    const diagram = document.getElementById("under-the-hood")!;
    expect(within(diagram).getByRole("heading", { level: 3, name: "Under the hood" })).toBeDefined();
    expect(within(diagram).getAllByRole("heading", { level: 4 }).map((h) => h.textContent)).toEqual(
      PIPELINE.map((s) => s.name),
    );
  });
});

describe("Requirements", () => {
  test("lists every requirement and ends with a download link", () => {
    render(<Requirements />);
    const region = screen.getByRole("region", { name: "Requirements" });
    expect(region.id).toBe("requirements");
    for (const req of REQUIREMENTS) {
      expect(within(region).getByText(req.title)).toBeDefined();
      expect(within(region).getByText(req.detail)).toBeDefined();
    }
    const download = within(region).getByRole("link", { name: "Download LocalFlow" });
    expect(download.getAttribute("href")).toBe(SITE.releasesUrl);
    expect(download.closest("[data-cta]")?.textContent).toContain("macOS 14+");
  });
});
