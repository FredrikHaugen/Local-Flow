import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// The repo's CHANGELOG.md, read at build time. Format: "## <version> (<status>)", then "### YYYY-MM-DD",
// then "- <item>" lines. Anything else (the title, the intro) is ignored.
export type ChangeDay = { date: string; items: string[] };
export type Release = { version: string; status: string; days: ChangeDay[] };

export function parseChangelog(md: string): Release[] {
  const releases: Release[] = [];
  for (const line of md.split("\n")) {
    const version = line.match(/^## (\S+) \(([^)]+)\)\s*$/);
    if (version) {
      releases.push({ version: version[1], status: version[2], days: [] });
      continue;
    }
    const day = line.match(/^### (\d{4}-\d{2}-\d{2})\s*$/);
    if (day) {
      const release = releases.at(-1);
      if (!release) throw new Error(`CHANGELOG.md: ${day[1]} comes before any version`);
      release.days.push({ date: day[1], items: [] });
      continue;
    }
    const item = line.match(/^- (.+)$/);
    if (item) {
      const current = releases.at(-1)?.days.at(-1);
      if (!current) throw new Error(`CHANGELOG.md: "${item[1]}" comes before any date`);
      current.items.push(item[1]);
    }
  }
  return releases;
}

export const CHANGELOG = parseChangelog(readFileSync(resolve(process.cwd(), "../CHANGELOG.md"), "utf8"));
