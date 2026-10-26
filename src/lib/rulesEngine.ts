import {
  ALT_NO_PATHWAY,
  BONE_PATHWAY,
  ESSR_RULES,
  NO_SOURCED_PATHWAY,
} from "@/data/essrGuidance";
import { FIELD_LABELS, PATHWAY_OPTIONS, optionLabel } from "@/data/inputOptions";
import { bandDates, computeReferenceDate } from "@/lib/dates";
import { findMissingInputs } from "@/lib/validation";
import type {
  Applicability,
  CaseInput,
  ConstrainedField,
  EssrRule,
  InputField,
  PlanItem,
  PlanResult,
  PlanSection,
  ReferenceDate,
  UndeterminedRule,
} from "@/lib/types";

export const RULES: readonly EssrRule[] = ESSR_RULES;

export const PLAN_HEADLINE = "Suggested plan for clinician review";

type Evaluation =
  | { status: "applies"; matched: ConstrainedField[] }
  | { status: "not_applicable" }
  | { status: "undetermined"; missingFields: ConstrainedField[] };

/** A known non-matching value excludes the rule; otherwise unanswered/unknown values leave it undetermined. */
export function evaluateConstraints(
  constraints: Omit<Applicability, "pathway">,
  input: CaseInput,
): Evaluation {
  const matched: ConstrainedField[] = [];
  const missingFields: ConstrainedField[] = [];
  for (const key of Object.keys(constraints) as ConstrainedField[]) {
    const allowed = constraints[key] as readonly string[] | undefined;
    if (!allowed) continue;
    const value = input[key];
    if (value === undefined || value === "unknown") {
      missingFields.push(key);
    } else if (allowed.includes(value)) {
      matched.push(key);
    } else {
      return { status: "not_applicable" };
    }
  }
  return missingFields.length > 0 ? { status: "undetermined", missingFields } : { status: "applies", matched };
}

export function evaluateRule(rule: EssrRule, input: CaseInput): Evaluation {
  const { pathway, ...constraints } = rule.appliesTo;
  if (!input.pathway || input.pathway === "bone_or_other" || !pathway.includes(input.pathway)) {
    return { status: "not_applicable" };
  }
  return evaluateConstraints(constraints, input);
}

function emptySections(): Record<PlanSection, PlanItem[]> {
  return { intervals: [], local: [], distant: [], mri_protocol: [], exceptions: [] };
}

function pathwayLabel(input: CaseInput): string {
  return PATHWAY_OPTIONS.find((o) => o.value === input.pathway)?.label ?? "Not selected";
}

export function buildPlan(input: CaseInput, today: string): PlanResult {
  const missing = findMissingInputs(input, today);
  const base = {
    pathway: input.pathway ?? null,
    sections: emptySections(),
    undetermined: [] as UndeterminedRule[],
    missing,
    generatedOn: today,
  };

  if (!input.pathway) {
    return {
      ...base,
      status: "incomplete",
      headline: "Select a pathway",
      message: "A pathway is required before any sourced recommendation can be shown.",
      reference: null,
      mdtReviewRequired: true,
    };
  }

  if (input.pathway === "bone_or_other") {
    return {
      ...base,
      missing: [],
      status: "no_sourced_pathway",
      headline: BONE_PATHWAY.message,
      message: BONE_PATHWAY.detail,
      reference: null,
      mdtReviewRequired: true,
    };
  }

  if (input.pathway === "sts" && input.subtype === "well_differentiated_liposarcoma") {
    if (input.site === undefined || input.site === "unknown") {
      return {
        ...base,
        status: "incomplete",
        headline: "Anatomical site required",
        message:
          "For well-differentiated liposarcoma, the anatomical site determines whether this prototype has a sourced pathway.",
        reference: null,
        mdtReviewRequired: true,
      };
    }
    if (input.site !== "retroperitoneal") {
      return {
        ...base,
        missing: [],
        status: "no_sourced_pathway",
        headline: NO_SOURCED_PATHWAY,
        message: ALT_NO_PATHWAY.detail,
        noPathwayCitation: ALT_NO_PATHWAY.citation,
        reference: null,
        mdtReviewRequired: true,
      };
    }
  }

  const hasInvalidDate = missing.some((m) => m.kind === "invalid");
  const reference: ReferenceDate = hasInvalidDate
    ? { date: null, basis: "Correct the invalid date(s) to calculate dates", clinicianEntered: false }
    : computeReferenceDate(input);

  const sections = emptySections();
  const undetermined: UndeterminedRule[] = [];
  const applicable = new Set<string>();
  const evaluations = RULES.map((rule) => ({ rule, evaluation: evaluateRule(rule, input) }));
  for (const { rule, evaluation } of evaluations) {
    if (evaluation.status === "applies") applicable.add(rule.id);
  }

  let notesRequireMdt = false;
  for (const { rule, evaluation } of evaluations) {
    if (evaluation.status === "undetermined") {
      undetermined.push({ rule, missingFields: evaluation.missingFields as InputField[] });
      continue;
    }
    if (evaluation.status !== "applies") continue;

    const triggeredBy = [`${FIELD_LABELS.pathway}: ${pathwayLabel(input)}`];
    for (const field of evaluation.matched) {
      triggeredBy.push(`${FIELD_LABELS[field]}: ${optionLabel(field, input[field])}`);
    }
    if (rule.schedule) triggeredBy.push(`Reference date: ${reference.basis}`);

    const notes: string[] = [];
    for (const note of rule.conditionalNotes ?? []) {
      if (evaluateConstraints(note.when, input).status === "applies") {
        notes.push(note.text);
        if (note.requiresMdt) notesRequireMdt = true;
      }
    }

    const modifiers = (rule.modifiedBy ?? []).filter((id) => applicable.has(id));
    for (const id of modifiers) {
      const modifier = RULES.find((r) => r.id === id);
      if (modifier) notes.push(`Modified for this subtype — see "${modifier.title}" (${modifier.id}).`);
    }

    const bands = (rule.schedule?.bands ?? []).map((band) => ({
      ...band,
      ...bandDates(reference.date, band, today),
    }));

    sections[rule.section].push({ rule, triggeredBy, bands, notes, modifiedForCase: modifiers.length > 0 });
  }

  const hasEvidenceGap = Object.values(sections).some((items) =>
    items.some((item) => item.rule.category === "evidence_gap"),
  );

  return {
    ...base,
    status: "plan",
    headline: PLAN_HEADLINE,
    message:
      missing.length > 0
        ? "Some inputs are missing, unknown or invalid. Only the supported portion of the plan is shown."
        : undefined,
    reference,
    sections,
    undetermined,
    mdtReviewRequired:
      missing.length > 0 || undetermined.length > 0 || hasEvidenceGap || notesRequireMdt || reference.date === null,
  };
}
