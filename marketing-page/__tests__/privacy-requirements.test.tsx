import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Privacy } from "@/components/Privacy";
import { Requirements } from "@/components/Requirements";
import { PRIVACY_POINTS, REQUIREMENTS, SITE } from "@/lib/site";

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
    expect(within(region).getByRole("link", { name: "Download LocalFlow" }).getAttribute("href")).toBe(
      SITE.releasesUrl,
    );
  });
});
