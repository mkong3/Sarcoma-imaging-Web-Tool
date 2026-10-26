"use client";

import { useState } from "react";
import { BONE_PATHWAY, ESSR_SOURCE, NO_SOURCED_RECOMMENDATION } from "@/data/essrGuidance";
import { FIELD_LABELS } from "@/data/inputOptions";
import { formatDisplayDate } from "@/lib/dates";
import { SECTION_ORDER, SECTION_TITLES, formatCitation, planToPlainText } from "@/lib/formatPlan";
import type { CaseInput, PlanResult, PlanSection } from "@/lib/types";
import { buttonStyles } from "./fields";
import { CategoryBadge, RecommendationCard } from "./RecommendationCard";
import { SafetyNotice } from "./SafetyNotice";

const SECTION_DESCRIPTIONS: Record<PlanSection, string> = {
  intervals:
    "Follow-up timing as stated by ESSR. The paper gives intervals and imaging modalities as separate statements; calendar ranges are planning guides, not appointment dates.",
  local: "Imaging of the treated site and loco-regional area.",
  distant: "Imaging for metastatic disease.",
  mri_protocol: "Technical considerations for performing and reading surveillance imaging.",
  exceptions: "Evidence gaps, limitations and points requiring MDT judgement.",
};

interface ResultsViewProps {
  plan: PlanResult;
  input: CaseInput;
  onEdit: () => void;
  onReset: () => void;
}

export function ResultsView({ plan, input, onEdit, onReset }: ResultsViewProps) {
  const [copyStatus, setCopyStatus] = useState("");

  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(planToPlainText(plan, input));
      setCopyStatus("Draft plan copied to clipboard.");
    } catch {
      setCopyStatus("Copy failed. Use Print instead, or select and copy the text manually.");
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 id="results-heading" tabIndex={-1} className="text-2xl font-semibold text-slate-900 focus:outline-none">
          {plan.headline}
        </h2>
        <p className="text-sm text-slate-600">
          Draft generated {formatDisplayDate(plan.generatedOn)} for MDT discussion. Not an order. Not stored.
        </p>
      </header>

      <SafetyNotice />

      <div className="no-print flex flex-wrap gap-2">
        <button type="button" className={buttonStyles.primary} onClick={copyPlan}>
          Copy draft plan
        </button>
        <button type="button" className={buttonStyles.secondary} onClick={() => window.print()}>
          Print
        </button>
        <button type="button" className={buttonStyles.secondary} onClick={onEdit}>
          Edit inputs
        </button>
        <button type="button" className={buttonStyles.secondary} onClick={onReset}>
          Start over
        </button>
      </div>
      <p role="status" aria-live="polite" className="no-print text-sm text-slate-700">
        {copyStatus}
      </p>

      {plan.status === "no_sourced_pathway" && (
        <section
          aria-labelledby="no-pathway-heading"
          className="rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 p-5 text-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h3 id="no-pathway-heading" className="text-lg font-semibold">
              {plan.headline}
            </h3>
            <CategoryBadge category="evidence_gap" />
          </div>
          <p className="mt-2 text-sm">{plan.message}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            <li>No imaging schedule has been generated.</li>
            <li>Plan surveillance through your local sarcoma MDT and local policy.</li>
            {plan.pathway === "bone_or_other" && (
              <li>This prototype is structured so that a sourced bone pathway can be added later.</li>
            )}
          </ul>
          <p className="mt-3 text-xs text-slate-700">
            Source checked: {ESSR_SOURCE.journal}, DOI {ESSR_SOURCE.doi}.
            {plan.noPathwayCitation && <> {formatCitation(plan.noPathwayCitation)}.</>}
            {plan.pathway === "bone_or_other" && <> {BONE_PATHWAY.detail}</>}
          </p>
        </section>
      )}

      {plan.status === "incomplete" && (
        <section className="rounded-lg border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
          <h3 className="text-lg font-semibold">{plan.headline}</h3>
          <p className="mt-2">{plan.message}</p>
        </section>
      )}

      {plan.mdtReviewRequired && plan.status === "plan" && (
        <p className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-800">
          <strong className="font-semibold">MDT review flagged.</strong> One or more items below have missing inputs,
          evidence gaps or no sourced alternative.
        </p>
      )}

      {plan.reference && plan.status === "plan" && (
        <section aria-labelledby="reference-heading" className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <h3 id="reference-heading" className="font-semibold text-slate-900">
            Reference date for schedules
          </h3>
          <p className="mt-1 text-slate-800">
            {plan.reference.date ? (
              <span className="font-medium">{formatDisplayDate(plan.reference.date)}</span>
            ) : (
              <span className="font-medium text-amber-900">Not calculated</span>
            )}{" "}
            — {plan.reference.basis}
            {plan.reference.clinicianEntered && plan.reference.date && " (clinician-entered)"}
          </p>
          {plan.pathway === "sts" && (
            <p className="mt-1 text-slate-600">
              ESSR footnote: timing is counted “after resection or adjuvant therapy, whatever comes latest” (Table 2,
              p. 3329).
            </p>
          )}
        </section>
      )}

      {(plan.missing.length > 0 || plan.undetermined.length > 0) && (
        <section
          aria-labelledby="missing-heading"
          className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
        >
          <h3 id="missing-heading" className="font-semibold">
            Information needed — nothing has been assumed
          </h3>
          {plan.message && <p className="mt-1">{plan.message}</p>}
          {plan.missing.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {plan.missing.map((m) => (
                <li key={`${m.field}-${m.kind}`}>
                  <span className="font-medium">{m.label}</span> ({m.kind}): {m.reason}
                </li>
              ))}
            </ul>
          )}
          {plan.undetermined.length > 0 && (
            <>
              <p className="mt-3 font-medium">Not assessed:</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {plan.undetermined.map((u) => (
                  <li key={u.rule.id}>
                    {u.rule.title}: {NO_SOURCED_RECOMMENDATION} Requires{" "}
                    {u.missingFields.map((f) => FIELD_LABELS[f]).join(", ")}. ({u.rule.id})
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {plan.status === "plan" &&
        SECTION_ORDER.map((section) => (
          <section key={section} aria-labelledby={`section-${section}`} className="space-y-3">
            <div>
              <h3 id={`section-${section}`} className="text-lg font-semibold text-slate-900">
                {SECTION_TITLES[section]}
              </h3>
              <p className="text-sm text-slate-600">{SECTION_DESCRIPTIONS[section]}</p>
            </div>
            {plan.sections[section].length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
                {NO_SOURCED_RECOMMENDATION}
              </p>
            ) : (
              plan.sections[section].map((item) => <RecommendationCard key={item.rule.id} item={item} />)
            )}
          </section>
        ))}

      <footer className="border-t border-slate-200 pt-4 text-xs text-slate-600">
        <p>
          {ESSR_SOURCE.title}. {ESSR_SOURCE.journal}. DOI {ESSR_SOURCE.doi}. {ESSR_SOURCE.licence}.
        </p>
        <p className="mt-1">Prototype only. Not clinically validated, not a medical device, not approved for clinical deployment.</p>
      </footer>
    </div>
  );
}
