import { ESSR_SOURCE, NO_SOURCED_RECOMMENDATION, SAFETY_NOTICE } from "@/data/essrGuidance";
import { FIELD_LABELS, optionLabel } from "@/data/inputOptions";
import { formatDisplayDate } from "@/lib/dates";
import type { CaseInput, Citation, DatedBand, InputField, PlanResult, PlanSection } from "@/lib/types";

export const SECTION_TITLES: Record<PlanSection, string> = {
  intervals: "Follow-up intervals",
  local: "1. Local / loco-regional surveillance",
  distant: "2. Distant / metastatic surveillance",
  mri_protocol: "3. MRI protocol considerations",
  exceptions: "4. Exceptions and evidence limitations",
};

export const SECTION_ORDER: readonly PlanSection[] = [
  "intervals",
  "local",
  "distant",
  "mri_protocol",
  "exceptions",
];

export const CATEGORY_LABELS = {
  general: "General recommendation",
  entity_specific: "Subtype-specific modification",
  technical: "Technical consideration",
  limitation: "Evidence limitation",
  evidence_gap: "Evidence gap",
} as const;

export function formatCitation(citation: Citation): string {
  const parts = [`ESSR 2024 (${ESSR_SOURCE.shortCitation})`, `p. ${citation.page}`, citation.location];
  if (citation.footnote) parts.push(citation.footnote);
  return parts.join(", ");
}

export function formatBandDates(band: DatedBand): string {
  if (!band.startDate) return "Dates not calculated";
  const start = formatDisplayDate(band.startDate);
  return band.endDate ? `${start} – ${formatDisplayDate(band.endDate)}` : `From ${start}`;
}

/** Plain-text draft for MDT discussion; contains no patient identifiers because none are collected. */
export function planToPlainText(plan: PlanResult, input: CaseInput): string {
  const lines: string[] = [];
  lines.push(`${plan.headline.toUpperCase()}`);
  lines.push(`Draft generated ${formatDisplayDate(plan.generatedOn)} — for MDT discussion only.`);
  lines.push(SAFETY_NOTICE);
  lines.push("");
  lines.push("INPUTS");
  for (const [field, value] of Object.entries(input) as [InputField, string | undefined][]) {
    if (value === undefined || value === "") continue;
    const display = field.endsWith("Date") ? formatDisplayDate(value) : optionLabel(field, value);
    lines.push(`- ${FIELD_LABELS[field]}: ${display}`);
  }

  if (plan.message) lines.push("", plan.message);
  if (plan.noPathwayCitation) lines.push(`Source: ${formatCitation(plan.noPathwayCitation)}`);

  if (plan.reference) {
    lines.push("");
    lines.push(
      `Reference date: ${plan.reference.date ? formatDisplayDate(plan.reference.date) : "Not calculated"} (${plan.reference.basis})`,
    );
  }

  if (plan.missing.length > 0) {
    lines.push("", "MISSING, UNKNOWN OR INVALID INPUTS");
    for (const m of plan.missing) lines.push(`- ${m.label} (${m.kind}): ${m.reason}`);
  }

  if (plan.status === "plan") {
    for (const section of SECTION_ORDER) {
      const items = plan.sections[section];
      lines.push("", SECTION_TITLES[section].toUpperCase());
      if (items.length === 0) lines.push(`- ${NO_SOURCED_RECOMMENDATION}`);
      for (const item of items) {
        const { rule } = item;
        lines.push(`- ${rule.title} [${CATEGORY_LABELS[rule.category]}] (${rule.id})`);
        lines.push(`  "${rule.quote}"`);
        if (rule.modality) lines.push(`  Modality: ${rule.modality}`);
        if (rule.coverage) lines.push(`  Coverage: ${rule.coverage}`);
        if (rule.timing) lines.push(`  Timing: ${rule.timing}`);
        for (const band of item.bands) {
          const modality = band.modality ? ` — ${band.modality}` : "";
          const condition = band.condition ? ` (${band.condition})` : "";
          lines.push(`  • ${band.label}: ${band.intervalText}${modality}${condition} [${formatBandDates(band)}]`);
        }
        lines.push(`  Triggered by: ${item.triggeredBy.join("; ")}`);
        for (const note of item.notes) lines.push(`  Note: ${note}`);
        for (const caveat of rule.caveats) lines.push(`  Caveat: ${caveat}`);
        lines.push(`  Source: ${formatCitation(rule.citation)}`);
      }
    }

    if (plan.undetermined.length > 0) {
      lines.push("", "NOT ASSESSED — INPUT REQUIRED");
      for (const u of plan.undetermined) {
        const fields = u.missingFields.map((f) => FIELD_LABELS[f]).join(", ");
        lines.push(`- ${u.rule.title}: ${NO_SOURCED_RECOMMENDATION} Requires: ${fields}.`);
      }
    }
  }

  if (plan.mdtReviewRequired) lines.push("", "MDT review required for the items flagged above.");
  lines.push("", `Source: ${ESSR_SOURCE.title}. ${ESSR_SOURCE.journal}. DOI: ${ESSR_SOURCE.doi}.`);
  return lines.join("\n");
}
