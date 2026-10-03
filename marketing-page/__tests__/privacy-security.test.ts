import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PRIVACY } from "@/lib/pages/privacy";
import { SECURITY } from "@/lib/pages/security";
import { FOOTER_NOTE } from "@/lib/content";
import { ANALYTICS } from "@/lib/site";

const source = (path: string) => readFileSync(resolve(process.cwd(), "..", path), "utf8");
const json = (v: unknown) => JSON.stringify(v);

describe("privacy facts", () => {
  test("names every cookie Microsoft documents for Clarity", () => {
    for (const cookie of ["_clck", "_clsk", "CLID", "MUID", "ANONCHK", "MR", "SM"]) expect(json(PRIVACY)).toContain(cookie);
  });

  test("says the consent choice is kept in local storage, as the banner code does", () => {
    expect(source("marketing-page/components/AnalyticsConsent.tsx")).toContain("localStorage.setItem(ANALYTICS.storageKey");
    expect(ANALYTICS.storageKey).toBeTruthy();
    expect(json(PRIVACY)).toContain("local storage");
  });

  test("says advertising storage is refused, as the banner code does", () => {
    expect(source("marketing-page/components/AnalyticsConsent.tsx")).toContain('ad_Storage: "denied"');
    expect(json(PRIVACY)).toContain("advertising");
  });

  test("names the footer control that changes the choice", () => {
    expect(json(PRIVACY)).toContain(ANALYTICS.settings);
  });

  test("says how long Clarity keeps recordings, with Microsoft's page as the source", () => {
    expect(json(PRIVACY)).toContain("30 days");
    expect(json(PRIVACY)).toContain("learn.microsoft.com/en-us/clarity/setup-and-installation/data-retention");
  });

  test("names the cookies Google documents for Google Analytics 4", () => {
    // https://support.google.com/analytics/answer/11397207
    for (const cookie of ["_ga", `_ga_${ANALYTICS.gaId.slice(2)}`]) expect(json(PRIVACY)).toContain(cookie);
  });

  test("says Google signals and ad personalization are off, as the banner code does", () => {
    const code = source("marketing-page/components/AnalyticsConsent.tsx");
    expect(code).toContain("allow_google_signals: false");
    expect(code).toContain("allow_ad_personalization_signals: false");
    expect(json(PRIVACY)).toContain("Google signals");
  });

  test("links Google's privacy policy and names both tools in the rights section", () => {
    expect(json(PRIVACY)).toContain("policies.google.com/privacy");
    const rights = json(PRIVACY.sections.find((s) => s.id === "rights"));
    for (const tool of ["Clarity", "Google Analytics"]) expect(rights).toContain(tool);
  });

  test("says Google Analytics records scrolling and clicks on outbound links (enhanced measurement defaults)", () => {
    // https://support.google.com/analytics/answer/9216061: scroll and outbound click are on by default.
    expect(json(PRIVACY)).toContain("scroll to the bottom of a page");
    expect(json(PRIVACY)).toContain("links to other sites you click");
  });

  test("the banner and footer name both analytics tools", () => {
    for (const text of [ANALYTICS.banner, FOOTER_NOTE.site])
      for (const tool of ["Microsoft Clarity", "Google Analytics"]) expect(text).toContain(tool);
  });

  test("has an ISO date for its last update", () => {
    expect(PRIVACY.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("security facts", () => {
  test("the only release entitlement is audio input", () => {
    const entitlements = source("Packaging/peluni.entitlements");
    expect([...entitlements.matchAll(/<key>([^<]+)<\/key>/g)].map((m) => m[1])).toEqual([
      "com.apple.security.device.audio-input",
    ]);
    expect(json(SECURITY)).toContain("only entitlement");
  });

  test("the release script stops on a failed check", () => {
    const release = source("scripts/release.sh");
    expect(release).toContain("set -euo pipefail");
    expect(release).toContain("notarytool");
    expect(release).toContain("spctl");
  });

  test("gives a command to check the network claim yourself", () => {
    expect(json(SECURITY)).toContain("nettop -m tcp -p $(pgrep -x peluni)");
  });

  test("lists what stays on the Mac, with the app's real paths and preferences domain", () => {
    const stored = SECURITY.sections.find((sec) => sec.id === "stored");
    expect(stored, "a stored section").toBeDefined();
    const text = json(stored);
    const bundleId = source("Packaging/Info.plist").match(/CFBundleIdentifier<\/key><string>([^<]+)</)![1];
    expect(text).toContain(bundleId);
    const models = source("Sources/PeluniApp/Services/ModelManager.swift");
    for (const dir of ["Models/whisper", "Models/llm"]) {
      expect(models).toContain(`"${dir}"`);
      expect(text).toContain(`~/Library/Application Support/peluni/${dir}/`);
    }
    expect(text).toContain("vocabulary.json");
  });

  test("points vulnerability reports at GitHub's private reporting", () => {
    expect(json(SECURITY)).toContain("/security/advisories/new");
  });
});

describe("response headers", () => {
  const headers: { key: string; value: string }[] = JSON.parse(
    readFileSync(resolve(process.cwd(), "vercel.json"), "utf8"),
  ).headers.find((h: { source: string }) => h.source === "/(.*)").headers;
  const header = (key: string) => headers.find((h) => h.key === key)?.value;

  test("HSTS covers subdomains for two years", () => {
    expect(header("Strict-Transport-Security")).toBe("max-age=63072000; includeSubDomains");
  });
});
