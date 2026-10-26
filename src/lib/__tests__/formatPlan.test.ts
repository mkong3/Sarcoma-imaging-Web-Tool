import { describe, expect, it } from "vitest";
import { SAFETY_NOTICE } from "@/data/essrGuidance";
import { planToPlainText } from "@/lib/formatPlan";
import { buildPlan } from "@/lib/rulesEngine";
import type { CaseInput } from "@/lib/types";

describe("planToPlainText", () => {
  it("includes the safety notice, sections, citations and evidence limitation", () => {
    const input: CaseInput = {
      pathway: "sts",
      subtype: "myxoid_liposarcoma",
      gradeCategory: "unknown",
      site: "limb",
      recurrence: "no",
      resectionDate: "2025-01-10",
      adjuvantTherapy: "no",
      mriContraindication: "no",
      metalwork: "no",
      contrastContraindication: "no",
    };
    const text = planToPlainText(buildPlan(input, "2026-10-25"), input);
    expect(text).toContain(SAFETY_NOTICE);
    expect(text).toContain("1. LOCAL / LOCO-REGIONAL SURVEILLANCE");
    expect(text).toContain("4. EXCEPTIONS AND EVIDENCE LIMITATIONS");
    expect(text).toContain("p. 3329, Table 2, section 2.4.1");
    expect(text).toContain("no evidence-based recommendations");
    expect(text).toContain("NOT ASSESSED — INPUT REQUIRED");
    expect(text).toContain("MDT review required");
  });

  it("states the no-pathway result for bone tumours", () => {
    const input: CaseInput = { pathway: "bone_or_other" };
    const text = planToPlainText(buildPlan(input, "2026-10-25"), input);
    expect(text).toContain("NO SOURCED PATHWAY AVAILABLE IN THIS PROTOTYPE.");
    expect(text).not.toContain("LOCAL / LOCO-REGIONAL");
  });
});
