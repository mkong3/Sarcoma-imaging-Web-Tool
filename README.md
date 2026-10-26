# Sarcoma Imaging Follow-up Planner (prototype)

Clinician-facing prototype for planning and reviewing postoperative imaging surveillance of adult soft tissue sarcoma and desmoid-type fibromatosis.

**Not clinically validated.** It does not diagnose recurrence, place imaging orders or replace sarcoma MDT review. It is not a medical device, makes no outcome claims and is not ready for NHS deployment. Clinicians must review every item and follow local sarcoma MDT policy.

## Source

The only clinical source is the ESSR Guidelines 2024, part 3: Noebauer-Huhmann et al., *European Radiology* (2025) 35:3324–3335, DOI [10.1007/s00330-024-11242-0](https://doi.org/10.1007/s00330-024-11242-0) (CC BY 4.0). Local copy: `reference/s00330-024-11242-0.pdf`.

- `docs/evidence-matrix.md` records every rule: page, table and section, tumour group, verbatim wording, caveats and category.
- `src/data/essrGuidance.ts` holds all clinical rules as typed data. Each rule has a source ID and citation.
- `src/lib/rulesEngine.ts` is a deterministic rules engine. No AI or external service is used at runtime.

## Requirements and running

- Node.js LTS (tested with 24.22.1) and npm.
- On Windows PowerShell with script execution disabled, use `npm.cmd` instead of `npm`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm test           # Vitest
npm run build
```

## Privacy

No patient identifiers are collected. Inputs are held in browser memory only and cleared on reload or "Start over". There is no backend, local storage, cookies or analytics.

## Scope and evidence limitations

- The paper states there are no evidence-based recommendations for routine follow-up in surgically treated sarcomas. The schedules are expert consensus.
- Interval ranges (for example every 3–4 months) are shown as written. The tool shows year bands with calendar ranges, not appointment dates.
- Where the paper does not give enough information, the app shows "No sourced recommendation available" and flags MDT review. Missing or unknown inputs are never defaulted.
- Entities the paper says need specific strategies (Table 2, 2.4.2) refer to supplementary material that was not supplied, so only the general schedule is shown with an evidence-gap notice.
- Bone sarcoma and other bone tumours return "No sourced pathway available in this prototype." To add one later, add a sourced rule set to `src/data/essrGuidance.ts` with matching evidence-matrix rows, and replace the `bone_or_other` branch in `buildPlan`.
