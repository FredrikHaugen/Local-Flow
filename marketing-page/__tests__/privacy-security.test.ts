import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PRIVACY } from "@/lib/pages/privacy";
import { SECURITY } from "@/lib/pages/security";
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

  test("points vulnerability reports at GitHub's private reporting", () => {
    expect(json(SECURITY)).toContain("/security/advisories/new");
  });
});
