import {
  ANSWER_OPTIONS,
  DESMOID_MANAGEMENT_OPTIONS,
  DESMOID_SYMPTOM_OPTIONS,
  FIELD_LABELS,
  GRADE_OPTIONS,
  MARGIN_OPTIONS,
  PATHWAY_OPTIONS,
  SITE_OPTIONS,
  SUBTYPE_OPTIONS,
  optionLabel,
} from "@/data/inputOptions";
import { formatDisplayDate } from "@/lib/dates";
import type { CaseInput, InputField, MissingInput } from "@/lib/types";
import { DateField, RadioField, SelectField } from "./fields";

export type UpdateInput = <K extends InputField>(field: K, value: CaseInput[K]) => void;

interface StepProps {
  input: CaseInput;
  update: UpdateInput;
  today: string;
  issues: MissingInput[];
}

function invalidMessage(issues: MissingInput[], field: InputField): string | undefined {
  return issues.find((i) => i.field === field && i.kind === "invalid")?.reason;
}

export function StepPathway({ input, update }: StepProps) {
  return (
    <RadioField
      name="pathway"
      legend={FIELD_LABELS.pathway}
      hint="Desmoid-type fibromatosis is not a sarcoma and uses a separate pathway."
      options={PATHWAY_OPTIONS}
      value={input.pathway}
      onChange={(v) => update("pathway", v)}
      columns={1}
    />
  );
}

export function StepStsTumour({ input, update }: StepProps) {
  return (
    <div className="space-y-6">
      <SelectField
        id="subtype"
        label={FIELD_LABELS.subtype}
        hint="Only entities named in the ESSR paper are listed. Choose “other or not otherwise specified” for any other soft tissue sarcoma."
        options={SUBTYPE_OPTIONS}
        value={input.subtype}
        onChange={(v) => update("subtype", v)}
      />
      <RadioField
        name="gradeCategory"
        legend={FIELD_LABELS.gradeCategory}
        hint="ESSR uses high-grade and low-grade categories. The paper does not map grade 2; record the category determined locally."
        options={GRADE_OPTIONS}
        value={input.gradeCategory}
        onChange={(v) => update("gradeCategory", v)}
      />
      {input.gradeCategory === "low" && (
        <RadioField
          name="grade1"
          legend="Is this a grade 1 sarcoma?"
          options={ANSWER_OPTIONS}
          value={input.grade1}
          onChange={(v) => update("grade1", v)}
        />
      )}
      {input.gradeCategory === "low" && input.grade1 === "yes" && (
        <RadioField
          name="margin"
          legend={FIELD_LABELS.margin}
          hint="Used only to assess the ESSR statement on patient-initiated follow-up for grade 1 sarcoma with initial R0 resection."
          options={MARGIN_OPTIONS}
          value={input.margin}
          onChange={(v) => update("margin", v)}
          columns={2}
        />
      )}
      <RadioField
        name="site"
        legend={FIELD_LABELS.site}
        options={SITE_OPTIONS}
        value={input.site}
        onChange={(v) => update("site", v)}
      />
    </div>
  );
}

export function StepStsDates({ input, update, today, issues }: StepProps) {
  return (
    <div className="space-y-6">
      <RadioField
        name="recurrence"
        legend={FIELD_LABELS.recurrence}
        hint="ESSR states that the surveillance algorithm should restart after recurrence."
        options={ANSWER_OPTIONS}
        value={input.recurrence}
        onChange={(v) => update("recurrence", v)}
      />
      {input.recurrence === "yes" ? (
        <DateField
          id="restartReferenceDate"
          label={FIELD_LABELS.restartReferenceDate}
          hint="The paper does not state the date from which surveillance restarts. Enter the date your team will count from; it will be labelled as clinician-entered."
          value={input.restartReferenceDate}
          max={today}
          error={invalidMessage(issues, "restartReferenceDate")}
          onChange={(v) => update("restartReferenceDate", v)}
        />
      ) : (
        <>
          <DateField
            id="resectionDate"
            label={FIELD_LABELS.resectionDate}
            value={input.resectionDate}
            max={today}
            error={invalidMessage(issues, "resectionDate")}
            onChange={(v) => update("resectionDate", v)}
          />
          <RadioField
            name="adjuvantTherapy"
            legend={FIELD_LABELS.adjuvantTherapy}
            hint="ESSR timing is counted from resection or adjuvant therapy, whichever comes later."
            options={ANSWER_OPTIONS}
            value={input.adjuvantTherapy}
            onChange={(v) => update("adjuvantTherapy", v)}
          />
          {input.adjuvantTherapy === "yes" && (
            <DateField
              id="adjuvantCompletionDate"
              label={FIELD_LABELS.adjuvantCompletionDate}
              value={input.adjuvantCompletionDate}
              max={today}
              error={invalidMessage(issues, "adjuvantCompletionDate")}
              onChange={(v) => update("adjuvantCompletionDate", v)}
            />
          )}
        </>
      )}
    </div>
  );
}

export function StepDesmoidDetails({ input, update }: StepProps) {
  return (
    <div className="space-y-6">
      <RadioField
        name="desmoidSymptoms"
        legend={FIELD_LABELS.desmoidSymptoms}
        options={DESMOID_SYMPTOM_OPTIONS}
        value={input.desmoidSymptoms}
        onChange={(v) => update("desmoidSymptoms", v)}
      />
      <RadioField
        name="desmoidManagement"
        legend={FIELD_LABELS.desmoidManagement}
        options={DESMOID_MANAGEMENT_OPTIONS}
        value={input.desmoidManagement}
        onChange={(v) => update("desmoidManagement", v)}
      />
    </div>
  );
}

export function StepDesmoidStart({ input, update, issues }: StepProps) {
  return (
    <DateField
      id="surveillanceStartDate"
      label={FIELD_LABELS.surveillanceStartDate}
      hint="The paper does not state the start point for the desmoid schedule. Enter the date your team will count from; it will be labelled as clinician-entered."
      value={input.surveillanceStartDate}
      error={invalidMessage(issues, "surveillanceStartDate")}
      onChange={(v) => update("surveillanceStartDate", v)}
    />
  );
}

export function StepImaging({ input, update }: StepProps) {
  return (
    <div className="space-y-6">
      <RadioField
        name="mriContraindication"
        legend={FIELD_LABELS.mriContraindication}
        options={ANSWER_OPTIONS}
        value={input.mriContraindication}
        onChange={(v) => update("mriContraindication", v)}
      />
      {input.pathway === "sts" && (
        <RadioField
          name="metalwork"
          legend={FIELD_LABELS.metalwork}
          hint="For example, metallic hardware at or near the surgical site."
          options={ANSWER_OPTIONS}
          value={input.metalwork}
          onChange={(v) => update("metalwork", v)}
        />
      )}
      <RadioField
        name="contrastContraindication"
        legend={FIELD_LABELS.contrastContraindication}
        options={ANSWER_OPTIONS}
        value={input.contrastContraindication}
        onChange={(v) => update("contrastContraindication", v)}
      />
    </div>
  );
}

export function StepReview({ input, issues }: StepProps) {
  const entries = (Object.entries(input) as [InputField, string | undefined][]).filter(
    ([, value]) => value !== undefined && value !== "",
  );
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Entered information</h3>
        <dl className="mt-2 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {entries.map(([field, value]) => (
            <div key={field} className="grid gap-1 px-4 py-2 text-sm sm:grid-cols-2">
              <dt className="text-slate-600">{FIELD_LABELS[field]}</dt>
              <dd className="font-medium text-slate-900">
                {field.endsWith("Date") ? formatDisplayDate(value ?? "") : optionLabel(field, value)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {issues.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <h3 className="font-semibold">Information missing, unknown or invalid</h3>
          <p className="mt-1">
            Nothing will be assumed. Only the parts of the plan the source supports with the information given will
            be shown, and MDT review will be flagged.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {issues.map((issue) => (
              <li key={`${issue.field}-${issue.kind}`}>
                <span className="font-medium">{issue.label}</span> ({issue.kind}): {issue.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
