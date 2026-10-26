import { FIELD_LABELS } from "@/data/inputOptions";
import { parseIsoDate } from "@/lib/dates";
import type { CaseInput, InputField, MissingInput } from "@/lib/types";

const REASONS: Partial<Record<InputField, string>> = {
  pathway: "Needed to select a sourced pathway.",
  subtype: "Needed to check for subtype-specific modifications.",
  gradeCategory: "Needed to select the high-grade or low-grade follow-up intervals.",
  grade1: "Needed to assess whether patient-initiated follow-up may be considered after year 5.",
  site: "Needed for site-specific modality statements (CT at some sites, ultrasound in limbs).",
  margin: "Needed to assess whether patient-initiated follow-up may be considered after year 5.",
  resectionDate: "Needed to calculate the post-treatment reference date.",
  adjuvantTherapy: "Needed to calculate the post-treatment reference date (whichever comes later).",
  adjuvantCompletionDate: "Needed to calculate the post-treatment reference date (whichever comes later).",
  recurrence: "Needed because the surveillance algorithm restarts after recurrence.",
  restartReferenceDate: "Needed to calculate dates for the restarted surveillance algorithm.",
  desmoidSymptoms: "Needed to assess the watchful-waiting recommendation.",
  desmoidManagement: "Needed to assess the first re-evaluation timing for watchful waiting.",
  surveillanceStartDate: "Needed to calculate desmoid follow-up dates.",
  mriContraindication: "Needed to show modality alternatives named by the source.",
  metalwork: "Needed to show metal-artefact considerations.",
  contrastContraindication: "Needed to show contrast-related considerations.",
};

const PAST_DATE_FIELDS: readonly InputField[] = [
  "resectionDate",
  "adjuvantCompletionDate",
  "restartReferenceDate",
];

export function requiredFields(input: CaseInput): InputField[] {
  if (!input.pathway) return ["pathway"];
  if (input.pathway === "bone_or_other") return [];
  if (input.pathway === "desmoid") {
    return [
      "desmoidSymptoms",
      "desmoidManagement",
      "surveillanceStartDate",
      "mriContraindication",
      "contrastContraindication",
    ];
  }
  const fields: InputField[] = ["subtype", "gradeCategory"];
  if (input.gradeCategory === "low") fields.push("grade1");
  if (input.gradeCategory === "low" && input.grade1 === "yes") fields.push("margin");
  fields.push("site", "recurrence");
  if (input.recurrence === "yes") {
    fields.push("restartReferenceDate");
  } else {
    fields.push("resectionDate", "adjuvantTherapy");
    if (input.adjuvantTherapy === "yes") fields.push("adjuvantCompletionDate");
  }
  fields.push("mriContraindication", "metalwork", "contrastContraindication");
  return fields;
}

function isDateField(field: InputField): boolean {
  return field.endsWith("Date");
}

/** Lists required inputs that are unanswered, answered "Unknown", or invalid. Never fills defaults. */
export function findMissingInputs(input: CaseInput, today: string): MissingInput[] {
  const result: MissingInput[] = [];
  const todayDate = parseIsoDate(today);

  for (const field of requiredFields(input)) {
    const value = input[field];
    const base = { field, label: FIELD_LABELS[field], reason: REASONS[field] ?? "" };
    if (value === undefined || value === "") {
      result.push({ ...base, kind: "missing" });
      continue;
    }
    if (value === "unknown") {
      result.push({ ...base, kind: "unknown" });
      continue;
    }
    if (isDateField(field)) {
      const date = parseIsoDate(value);
      if (!date) {
        result.push({ ...base, kind: "invalid", reason: "Enter a valid date." });
      } else if (todayDate && PAST_DATE_FIELDS.includes(field) && date > todayDate) {
        result.push({ ...base, kind: "invalid", reason: "This date cannot be in the future." });
      }
    }
  }

  const resection = parseIsoDate(input.resectionDate);
  const adjuvant = parseIsoDate(input.adjuvantCompletionDate);
  if (
    input.pathway === "sts" &&
    input.recurrence !== "yes" &&
    input.adjuvantTherapy === "yes" &&
    resection &&
    adjuvant &&
    adjuvant < resection &&
    !result.some((m) => m.field === "adjuvantCompletionDate")
  ) {
    result.push({
      field: "adjuvantCompletionDate",
      label: FIELD_LABELS.adjuvantCompletionDate,
      reason: "Adjuvant completion date is before the resection date. Check both dates.",
      kind: "invalid",
    });
  }

  return result;
}
