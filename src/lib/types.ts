export type Pathway = "sts" | "desmoid" | "bone_or_other";
export type Answer = "yes" | "no" | "unknown";

export type StsSubtype =
  | "sts_general"
  | "myxoid_liposarcoma"
  | "well_differentiated_liposarcoma"
  | "dedifferentiated_liposarcoma"
  | "alveolar_soft_part_sarcoma"
  | "angiosarcoma"
  | "epithelioid_sarcoma"
  | "clear_cell_sarcoma"
  | "rhabdomyosarcoma"
  | "leiomyosarcoma"
  | "undifferentiated_pleomorphic_sarcoma"
  | "unknown";

export type GradeCategory = "high" | "low" | "unknown";
export type Site =
  | "limb"
  | "trunk"
  | "mediastinal"
  | "retroperitoneal"
  | "visceral"
  | "other"
  | "unknown";
export type Margin = "R0" | "R1" | "R2" | "unknown";
export type DesmoidSymptoms = "asymptomatic" | "symptomatic" | "unknown";
export type DesmoidManagement = "watchful_waiting" | "other" | "unknown";

/** Every field is optional: undefined means "not answered", never a default. */
export interface CaseInput {
  pathway?: Pathway;
  subtype?: StsSubtype;
  gradeCategory?: GradeCategory;
  grade1?: Answer;
  site?: Site;
  margin?: Margin;
  resectionDate?: string;
  adjuvantTherapy?: Answer;
  adjuvantCompletionDate?: string;
  recurrence?: Answer;
  restartReferenceDate?: string;
  desmoidSymptoms?: DesmoidSymptoms;
  desmoidManagement?: DesmoidManagement;
  surveillanceStartDate?: string;
  mriContraindication?: Answer;
  metalwork?: Answer;
  contrastContraindication?: Answer;
}

export type InputField = keyof CaseInput;

export type PlanSection =
  | "intervals"
  | "local"
  | "distant"
  | "mri_protocol"
  | "exceptions";

export type RuleCategory =
  | "general"
  | "entity_specific"
  | "technical"
  | "limitation"
  | "evidence_gap";

export interface Citation {
  page: string;
  location: string;
  footnote?: string;
}

export interface Offset {
  months?: number;
  weeks?: number;
}

export interface ScheduleBand {
  label: string;
  start: Offset;
  /** null = open-ended (no end stated in the source). */
  end: Offset | null;
  intervalText: string;
  modality?: string;
  condition?: string;
}

export type ScheduleAnchor = "post_treatment" | "surveillance_start";

export interface Schedule {
  anchor: ScheduleAnchor;
  bands: readonly ScheduleBand[];
}

/** Constraint values a field must take for a rule to apply. */
export interface Applicability {
  pathway: readonly ("sts" | "desmoid")[];
  subtype?: readonly StsSubtype[];
  gradeCategory?: readonly GradeCategory[];
  grade1?: readonly Answer[];
  site?: readonly Site[];
  margin?: readonly Margin[];
  recurrence?: readonly Answer[];
  metalwork?: readonly Answer[];
  mriContraindication?: readonly Answer[];
  contrastContraindication?: readonly Answer[];
  desmoidSymptoms?: readonly DesmoidSymptoms[];
  desmoidManagement?: readonly DesmoidManagement[];
}

export type ConstrainedField = Exclude<keyof Applicability, "pathway">;

export interface ConditionalNote {
  when: Omit<Applicability, "pathway">;
  text: string;
  requiresMdt?: boolean;
}

export interface EssrRule {
  id: string;
  sourceId: string;
  section: PlanSection;
  category: RuleCategory;
  title: string;
  /** Verbatim wording from the source. */
  quote: string;
  modality?: string;
  coverage?: string;
  timing?: string;
  schedule?: Schedule;
  citation: Citation;
  caveats: readonly string[];
  appliesTo: Applicability;
  conditionalNotes?: readonly ConditionalNote[];
  /** IDs of entity-specific rules that modify this general rule for some subtypes. */
  modifiedBy?: readonly string[];
}

export interface DatedBand extends ScheduleBand {
  startDate: string | null;
  endDate: string | null;
  status: "past" | "current" | "future" | null;
}

export interface PlanItem {
  rule: EssrRule;
  triggeredBy: string[];
  bands: DatedBand[];
  notes: string[];
  /** True when an entity-specific rule for this case modifies this general rule. */
  modifiedForCase: boolean;
}

export interface UndeterminedRule {
  rule: EssrRule;
  missingFields: InputField[];
}

export interface MissingInput {
  field: InputField;
  label: string;
  reason: string;
  kind: "missing" | "unknown" | "invalid";
}

export interface ReferenceDate {
  date: string | null;
  basis: string;
  clinicianEntered: boolean;
}

export type PlanStatus = "plan" | "no_sourced_pathway" | "incomplete";

export interface PlanResult {
  status: PlanStatus;
  pathway: Pathway | null;
  headline: string;
  message?: string;
  noPathwayCitation?: Citation;
  reference: ReferenceDate | null;
  sections: Record<PlanSection, PlanItem[]>;
  undetermined: UndeterminedRule[];
  missing: MissingInput[];
  mdtReviewRequired: boolean;
  generatedOn: string;
}
