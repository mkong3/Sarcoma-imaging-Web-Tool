import { describe, expect, it } from "vitest";
import { NO_SOURCED_PATHWAY } from "@/data/essrGuidance";
import { buildPlan } from "@/lib/rulesEngine";
import type { CaseInput, PlanResult } from "@/lib/types";

const TODAY = "2026-10-25";

const completeSts: CaseInput = {
  pathway: "sts",
  subtype: "sts_general",
  gradeCategory: "high",
  site: "limb",
  recurrence: "no",
  resectionDate: "2025-01-10",
  adjuvantTherapy: "yes",
  adjuvantCompletionDate: "2025-04-15",
  mriContraindication: "no",
  metalwork: "no",
  contrastContraindication: "no",
};

const ids = (plan: PlanResult) =>
  Object.values(plan.sections).flatMap((items) => items.map((i) => i.rule.id));
const item = (plan: PlanResult, id: string) =>
  Object.values(plan.sections)
    .flat()
    .find((i) => i.rule.id === id);

describe("high-grade soft tissue sarcoma", () => {
  const plan = buildPlan(completeSts, TODAY);

  it("applies the ESSR high-grade intervals and not the low-grade ones", () => {
    expect(plan.status).toBe("plan");
    expect(plan.missing).toEqual([]);
    expect(ids(plan)).toContain("STS-GEN-HIGH");
    expect(ids(plan)).not.toContain("STS-GEN-LOW");
    const high = item(plan, "STS-GEN-HIGH");
    expect(high?.bands.map((b) => [b.label, b.intervalText])).toEqual([
      ["Years 1–3", "Every 3–4 months"],
      ["Years 4–5", "Every 6 months"],
      ["Years 6–10", "Annually"],
    ]);
  });

  it("anchors dates to adjuvant completion when it is later than resection", () => {
    expect(plan.reference?.date).toBe("2025-04-15");
    const high = item(plan, "STS-GEN-HIGH");
    expect(high?.bands.map((b) => [b.startDate, b.endDate])).toEqual([
      ["2025-04-15", "2028-04-15"],
      ["2028-04-15", "2030-04-15"],
      ["2030-04-15", "2035-04-15"],
    ]);
    expect(item(plan, "STS-GEN-BASELINE")?.bands[0]?.startDate).toBe("2025-07-15");
  });

  it("does not offer patient-initiated follow-up for high-grade disease", () => {
    expect(ids(plan)).not.toContain("STS-GEN-PIFU");
  });

  it("includes MRI locally, chest CT for metastases, and limb ultrasound alternative", () => {
    expect(plan.sections.local.map((i) => i.rule.id)).toEqual(
      expect.arrayContaining(["STS-LOC-MRI", "STS-LOC-US-LIMB"]),
    );
    expect(plan.sections.distant.map((i) => i.rule.id)).toContain("STS-DIST-CHEST-CT");
    expect(ids(plan)).not.toContain("STS-LOC-CT-SITES");
  });

  it("always shows the evidence limitation", () => {
    expect(plan.sections.exceptions.map((i) => i.rule.id)).toContain("STS-LIM-EVIDENCE");
  });

  it("attaches a citation and source ID to every item", () => {
    for (const i of Object.values(plan.sections).flat()) {
      expect(i.rule.sourceId).toBeTruthy();
      expect(i.rule.citation.page).toBeTruthy();
      expect(i.triggeredBy.length).toBeGreaterThan(0);
    }
  });
});

describe("low-grade soft tissue sarcoma", () => {
  const low: CaseInput = { ...completeSts, gradeCategory: "low", grade1: "yes", margin: "R0" };
  const plan = buildPlan(low, TODAY);

  it("applies the ESSR low-grade intervals", () => {
    expect(ids(plan)).toContain("STS-GEN-LOW");
    expect(ids(plan)).not.toContain("STS-GEN-HIGH");
    expect(item(plan, "STS-GEN-LOW")?.bands.map((b) => [b.label, b.intervalText])).toEqual([
      ["Years 1–3", "Every 6 months"],
      ["Years 4–10", "Annually"],
    ]);
  });

  it("offers patient-initiated follow-up after year 5 only for grade 1 with R0", () => {
    expect(ids(plan)).toContain("STS-GEN-PIFU");
    expect(ids(buildPlan({ ...low, margin: "R1" }, TODAY))).not.toContain("STS-GEN-PIFU");
    expect(ids(buildPlan({ ...low, grade1: "no" }, TODAY))).not.toContain("STS-GEN-PIFU");
  });

  it("shows subcutaneous ultrasound consideration for low-grade disease", () => {
    expect(ids(plan)).toContain("STS-LOC-US-SUBCUT");
  });
});

describe("myxoid liposarcoma", () => {
  const plan = buildPlan({ ...completeSts, subtype: "myxoid_liposarcoma" }, TODAY);

  it("adds whole-body MRI, dedicated local MRI and the subtype chest schedule", () => {
    expect(plan.sections.distant.map((i) => i.rule.id)).toEqual(
      expect.arrayContaining(["MLS-DIST-WBMRI", "MLS-DIST-CHEST"]),
    );
    expect(plan.sections.local.map((i) => i.rule.id)).toContain("MLS-LOC-MRI");
    expect(item(plan, "MLS-DIST-CHEST")?.bands.map((b) => [b.label, b.intervalText, b.modality])).toEqual([
      ["Year 0–2", "Every 3 months", "Chest CT"],
      ["Thereafter, up to year 5", "Every 6 months", "Chest radiograph"],
    ]);
  });

  it("does not invent a whole-body MRI interval or contrast requirement", () => {
    const wb = item(plan, "MLS-DIST-WBMRI");
    expect(wb?.rule.timing).toBe("No sourced recommendation available.");
    expect(wb?.bands).toEqual([]);
    expect(item(plan, "MLS-TECH-WBMRI")?.rule.quote).toMatch(/coronal and axial STIR and a coronal T1w/);
    expect(wb?.rule.quote).not.toMatch(/contrast/i);
  });

  it("keeps the general schedule and marks general chest CT as modified", () => {
    expect(ids(plan)).toContain("STS-GEN-HIGH");
    expect(item(plan, "STS-DIST-CHEST-CT")?.modifiedForCase).toBe(true);
  });

  it("continues annual follow-up beyond 10 years", () => {
    expect(item(plan, "STS-MOD-LONGTERM")?.bands[0]?.label).toBe("Beyond year 10");
    expect(item(plan, "STS-GEN-ENDPOINT")?.modifiedForCase).toBe(true);
  });

  it("applies none of these modifications to other subtypes", () => {
    const general = buildPlan(completeSts, TODAY);
    for (const id of ["MLS-DIST-WBMRI", "MLS-DIST-CHEST", "MLS-LOC-MRI", "MLS-TECH-WBMRI", "STS-MOD-LONGTERM"]) {
      expect(ids(general)).not.toContain(id);
    }
    expect(item(general, "STS-DIST-CHEST-CT")?.modifiedForCase).toBe(false);
  });
});

describe("well-differentiated liposarcoma", () => {
  it("applies long-term follow-up and an evidence gap when retroperitoneal", () => {
    const plan = buildPlan(
      { ...completeSts, subtype: "well_differentiated_liposarcoma", site: "retroperitoneal" },
      TODAY,
    );
    expect(ids(plan)).toEqual(expect.arrayContaining(["STS-MOD-LONGTERM", "ENT-GAP-RP-LPS", "STS-LOC-CT-SITES"]));
  });

  it("returns no sourced pathway outside the retroperitoneum", () => {
    const plan = buildPlan({ ...completeSts, subtype: "well_differentiated_liposarcoma", site: "limb" }, TODAY);
    expect(plan.status).toBe("no_sourced_pathway");
    expect(plan.headline).toBe(NO_SOURCED_PATHWAY);
    expect(ids(plan)).toEqual([]);
  });
});

describe("desmoid-type fibromatosis", () => {
  const desmoid: CaseInput = {
    pathway: "desmoid",
    desmoidSymptoms: "asymptomatic",
    desmoidManagement: "watchful_waiting",
    surveillanceStartDate: "2026-01-05",
    mriContraindication: "no",
    contrastContraindication: "no",
  };
  const plan = buildPlan(desmoid, TODAY);

  it("uses only the separate desmoid pathway", () => {
    expect(plan.status).toBe("plan");
    expect(ids(plan).filter((id) => id.startsWith("STS-"))).toEqual([]);
    expect(ids(plan)).toEqual(expect.arrayContaining(["DTF-WW", "DTF-MRI", "DTF-FIRST", "DTF-SCHEDULE"]));
  });

  it("requires T2-weighted and contrast-enhanced MRI", () => {
    expect(item(plan, "DTF-MRI")?.rule.modality).toMatch(/T2-weighted and contrast-enhanced/);
  });

  it("schedules first re-evaluation within 8–12 weeks and the general scheme", () => {
    expect(item(plan, "DTF-FIRST")?.bands[0]).toMatchObject({
      startDate: "2026-03-02",
      endDate: "2026-03-30",
    });
    expect(item(plan, "DTF-SCHEDULE")?.bands.map((b) => [b.intervalText, b.condition])).toEqual([
      ["Every 3 months", undefined],
      ["Every 6 months", undefined],
      ["Yearly", "In case of stable disease"],
    ]);
  });

  it("flags an evidence gap for symptomatic patients", () => {
    const symptomatic = buildPlan({ ...desmoid, desmoidSymptoms: "symptomatic" }, TODAY);
    expect(ids(symptomatic)).toContain("DTF-GAP-SYMPTOMATIC");
    expect(ids(symptomatic)).not.toContain("DTF-WW");
    expect(symptomatic.mdtReviewRequired).toBe(true);
  });
});

describe("bone tumours", () => {
  it("returns no sourced pathway and no schedule", () => {
    const plan = buildPlan({ pathway: "bone_or_other" }, TODAY);
    expect(plan.status).toBe("no_sourced_pathway");
    expect(plan.headline).toBe("No sourced pathway available in this prototype.");
    expect(ids(plan)).toEqual([]);
    expect(plan.reference).toBeNull();
  });
});

describe("missing and unknown inputs", () => {
  it("does not default an unknown grade to either schedule", () => {
    const plan = buildPlan({ ...completeSts, gradeCategory: "unknown" }, TODAY);
    expect(ids(plan)).not.toContain("STS-GEN-HIGH");
    expect(ids(plan)).not.toContain("STS-GEN-LOW");
    expect(plan.undetermined.map((u) => u.rule.id)).toEqual(expect.arrayContaining(["STS-GEN-HIGH", "STS-GEN-LOW"]));
    expect(plan.missing).toContainEqual(expect.objectContaining({ field: "gradeCategory", kind: "unknown" }));
    expect(plan.mdtReviewRequired).toBe(true);
  });

  it("lists unanswered fields as missing and withholds dates", () => {
    const plan = buildPlan({ pathway: "sts", subtype: "sts_general", gradeCategory: "high" }, TODAY);
    const missingFields = plan.missing.map((m) => m.field);
    expect(missingFields).toEqual(
      expect.arrayContaining(["site", "recurrence", "mriContraindication", "metalwork", "contrastContraindication"]),
    );
    expect(plan.reference?.date).toBeNull();
    expect(item(plan, "STS-GEN-HIGH")?.bands.every((b) => b.startDate === null)).toBe(true);
  });

  it("leaves site-dependent statements undetermined when site is unknown", () => {
    const plan = buildPlan({ ...completeSts, site: "unknown" }, TODAY);
    expect(plan.undetermined.map((u) => u.rule.id)).toEqual(
      expect.arrayContaining(["STS-LOC-CT-SITES", "STS-LOC-US-LIMB"]),
    );
  });

  it("requires a pathway", () => {
    const plan = buildPlan({}, TODAY);
    expect(plan.status).toBe("incomplete");
    expect(plan.missing.map((m) => m.field)).toEqual(["pathway"]);
  });

  it("rejects future treatment dates", () => {
    const plan = buildPlan({ ...completeSts, resectionDate: "2027-01-01" }, TODAY);
    expect(plan.missing).toContainEqual(expect.objectContaining({ field: "resectionDate", kind: "invalid" }));
    expect(plan.reference?.date).toBeNull();
  });
});

describe("recurrence", () => {
  it("restarts the algorithm from the clinician-entered restart date", () => {
    const plan = buildPlan(
      { ...completeSts, recurrence: "yes", restartReferenceDate: "2026-06-01" },
      TODAY,
    );
    expect(plan.reference).toMatchObject({ date: "2026-06-01", clinicianEntered: true });
    expect(item(plan, "STS-GEN-BASELINE")?.bands[0]?.startDate).toBe("2026-09-01");
    expect(item(plan, "STS-GEN-HIGH")?.bands[0]?.startDate).toBe("2026-06-01");
    expect(item(plan, "STS-GEN-RECURRENCE")?.notes.join(" ")).toMatch(/restart reference date/);
  });

  it("gives no dated schedule when the restart date is missing", () => {
    const plan = buildPlan({ ...completeSts, recurrence: "yes" }, TODAY);
    expect(plan.reference?.date).toBeNull();
    expect(plan.missing.map((m) => m.field)).toContain("restartReferenceDate");
  });
});

describe("imaging constraints", () => {
  it("adds metal-artefact considerations only when metalwork is recorded", () => {
    const withMetal = buildPlan({ ...completeSts, metalwork: "yes" }, TODAY);
    expect(ids(withMetal)).toEqual(expect.arrayContaining(["STS-TECH-METAL-MRI", "STS-TECH-METAL-CT"]));
    expect(ids(buildPlan(completeSts, TODAY))).not.toContain("STS-TECH-METAL-MRI");
  });

  it("notes contrast contraindication without inventing an alternative", () => {
    const plan = buildPlan({ ...completeSts, contrastContraindication: "yes" }, TODAY);
    expect(item(plan, "STS-TECH-CONTRAST")?.notes.join(" ")).toMatch(/No sourced recommendation available/);
  });

  it("flags MDT review when MRI is contraindicated at a site without a sourced alternative", () => {
    const plan = buildPlan({ ...completeSts, site: "trunk", mriContraindication: "yes" }, TODAY);
    expect(item(plan, "STS-LOC-MRI")?.notes.join(" ")).toMatch(/refer to MDT/);
    expect(plan.mdtReviewRequired).toBe(true);
  });
});
