// Every page's copy module, so the copy-style and page tests check all of it. Each page adds a line.
import { CHANGELOG_PAGE } from "@/lib/pages/changelog";
import { FAQ } from "@/lib/pages/faq";
import { FEATURES } from "@/lib/pages/features";
import { HELP } from "@/lib/pages/help";
import { HOW_IT_WORKS } from "@/lib/pages/how-it-works";
import { PRIVACY } from "@/lib/pages/privacy";
import { SECURITY } from "@/lib/pages/security";

export const ALL_PAGE_COPY: Record<string, unknown> = {
  features: FEATURES,
  "how-it-works": HOW_IT_WORKS,
  help: HELP,
  faq: FAQ,
  privacy: PRIVACY,
  security: SECURITY,
  changelog: CHANGELOG_PAGE,
};
