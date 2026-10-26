import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ESSR_SOURCE } from "@/data/essrGuidance";
import { RULES } from "@/lib/rulesEngine";

const matrix = readFileSync(join(process.cwd(), "docs", "evidence-matrix.md"), "utf8");

describe("ESSR guidance data integrity", () => {
  it("has unique rule IDs", () => {
    const ids = RULES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(RULES.map((r) => [r.id, r] as const))("%s has a source ID, citation and quote", (_id, rule) => {
    expect(rule.sourceId).toBe(ESSR_SOURCE.id);
    expect(rule.citation.page).toMatch(/^33\d\d/);
    expect(rule.citation.location.length).toBeGreaterThan(0);
    expect(rule.quote.length).toBeGreaterThan(0);
  });

  it.each(RULES.map((r) => [r.id] as const))("%s is recorded in the evidence matrix", (id) => {
    expect(matrix).toContain(`| ${id} |`);
  });

  it("references only rule IDs that exist", () => {
    const ids = new Set(RULES.map((r) => r.id));
    for (const rule of RULES) {
      for (const id of rule.modifiedBy ?? []) expect(ids).toContain(id);
    }
  });
});
