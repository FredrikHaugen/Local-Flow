import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { ANALYTICS } from "@/lib/site";

const clarityScripts = () => document.querySelectorAll('script[src*="clarity.ms"]');
const gaScripts = () => document.querySelectorAll('script[src*="googletagmanager.com"]');
// gtag() pushes its arguments object onto dataLayer; turn each into a plain array.
const gtagCalls = () => (window.dataLayer ?? []).map((args) => Array.from(args as ArrayLike<unknown>));

beforeEach(() => {
  localStorage.clear();
  clarityScripts().forEach((s) => s.remove());
  gaScripts().forEach((s) => s.remove());
  delete window.clarity;
  delete window.dataLayer;
  delete window.gtag;
  delete (window as unknown as Record<string, unknown>)[`ga-disable-${ANALYTICS.gaId}`];
  for (const name of ["_ga", `_ga_${ANALYTICS.gaId.slice(2)}`]) document.cookie = `${name}=; Max-Age=0; path=/`;
});

describe("AnalyticsConsent", () => {
  test("asks first and loads nothing before consent", async () => {
    render(<AnalyticsConsent />);
    expect(await screen.findByRole("dialog")).toBeDefined();
    expect(clarityScripts()).toHaveLength(0);
    expect(gaScripts()).toHaveLength(0);
    expect(window.dataLayer).toBeUndefined();
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

  test("Allow loads Google Analytics once, with advertising and Google signals off", async () => {
    render(<AnalyticsConsent />);
    fireEvent.click(await screen.findByRole("button", { name: ANALYTICS.allow }));
    const scripts = gaScripts();
    expect(scripts).toHaveLength(1);
    expect(scripts[0].getAttribute("src")).toBe(`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.gaId}`);
    const calls = gtagCalls();
    expect(calls[0]).toEqual([
      "consent",
      "default",
      { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" },
    ]);
    expect(calls).toContainEqual([
      "config",
      ANALYTICS.gaId,
      { allow_google_signals: false, allow_ad_personalization_signals: false },
    ]);
  });

  test("withdrawing consent switches Google Analytics off and deletes its cookies", async () => {
    localStorage.setItem(ANALYTICS.storageKey, "granted");
    document.cookie = "_ga=GA1.1.123.456; path=/";
    document.cookie = `_ga_${ANALYTICS.gaId.slice(2)}=GS1.1.789; path=/`;
    render(<AnalyticsConsent />);
    window.dispatchEvent(new Event("lf-analytics-settings"));
    fireEvent.click(await screen.findByRole("button", { name: ANALYTICS.decline }));
    expect((window as unknown as Record<string, unknown>)[`ga-disable-${ANALYTICS.gaId}`]).toBe(true);
    expect(gtagCalls()).toContainEqual(["consent", "update", { analytics_storage: "denied" }]);
    expect(document.cookie).not.toContain("_ga");
  });

  test("declining loads nothing and hides the banner", async () => {
    render(<AnalyticsConsent />);
    fireEvent.click(await screen.findByRole("button", { name: ANALYTICS.decline }));
    expect(clarityScripts()).toHaveLength(0);
    expect(gaScripts()).toHaveLength(0);
    expect(localStorage.getItem(ANALYTICS.storageKey)).toBe("denied");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("a stored yes loads Clarity without asking again", () => {
    localStorage.setItem(ANALYTICS.storageKey, "granted");
    render(<AnalyticsConsent />);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(clarityScripts()).toHaveLength(1);
    expect(gaScripts()).toHaveLength(1);
  });

  test("a stored no stays quiet", () => {
    localStorage.setItem(ANALYTICS.storageKey, "denied");
    render(<AnalyticsConsent />);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(clarityScripts()).toHaveLength(0);
    expect(gaScripts()).toHaveLength(0);
  });
});
