import type { ReactNode } from "react";
import { NO_SOURCED_RECOMMENDATION } from "@/data/essrGuidance";
import { CATEGORY_LABELS, formatBandDates, formatCitation } from "@/lib/formatPlan";
import type { PlanItem, RuleCategory } from "@/lib/types";

const CATEGORY_STYLES: Record<RuleCategory, { badge: string; card: string; icon: string }> = {
  general: { badge: "border-sky-300 bg-sky-50 text-sky-900", card: "border-l-sky-700", icon: "●" },
  entity_specific: {
    badge: "border-violet-300 bg-violet-50 text-violet-900",
    card: "border-l-violet-700",
    icon: "◆",
  },
  technical: { badge: "border-teal-300 bg-teal-50 text-teal-900", card: "border-l-teal-700", icon: "▲" },
  limitation: { badge: "border-slate-300 bg-slate-100 text-slate-800", card: "border-l-slate-500", icon: "■" },
  evidence_gap: {
    badge: "border-dashed border-amber-400 bg-amber-50 text-amber-950",
    card: "border-l-amber-600 border-dashed",
    icon: "○",
  },
};

export function CategoryBadge({ category }: { category: RuleCategory }) {
  const style = CATEGORY_STYLES[category];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.badge}`}>
      <span aria-hidden="true">{style.icon}</span>
      {CATEGORY_LABELS[category]}
    </span>
  );
}

function Detail({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
      <dt className="text-slate-600">{term}</dt>
      <dd className="text-slate-900">{children}</dd>
    </div>
  );
}

export function RecommendationCard({ item }: { item: PlanItem }) {
  const { rule } = item;
  const style = CATEGORY_STYLES[rule.category];
  const hasDetails = rule.modality || rule.coverage || rule.timing;
  return (
    <article
      aria-labelledby={`${rule.id}-title`}
      className={`print-avoid-break rounded-lg border border-l-4 border-slate-200 bg-white p-4 shadow-sm ${style.card}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 id={`${rule.id}-title`} className="text-base font-semibold text-slate-900">
          {rule.title}
        </h4>
        <CategoryBadge category={rule.category} />
      </div>

      <blockquote className="mt-2 border-l-2 border-slate-200 pl-3 text-sm italic text-slate-700">
        “{rule.quote}”
      </blockquote>

      {item.modifiedForCase && (
        <p className="mt-2 text-sm font-medium text-violet-900">
          A subtype-specific modification applies to this case (see below).
        </p>
      )}

      {hasDetails && (
        <dl className="mt-3 space-y-1.5 text-sm">
          {rule.modality && <Detail term="Modality">{rule.modality}</Detail>}
          {rule.coverage && <Detail term="Coverage">{rule.coverage}</Detail>}
          {rule.timing && (
            <Detail term="Timing">
              {rule.timing === NO_SOURCED_RECOMMENDATION ? (
                <span className="font-medium text-amber-900">{rule.timing}</span>
              ) : (
                rule.timing
              )}
            </Detail>
          )}
        </dl>
      )}

      {item.bands.length > 0 && (
        <ol className="mt-4 space-y-0 border-l-2 border-slate-200 pl-4" aria-label={`${rule.title} timeline`}>
          {item.bands.map((band) => (
            <li key={band.label} className="relative pb-3 last:pb-0">
              <span
                aria-hidden="true"
                className={`absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full ${
                  band.status === "current" ? "bg-sky-700" : "bg-slate-300"
                }`}
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                <span className="font-semibold text-slate-900">{band.label}</span>
                <span className="text-slate-800">
                  {band.intervalText}
                  {band.modality && <> — {band.modality}</>}
                </span>
                {band.status === "current" && (
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-900">
                    Current period
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-600">{formatBandDates(band)}</div>
              {band.condition && <div className="text-sm text-slate-700">Condition: {band.condition}</div>}
            </li>
          ))}
        </ol>
      )}

      {item.notes.length > 0 && (
        <ul className="mt-3 space-y-1 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-800">
          {item.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}

      {rule.caveats.length > 0 && (
        <div className="mt-3 text-sm">
          <p className="font-medium text-slate-700">Caveats</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
            {rule.caveats.map((caveat) => (
              <li key={caveat}>{caveat}</li>
            ))}
          </ul>
        </div>
      )}

      <dl className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-600">
        <div>
          <dt className="inline font-medium">Triggered by: </dt>
          <dd className="inline">{item.triggeredBy.join("; ")}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Source: </dt>
          <dd className="inline">
            {formatCitation(rule.citation)} · Rule {rule.id}
          </dd>
        </div>
      </dl>
    </article>
  );
}
