import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { HELP, QUOTED_MESSAGES } from "@/lib/pages/help";
import { README_FACTS } from "@/lib/site";

function swiftFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? swiftFiles(path) : name.endsWith(".swift") ? [path] : [];
  });
}
const appSource = swiftFiles(resolve(process.cwd(), "../Sources"))
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");
const messages = HELP.sections.find((s) => s.id === "messages")!;
const table = messages.blocks.find((b) => "table" in b);

describe("help facts", () => {
  test("quoted app messages exist in the source", () => {
    expect(QUOTED_MESSAGES.length).toBeGreaterThanOrEqual(4);
    for (const message of QUOTED_MESSAGES) expect(appSource, message).toContain(message);
  });

  test("every quoted message has a row in the messages table", () => {
    if (!table || !("table" in table)) throw new Error("no messages table");
    const firstColumn = table.table.rows.map((r) => r[0]);
    for (const message of QUOTED_MESSAGES) expect(firstColumn).toContain(message);
  });

  test("the install section states the README's requirements", () => {
    const text = JSON.stringify(HELP.sections.find((s) => s.id === "install"));
    for (const fact of README_FACTS.slice(0, 3)) expect(text).toContain(fact);
  });

  test("the disk margin for downloads is the code's", () => {
    expect(readFileSync(resolve(process.cwd(), "../Sources/PeluniApp/Services/ModelManager.swift"), "utf8")).toContain(
      "model.sizeBytes + 200_000_000",
    );
    expect(JSON.stringify(HELP)).toContain("200 MB");
  });
});
