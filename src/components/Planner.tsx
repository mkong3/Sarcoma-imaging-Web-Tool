"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { buildPlan } from "@/lib/rulesEngine";
import { findMissingInputs } from "@/lib/validation";
import type { CaseInput, Pathway } from "@/lib/types";
import { buttonStyles } from "./fields";
import { ResultsView } from "./ResultsView";
import { SafetyNotice } from "./SafetyNotice";
import { StepIndicator } from "./StepIndicator";
import {
  StepDesmoidDetails,
  StepDesmoidStart,
  StepImaging,
  StepPathway,
  StepReview,
  StepStsDates,
  StepStsTumour,
  type UpdateInput,
} from "./steps";

type StepKey = "pathway" | "stsTumour" | "stsDates" | "desmoidDetails" | "desmoidStart" | "imaging" | "review";

const STEP_TITLES: Record<StepKey, string> = {
  pathway: "Pathway",
  stsTumour: "Tumour details",
  stsDates: "Treatment dates",
  desmoidDetails: "Clinical details",
  desmoidStart: "Surveillance start",
  imaging: "Imaging constraints",
  review: "Review",
};

function stepsFor(pathway: Pathway | undefined): StepKey[] {
  if (pathway === "bone_or_other") return ["pathway", "review"];
  if (pathway === "desmoid") return ["pathway", "desmoidDetails", "desmoidStart", "imaging", "review"];
  return ["pathway", "stsTumour", "stsDates", "imaging", "review"];
}

function localToday(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

const noopSubscribe = () => () => {};

export function Planner() {
  // Read the clock only in the browser so server prerendering stays deterministic.
  const today = useSyncExternalStore(noopSubscribe, localToday, () => "");
  const [input, setInput] = useState<CaseInput>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigated = useRef(false);

  const steps = stepsFor(input.pathway);
  const step = steps[Math.min(stepIndex, steps.length - 1)] ?? "pathway";
  const issues = useMemo(() => (today ? findMissingInputs(input, today) : []), [input, today]);
  const plan = useMemo(() => (showResults && today ? buildPlan(input, today) : null), [showResults, input, today]);

  useEffect(() => {
    if (!navigated.current) return;
    const target = showResults ? document.getElementById("results-heading") : headingRef.current;
    target?.focus();
  }, [stepIndex, showResults]);

  const update: UpdateInput = (field, value) => {
    setInput((prev) => {
      if (field === "pathway") return value === prev.pathway ? prev : { pathway: value as Pathway };
      const next: CaseInput = { ...prev, [field]: value };
      if (field === "gradeCategory" && value !== "low") {
        delete next.grade1;
        delete next.margin;
      }
      if (field === "grade1" && value !== "yes") delete next.margin;
      if (field === "adjuvantTherapy" && value !== "yes") delete next.adjuvantCompletionDate;
      if (field === "recurrence") {
        if (value === "yes") {
          delete next.resectionDate;
          delete next.adjuvantTherapy;
          delete next.adjuvantCompletionDate;
        } else {
          delete next.restartReferenceDate;
        }
      }
      return next;
    });
  };

  const go = (index: number) => {
    navigated.current = true;
    setStepIndex(index);
  };

  const reset = () => {
    navigated.current = true;
    setInput({});
    setShowResults(false);
    setStepIndex(0);
  };

  const stepProps = { input, update, today, issues };

  if (plan) {
    return (
      <ResultsView
        plan={plan}
        input={input}
        onEdit={() => {
          navigated.current = true;
          setShowResults(false);
        }}
        onReset={reset}
      />
    );
  }

  const isLast = stepIndex >= steps.length - 1;

  return (
    <div className="space-y-6">
      {stepIndex === 0 && <SafetyNotice />}
      <StepIndicator steps={steps.map((s) => STEP_TITLES[s])} current={stepIndex} />

      <form
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (isLast) {
            navigated.current = true;
            setShowResults(true);
          } else {
            go(stepIndex + 1);
          }
        }}
      >
        <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold text-slate-900 focus:outline-none">
          Step {stepIndex + 1} of {steps.length}: {STEP_TITLES[step]}
        </h2>

        {step === "pathway" && <StepPathway {...stepProps} />}
        {step === "stsTumour" && <StepStsTumour {...stepProps} />}
        {step === "stsDates" && <StepStsDates {...stepProps} />}
        {step === "desmoidDetails" && <StepDesmoidDetails {...stepProps} />}
        {step === "desmoidStart" && <StepDesmoidStart {...stepProps} />}
        {step === "imaging" && <StepImaging {...stepProps} />}
        {step === "review" && <StepReview {...stepProps} />}

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
          {stepIndex > 0 && (
            <button type="button" className={buttonStyles.secondary} onClick={() => go(stepIndex - 1)}>
              Back
            </button>
          )}
          <button type="submit" className={buttonStyles.primary} disabled={!input.pathway || !today}>
            {isLast ? "Show suggested plan" : "Continue"}
          </button>
          {!input.pathway && <p className="text-sm text-slate-600">Select a pathway to continue.</p>}
        </div>
      </form>
    </div>
  );
}
