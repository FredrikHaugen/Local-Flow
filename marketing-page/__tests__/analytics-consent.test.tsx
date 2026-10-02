import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { ANALYTICS } from "@/lib/site";

const clarityScripts = () => document.querySelectorAll('script[src*="clarity.ms"]');

beforeEach(() => {
  localStorage.clear();
  clarityScripts().forEach((s) => s.remove());
  delete window.clarity;
});

describe("AnalyticsConsent", () => {
  test("asks first and loads nothing before consent", async () => {
    render(<AnalyticsConsent />);
    expect(await screen.findByRole("dialog")).toBeDefined();
    expect(clarityScripts()).toHaveLength(0);
  });

  test("Allow loads Clarity once and remembers the choice", async () => {
    render(<AnalyticsConsent />);
    fireEvent.click(await screen.findByRole("button", { name: ANALYTICS.allow }));
    const scripts = clarityScripts();
    expect(scripts).toHaveLength(1);
    expect(scripts[0].getAttribute("src")).toBe(`https://www.clarity.ms/tag/${ANALYTICS.clarityId}`);
    expect(localStorage.getItem(ANALYTICS.storageKey)).toBe("granted");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("declining loads nothing and hides the banner", async () => {
    render(<AnalyticsConsent />);
    fireEvent.click(await screen.findByRole("button", { name: ANALYTICS.decline }));
    expect(clarityScripts()).toHaveLength(0);
    expect(localStorage.getItem(ANALYTICS.storageKey)).toBe("denied");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("a stored yes loads Clarity without asking again", () => {
    localStorage.setItem(ANALYTICS.storageKey, "granted");
    render(<AnalyticsConsent />);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(clarityScripts()).toHaveLength(1);
  });

  test("a stored no stays quiet", () => {
    localStorage.setItem(ANALYTICS.storageKey, "denied");
    render(<AnalyticsConsent />);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(clarityScripts()).toHaveLength(0);
  });
});
