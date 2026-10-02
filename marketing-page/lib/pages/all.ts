// Every page's copy module, so the copy-style and page tests check all of it. Each page adds a line.
import { FEATURES } from "@/lib/pages/features";
import { HOW_IT_WORKS } from "@/lib/pages/how-it-works";

export const ALL_PAGE_COPY: Record<string, unknown> = {
  features: FEATURES,
  "how-it-works": HOW_IT_WORKS,
};
