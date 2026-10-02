import type { PageCopy } from "@/lib/blocks";
import { SITE } from "@/lib/site";

// Sources: Packaging/peluni.entitlements, scripts/sign-app.sh, scripts/verify-signing.sh,
// scripts/release.sh, TextInjector.swift (secure-field checks), AutocompleteController.swift,
// ModelCatalog.swift (download URL), and GitHub private vulnerability reporting (enabled).
export const SECURITY: PageCopy = {
  lead: [
    "peluni needs two permissions worth thinking about before you grant them: one lets it hear you, the other lets it type into other apps. This page says what it does with each, and how to report a problem.",
  ],
  sections: [
    {
      id: "permissions",
      heading: "What the permissions are for",
      blocks: [
        {
          table: {
            caption: "Permissions peluni asks for",
            head: ["Permission", "Why peluni asks", "What it does with it"],
            rows: [
              [
                "Microphone",
                "To hear you while you hold the key",
                "Records into memory only while you hold the key or hands-free dictation is on",
              ],
              [
                "Accessibility",
                "To notice Right ⌥ and Esc, and to paste into the app you're using",
                "Watches for its keys anywhere on your Mac, sends ⌘V (or types the text) into the focused app, and checks whether the focused field is a password field",
              ],
            ],
          },
        },
        {
          p: [
            "With the experimental Autocomplete switch on, peluni also reads up to 400 characters before your cursor to work on a suggestion, on your Mac, though it shows no suggestions yet. It's off unless you turn it on.",
          ],
        },
      ],
    },
    {
      id: "sandbox",
      heading: "Why peluni isn't sandboxed",
      blocks: [
        {
          p: [
            "The macOS sandbox would stop peluni from pasting into other apps, so it runs outside it. Its only entitlement is audio input. That makes the permissions above the real boundary, which is why ",
            { text: "the source is public", href: SITE.repoUrl },
            ": you can read exactly what it does with them.",
          ],
        },
      ],
    },
    {
      id: "secure-fields",
      heading: "Password fields",
      blocks: [
        {
          p: [
            "Before pasting, peluni asks macOS whether the focused element is a secure text field, and asks again just before the paste lands, in case focus moved. If it is, peluni pastes nothing and doesn't touch the clipboard. The experimental Autocomplete switch never reads a secure field either.",
          ],
        },
      ],
    },
    {
      id: "network",
      heading: "Network",
      blocks: [
        {
          p: [
            "The app connects to huggingface.co over HTTPS to download a model when you press Download, and to nothing else. It has no update checker: you update by downloading a new release.",
          ],
        },
        {
          p: [
            "To check this yourself, run nettop -m tcp -p $(pgrep -x peluni) in Terminal and dictate a few sentences. With the models downloaded, no connection appears.",
          ],
        },
      ],
    },
    {
      id: "signing",
      heading: "Signed builds",
      blocks: [
        {
          p: [
            "Release builds are signed with a Developer ID, run with the hardened runtime and are notarized by Apple. The release script stops if signing, notarization or Gatekeeper's own check fails, so a published build opens without a warning.",
          ],
        },
      ],
    },
    {
      id: "report",
      heading: "Reporting a vulnerability",
      blocks: [
        {
          p: [
            "Report it privately through ",
            { text: "GitHub's vulnerability reporting", href: `${SITE.repoUrl}/security/advisories/new` },
            ", not in a public issue. Reports go to Fredrik Haugen, who maintains peluni.",
          ],
        },
      ],
    },
  ],
};
