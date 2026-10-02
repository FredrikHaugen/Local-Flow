import type { Inline } from "@/lib/blocks";
import { SITE } from "@/lib/site";

export const CHANGELOG_PAGE = {
  lead: [
    "What changed in peluni, newest first, with the day each change was made. The same list is ",
    { text: "CHANGELOG.md on GitHub", href: `${SITE.repoUrl}/blob/main/CHANGELOG.md` },
    ".",
  ] as readonly Inline[],
  unreleased: "not released yet",
  formatDate(date: string): string {
    return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  },
};
