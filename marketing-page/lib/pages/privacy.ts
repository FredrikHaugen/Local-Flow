import type { PageCopy } from "@/lib/blocks";
import { ANALYTICS, SITE } from "@/lib/site";

// Sources: the app (no network code beyond Hugging Face downloads; NSLog records states and lengths;
// history in memory), components/AnalyticsConsent.tsx, and Microsoft's Clarity cookie list:
// https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-cookies
export const PRIVACY: PageCopy & { updated: string; updatedLabel: string } = {
  updated: "2026-10-03",
  updatedLabel: "Last updated",
  lead: [
    "This page covers the peluni app and this website, peluni.app. They work differently: the app sends nothing anywhere, and the website runs analytics only if you allow it.",
  ],
  sections: [
    {
      id: "who",
      heading: "Who is responsible",
      blocks: [
        {
          p: [
            "peluni is made by Fredrik Haugen, who is responsible for the data described here. Questions go to ",
            { text: "the issue tracker on GitHub", href: `${SITE.repoUrl}/issues` },
            ". Issues are public, so leave anything private out of them.",
          ],
        },
      ],
    },
    {
      id: "app",
      heading: "The app",
      blocks: [
        {
          list: [
            [
              "Audio is recorded into memory while you hold the key, transcribed and cleaned up on your Mac, then discarded. It is never written to disk or sent anywhere.",
            ],
            [
              "Transcripts are pasted into the app you're using. The last ten stay in memory for the Recent transcripts menu and are never written to disk.",
            ],
            [
              "Your vocabulary and settings stay on your Mac, in ~/Library/Application Support/peluni/ and peluni's preferences.",
            ],
            [
              "The app connects to the internet only to download a model from Hugging Face (huggingface.co), when you press Download. Hugging Face sees your IP address and which model you fetched, as with any download.",
            ],
            [
              "The app has no analytics, crash reporting, accounts or update checks. Its logs record states and lengths, never the words you dictated.",
            ],
          ],
        },
      ],
    },
    {
      id: "website",
      heading: "This website",
      blocks: [
        {
          p: [
            "peluni.app is a static site hosted on Vercel. To serve a page, Vercel processes your IP address and browser details under ",
            { text: "its privacy policy", href: "https://vercel.com/legal/privacy-policy" },
            ". The site loads no fonts, scripts or images from other servers, and sets no cookies, unless you allow analytics.",
          ],
        },
      ],
    },
    {
      id: "analytics",
      heading: "Analytics and cookies",
      blocks: [
        {
          p: [
            "On your first visit, a banner asks whether to allow Microsoft Clarity. Until you click Allow, nothing from Clarity loads. If you allow it, Clarity records how you use the page, including clicks, scrolling and a replay of the session, under a pseudonymous ID, and Microsoft processes that data under ",
            { text: "its privacy statement", href: "https://privacy.microsoft.com/privacystatement" },
            ". peluni tells Clarity not to use advertising storage.",
          ],
        },
        {
          table: {
            caption: "Cookies Clarity can set after you allow it",
            head: ["Cookie", "Set by", "What it's for"],
            rows: [
              ["_clck", "peluni.app", "Keeps your Clarity user ID and preferences for this site"],
              ["_clsk", "peluni.app", "Joins your page views into one session recording"],
              ["CLID", "Microsoft Clarity", "Records when Clarity first saw this browser on any site"],
              ["MUID", "Microsoft", "Identifies browsers across Microsoft sites"],
              [
                "ANONCHK, MR, SM",
                "Microsoft",
                "Support MUID. ANONCHK stays at 0 because Clarity doesn't use Microsoft's advertising ID",
              ],
            ],
          },
        },
        {
          p: [
            `Your answer to the banner is saved in your browser's local storage, not in a cookie. Change it any time with ${ANALYTICS.settings} at the bottom of every page.`,
          ],
        },
      ],
    },
    {
      id: "rights",
      heading: "Your rights",
      blocks: [
        {
          p: [
            `Clarity runs only with your consent, and you can withdraw it with ${ANALYTICS.settings}. You can ask what data is held about you and have it corrected or deleted. Clarity's data is held by Microsoft, whose privacy statement explains how to reach them. You can also complain to your local data protection authority.`,
          ],
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes to this page",
      blocks: [
        {
          p: [
            "When this page changes, the date below changes too, and ",
            {
              text: "every past version is on GitHub",
              href: `${SITE.repoUrl}/commits/main/marketing-page/lib/pages/privacy.ts`,
            },
            ".",
          ],
        },
      ],
    },
  ],
};
