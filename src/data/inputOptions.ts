import type {
  Answer,
  DesmoidManagement,
  DesmoidSymptoms,
  GradeCategory,
  InputField,
  Margin,
  Pathway,
  Site,
  StsSubtype,
} from "@/lib/types";

export interface Option<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

export const PATHWAY_OPTIONS: readonly Option<Pathway>[] = [
  { value: "sts", label: "Soft tissue sarcoma (adult)" },
  { value: "desmoid", label: "Desmoid-type fibromatosis", hint: "Not a sarcoma — separate pathway" },
  { value: "bone_or_other", label: "Bone sarcoma, other bone tumour, or other" },
];

export const SUBTYPE_OPTIONS: readonly Option<StsSubtype>[] = [
  { value: "sts_general", label: "Soft tissue sarcoma — other or not otherwise specified" },
  { value: "myxoid_liposarcoma", label: "Myxoid liposarcoma" },
  { value: "well_differentiated_liposarcoma", label: "Well-differentiated liposarcoma" },
  { value: "dedifferentiated_liposarcoma", label: "Dedifferentiated liposarcoma" },
  { value: "alveolar_soft_part_sarcoma", label: "Alveolar soft part sarcoma" },
  { value: "angiosarcoma", label: "Angiosarcoma" },
  { value: "epithelioid_sarcoma", label: "Epithelioid sarcoma" },
  { value: "clear_cell_sarcoma", label: "Clear cell sarcoma" },
  { value: "rhabdomyosarcoma", label: "Rhabdomyosarcoma" },
  { value: "leiomyosarcoma", label: "Leiomyosarcoma" },
  { value: "undifferentiated_pleomorphic_sarcoma", label: "Undifferentiated pleomorphic sarcoma" },
  { value: "unknown", label: "Unknown" },
];

export const GRADE_OPTIONS: readonly Option<GradeCategory>[] = [
  { value: "high", label: "High-grade" },
  { value: "low", label: "Low-grade" },
  { value: "unknown", label: "Unknown" },
];

export const ANSWER_OPTIONS: readonly Option<Answer>[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unknown", label: "Unknown" },
];

export const SITE_OPTIONS: readonly Option<Site>[] = [
  { value: "limb", label: "Limb" },
  { value: "trunk", label: "Trunk wall" },
  { value: "mediastinal", label: "Mediastinal" },
  { value: "retroperitoneal", label: "Retroperitoneal" },
  { value: "visceral", label: "Visceral" },
  { value: "other", label: "Other" },
  { value: "unknown", label: "Unknown" },
];

export const MARGIN_OPTIONS: readonly Option<Margin>[] = [
  { value: "R0", label: "R0 — microscopically margin-negative" },
  { value: "R1", label: "R1" },
  { value: "R2", label: "R2" },
  { value: "unknown", label: "Unknown" },
];

export const DESMOID_SYMPTOM_OPTIONS: readonly Option<DesmoidSymptoms>[] = [
  { value: "asymptomatic", label: "Asymptomatic" },
  { value: "symptomatic", label: "Symptomatic" },
  { value: "unknown", label: "Unknown" },
];

export const DESMOID_MANAGEMENT_OPTIONS: readonly Option<DesmoidManagement>[] = [
  { value: "watchful_waiting", label: "Watchful waiting" },
  { value: "other", label: "Other management" },
  { value: "unknown", label: "Unknown" },
];

export const FIELD_LABELS: Record<InputField, string> = {
  pathway: "Pathway",
  subtype: "Histological subtype",
  gradeCategory: "Grade (ESSR category)",
  grade1: "Grade 1",
  site: "Anatomical site",
  margin: "Initial resection margin",
  resectionDate: "Resection date",
  adjuvantTherapy: "Adjuvant therapy given",
  adjuvantCompletionDate: "Adjuvant therapy completion date",
  recurrence: "Recurrence since primary treatment",
  restartReferenceDate: "Restart reference date (clinician-entered)",
  desmoidSymptoms: "Symptom status",
  desmoidManagement: "Management approach",
  surveillanceStartDate: "Surveillance start date (clinician-entered)",
  mriContraindication: "MRI contraindication",
  metalwork: "Metalwork or artefact concern",
  contrastContraindication: "Contrast contraindication",
};

const ALL_OPTIONS: Partial<Record<InputField, readonly Option<string>[]>> = {
  pathway: PATHWAY_OPTIONS,
  subtype: SUBTYPE_OPTIONS,
  gradeCategory: GRADE_OPTIONS,
  grade1: ANSWER_OPTIONS,
  site: SITE_OPTIONS,
  margin: MARGIN_OPTIONS,
  adjuvantTherapy: ANSWER_OPTIONS,
  recurrence: ANSWER_OPTIONS,
  desmoidSymptoms: DESMOID_SYMPTOM_OPTIONS,
  desmoidManagement: DESMOID_MANAGEMENT_OPTIONS,
  mriContraindication: ANSWER_OPTIONS,
  metalwork: ANSWER_OPTIONS,
  contrastContraindication: ANSWER_OPTIONS,
};

export function optionLabel(field: InputField, value: string | undefined): string {
  if (value === undefined || value === "") return "Not answered";
  return ALL_OPTIONS[field]?.find((o) => o.value === value)?.label ?? value;
}
