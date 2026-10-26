import { ESSR_SOURCE, SAFETY_NOTICE } from "@/data/essrGuidance";

export function SafetyNotice() {
  return (
    <aside
      aria-label="Important notice"
      className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700"
    >
      <p>
        <strong className="font-semibold text-slate-900">Clinician review required. </strong>
        {SAFETY_NOTICE}
      </p>
      <p className="mt-2 text-slate-600">
        Sole source: {ESSR_SOURCE.journal} (ESSR Guidelines 2024, part 3). DOI{" "}
        <a
          className="underline decoration-slate-400 underline-offset-2 hover:text-slate-900"
          href={`https://doi.org/${ESSR_SOURCE.doi}`}
          rel="noreferrer"
          target="_blank"
        >
          {ESSR_SOURCE.doi}
        </a>
        . No data entered here is stored or sent anywhere.
      </p>
    </aside>
  );
}
