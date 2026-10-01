import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Privacy } from "@/components/Privacy";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Requirements } from "@/components/Requirements";
import { FAQ, FINAL_CTA, INSTALL, PIPELINE, PRIVACY_POINTS, REQUIREMENTS, SITE, VERIFY } from "@/lib/site";

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

describe("Verify", () => {
  test("offers three checks, including the checksum command and a link to the source", () => {
    render(<Privacy />);
    const verify = document.getElementById("verify")!;
    expect(within(verify).getByRole("heading", { level: 3, name: VERIFY.title })).toBeDefined();
    expect(within(verify).getAllByRole("heading", { level: 4 }).map((h) => h.textContent)).toEqual(
      VERIFY.checks.map((c) => c.title),
    );
    expect(within(verify).getByText(/shasum -a 256 -c/)).toBeDefined();
    expect(within(verify).getByRole("link", { name: /Browse the source/ }).getAttribute("href")).toBe(SITE.repoUrl);
  });
});

describe("Requirements", () => {
  test("draws the three install steps and lists every requirement", () => {
    render(<Requirements />);
    const region = screen.getByRole("region", { name: INSTALL.title });
    expect(region.id).toBe("requirements");
    for (const step of INSTALL.steps) expect(within(region).getByText(step.title)).toBeDefined();
    expect(within(region).getByRole("heading", { level: 3, name: "Requirements" })).toBeDefined();
    for (const req of REQUIREMENTS) {
      expect(within(region).getByText(req.title)).toBeDefined();
      expect(within(region).getByText(req.detail)).toBeDefined();
    }
  });
});

describe("FAQ", () => {
  test("answers every question in a native disclosure", () => {
    render(<Faq />);
    const region = screen.getByRole("region", { name: FAQ.title });
    expect(region.id).toBe("faq");
    expect(region.querySelectorAll("details")).toHaveLength(FAQ.items.length);
    for (const item of FAQ.items) expect(within(region).getByText(item.a)).toBeDefined();
  });

  test("never advertises autocomplete", () => {
    expect(JSON.stringify(FAQ).toLowerCase()).not.toContain("autocomplete");
  });
});

describe("Final call to action", () => {
  test("ends with a download link with the requirement right next to it", () => {
    render(<FinalCta />);
    const region = screen.getByRole("region", { name: FINAL_CTA.title });
    const download = within(region).getByRole("link", { name: "Download LocalFlow" });
    expect(download.getAttribute("href")).toBe(SITE.releasesUrl);
    expect(download.closest("[data-cta]")?.textContent).toContain("macOS 14+");
    expect(within(region).getByRole("link", { name: FINAL_CTA.secondary }).getAttribute("href")).toBe(SITE.repoUrl);
  });
});
