# Evidence matrix — ESSR 2024 soft tissue tumour surveillance

**Sole source:** Noebauer-Huhmann I-M, et al. *Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology–Guidelines 2024: imaging immediately after neoadjuvant therapy in soft tissue sarcoma, soft tissue tumor surveillance, and the role of interventional radiology.* European Radiology (2025) 35:3324–3335. DOI: [10.1007/s00330-024-11242-0](https://doi.org/10.1007/s00330-024-11242-0). Open Access, CC BY 4.0. Local copy: `reference/s00330-024-11242-0.pdf`.

**Method.** Text extracted page by page from the supplied PDF on 2026-10-25 and read in full (journal pp. 3324–3332; pp. 3332–3335 are references). Page numbers below are the printed journal page numbers. Quotes are verbatim. The supplementary material referenced by the paper was **not** supplied and was **not** used.

**Status key.** *Implemented* = encoded in `src/data/essrGuidance.ts` under the same rule ID. *Gap shown* = the paper names the topic but gives insufficient detail; the app shows "No sourced recommendation available". *Not implemented* = outside the source.

**Category key.** General = applies to soft tissue sarcoma (STS) generally. Entity-specific = modification for a named entity. Technical = technique consideration. Limitation = evidence or scope limitation.

## Soft tissue sarcoma — timeline

| Rule ID | Location (page) | Tumour group | Recommendation (verbatim) | Caveats / footnotes | Category | Status |
|---|---|---|---|---|---|---|
| STS-LIM-EVIDENCE | Table 2, 2.1 (p. 3328) | STS (surgically treated) | "Still, there are no evidence-based recommendations for routine follow-up in surgically treated sarcomas." | Schedule statements are prefaced "We would generally advocate". | Limitation | Implemented |
| STS-GEN-BASELINE | Table 2, 2.2.1, footnote a (pp. 3328–3329); text p. 3326 | STS | "Baseline follow-up no earlier than 3 months post-treatment" | Footnote a: "After resection or adjuvant therapy, whatever comes latest". | General | Implemented |
| STS-GEN-HIGH | Table 2, 2.2.1, footnote a (p. 3328) | High-grade STS | "In high-grade sarcoma: Year 1–3 every 3–4 months, year 4–5 every 6 months, year 6–10 annually" | Footnote a attached to this line. | General | Implemented |
| STS-GEN-LOW | Table 2, 2.2.1, footnote b (pp. 3328–3329) | Low-grade STS | "In low-grade sarcoma: Year 1–3 every 6 months, year 4–10 annually" | Footnote b: "For modified strategies (intervals and modalities) in special entities and conditions please see under 'Individualized strategy'". Footnote a is not attached to this line; the app uses the same post-treatment reference date and states this. | General | Implemented |
| STS-GEN-PIFU | Table 2, 2.2.1, footnote c (pp. 3328–3329) | Grade 1 STS, initial R0 | "In grade 1 sarcoma with initial R0 resection, patient-initiated follow-up, instead of regular intervals, may be considered after year 5 in compliant patients." | Footnote c: "R0 resection indicates a microscopically margin-negative resection, in which no gross or microscopic tumor remains in the primary tumor bed". Compliance is a clinical judgement and is not collected. | General | Implemented |
| STS-GEN-ENDPOINT | Table 2, 2.2.2 (p. 3328) | STS | "Regular follow-up should be carried out during the first 10 years after the initial diagnosis." | Counted from initial diagnosis, whereas the interval bands are counted post-treatment (footnote a). Not reconciled. | General | Implemented |
| STS-MOD-LONGTERM | Table 2, 2.2.2 (p. 3328) | Well-differentiated (retroperitoneal) liposarcoma; myxoid liposarcoma | "Regular annual follow-up should be continued longer than 10 years in patients with well-differentiated (retroperitoneal) liposarcomas and myxoid liposarcoma." | "(retroperitoneal)" is parenthetical in the source. The app applies it to retroperitoneal well-differentiated liposarcoma only; non-retroperitoneal well-differentiated liposarcoma/atypical lipomatous tumour is referred elsewhere (see ALT-GAP). No end date given. | Entity-specific | Implemented |
| STS-GEN-RECURRENCE | Table 2, 2.2.2 (p. 3328) | STS | "In case of recurrence, the surveillance algorithm should restart." | No restart anchor date given. The app requires a clinician-entered restart reference date. | General | Implemented |

## Soft tissue sarcoma — modalities

| Rule ID | Location (page) | Tumour group | Recommendation (verbatim) | Caveats | Category | Status |
|---|---|---|---|---|---|---|
| STS-LOC-MRI | Table 2, 2.3.2 (p. 3328); text p. 3330 | STS | "MRI is the method of choice for local and loco-regional surveillance of soft tissue sarcomas." | — | General | Implemented |
| STS-LOC-CT-SITES | Table 2, 2.3.2 (p. 3328); text p. 3330 | Mediastinal, retroperitoneal, visceral STS | "In sarcomas of the mediastinum, retroperitoneum and visceral sites, CT may be indicated instead of MRI for local and loco-regional surveillance." | Text p. 3330: "CT or PET/CT may be indicated instead of MRI". | General | Implemented |
| STS-LOC-US-LIMB | Table 2, 2.3.2 (p. 3328); text p. 3330 | Limb STS | "In limb sarcomas, US represents a valuable alternative for the assessment of local recurrence if MRI is inconclusive due to artifacts, in cases where MRI is contraindicated, or in rare cases where MRI is not available." | Text p. 3330: "(by an experienced sonographer)"; "especially in the early postoperative period, close comparison with a baseline MRI is needed". | General | Implemented |
| STS-LOC-US-SUBCUT | Table 2, 2.3.2 (p. 3328) | Subcutaneous low-grade lesions | "In subcutaneous low-grade lesions, and given that potential LR would be likely palpable, local surveillance with ultrasound may be considered instead of MRI." | Depth is not collected; shown as conditional for low-grade cases. | General | Implemented |
| STS-DIST-CHEST-CT | Table 2, 2.3.2 (p. 3328) | STS | "For metastatic disease, chest CT should be performed (For modified strategies in special entities and conditions please see under 'Individualized strategy')." | The paper gives intervals (2.2.1) and modalities (2.3.2) as separate statements. | General | Implemented |
| STS-TECH-PETCT | Table 2, 2.3.2 (p. 3328); text p. 3331 | STS | "FDG PET/CT can be a useful problem-solving tool if another study is equivocal." | Text p. 3331: "particularly in cases of suboptimal MRI because of extensive metal artifacts or where MRI is contraindicated". | Technical | Implemented |

## Soft tissue sarcoma — MRI and technique

| Rule ID | Location (page) | Tumour group | Recommendation (verbatim) | Caveats | Category | Status |
|---|---|---|---|---|---|---|
| STS-TECH-FOV | Table 2, 2.3.3 (p. 3328); text p. 3331 | STS | "The FOV should cover the whole surgical/post-therapeutic region." | Local MRI. | Technical | Implemented |
| STS-TECH-LANDMARK | Table 2, 2.3.3 (p. 3328) | STS | "One anatomic landmark should be visible." | Local MRI. | Technical | Implemented |
| STS-TECH-SEQUENCES | Table 2, 2.3.3 (p. 3328) | STS | "Same sequence parameters as in primary diagnosis can be used, except for sites where modifications are required to reduce artifacts from metallic hardware." | Local MRI. | Technical | Implemented |
| STS-TECH-CONTRAST | Table 2, 2.3.3 (p. 3328); text p. 3331 | STS | "If possible/not contraindicated, contrast agent should be used." | No alternative is given when contrast is contraindicated. | Technical | Implemented |
| STS-TECH-METAL-MRI | Text pp. 3330–3331 | STS with metallic hardware | "In case of metallic hardware, lower MRI field strengths are preferred, and dedicated sequences that are optimized for minimizing susceptibility artifacts should be used" | Text p. 3330: "the use of lower field strength and specific artifact suppression techniques can help to reduce metal artifacts". | Technical | Implemented |
| STS-TECH-METAL-CT | Text p. 3330 | STS with large metallic hardware | "In case of large metallic hardware, dual-energy CT or CT using modern iterative reconstruction algorithms of raw datasets, or PET/CT can be considered as alternative or additive to MRI" | Discussion text, not a scored statement. | Technical | Implemented |
| STS-TECH-DWI | Text p. 3331 | STS | "Although diffusion-weighted imaging is currently hampered by limited image quality, it facilitates the detection of recurrent lesions and, when evaluated in conjunction with other sequences, may increase confidence in diagnosing recurrence" | Not a mandatory sequence. | Technical | Implemented |
| STS-TECH-DCE | Text p. 3331 | STS | "Dynamic contrast-enhanced MRI is useful in the differentiation of recurrent soft tissue sarcoma and post-therapeutic fibrosis" | Not a mandatory sequence. | Technical | Implemented |
| STS-TECH-COMPARE | Table 2, 2.5 (p. 3329); text p. 3331 | STS | "Follow-up imaging should always be compared with previous images (especially those of the primary tumor, the baseline post-therapeutic images, as well as the most recent previous study)." | Same scanner ideally; previous examination available for copying planes/parameters. | Technical | Implemented |
| STS-GEN-PATIENT | Table 2, 2.5 (p. 3329) | STS | "Patients should be included by adequate information and encouragement to participate in the surveillance process" | — | General | Implemented |

## Entity-specific

| Rule ID | Location (page) | Tumour group | Recommendation (verbatim) | Caveats | Category | Status |
|---|---|---|---|---|---|---|
| MLS-DIST-WBMRI | Table 2, 2.4.1 (p. 3329); text p. 3331 | Myxoid liposarcoma | "For the detection of metastases, WB-MRI is recommended (for local surveillance, additional dedicated local MRI is recommended)." | No WB-MRI interval is stated → interval shown as "No sourced recommendation available". No contrast requirement stated. | Entity-specific | Implemented |
| MLS-LOC-MRI | Table 2, 2.4.1 (p. 3329) | Myxoid liposarcoma | "(for local surveillance, additional dedicated local MRI is recommended)" | Separate from WB-MRI. | Entity-specific | Implemented |
| MLS-DIST-CHEST | Table 2, 2.4.1 (p. 3329) | Myxoid liposarcoma | "For the detection of metastases, in year 0–2, chest CTs are recommended every 3 months, followed by chest radiographs every 6 months up to year 5 thereafter." | "Year 0–2" as written; app band = reference date to +24 months. Nothing stated after year 5. | Entity-specific | Implemented |
| MLS-TECH-WBMRI | Text p. 3331; Table 2, 2.3.3 (p. 3328) | Myxoid liposarcoma | "A possible protocol contains at least coronal and axial STIR and a coronal T1w sequence" | Labelled "possible protocol". Table 2: "For surveillance, the parameters of primary staging can be used." | Technical | Implemented |
| ENT-GAP-SPECIFIC | Table 2, 2.4.2, footnote e (p. 3329) | Alveolar soft part sarcoma, angiosarcoma, epithelioid sarcoma, clear cell sarcoma, rhabdomyosarcoma, leiomyosarcoma, undifferentiated pleomorphic sarcoma | "Other entities which require specific follow-up imaging strategies" | Footnote e: "Details are provided in the additional electronic material" — not supplied. | Limitation | Gap shown |
| ENT-GAP-RP-LPS | Table 2, 2.4.2, footnote e (p. 3329) | Retroperitoneal well-/de-differentiated liposarcoma | "retroperitoneal (well-/) de-differentiated liposarcoma" | Same entity list and footnote as ENT-GAP-SPECIFIC; applied only when site is retroperitoneal. | Limitation | Gap shown |
| ALT-GAP | Table 3, footnote to 3.2.2 (p. 3330) | Atypical lipomatous tumour | "For nerve sheath tumors and atypical lipomatous tumors, please see [9]" | Separate ESSR publication not supplied. Non-retroperitoneal well-differentiated liposarcoma returns no sourced pathway. | Limitation | Gap shown |

## Desmoid-type fibromatosis (not a sarcoma)

| Rule ID | Location (page) | Tumour group | Recommendation (verbatim) | Caveats | Category | Status |
|---|---|---|---|---|---|---|
| DTF-WW | Table 3, 3.2.1 (p. 3330) | Desmoid-type fibromatosis | "A watchful waiting approach for asymptomatic patients is recommended." | — | Entity-specific | Implemented |
| DTF-MRI | Table 3, 3.2.1 (p. 3330) | Desmoid-type fibromatosis | "MRI is preferred for surveillance. It should include T2w and contrast-enhanced sequences." | No alternative stated if MRI or contrast is contraindicated. | Entity-specific | Implemented |
| DTF-FIRST | Table 3, 3.2.1 (p. 3330) | Desmoid, watchful waiting | "A watchful waiting approach should include a first re-evaluation within 8–12 weeks." | Anchor not stated; app uses a clinician-entered surveillance start date. | Entity-specific | Implemented |
| DTF-SCHEDULE | Table 3, 3.2.1 (p. 3330) | Desmoid-type fibromatosis | "General follow-up scheme by imaging every 3 months in the first year, then every 6 months up to the fifth year, and yearly thereafter in case of stable disease." | "General" scheme; yearly only "in case of stable disease". Anchor not stated. | Entity-specific | Implemented |
| DTF-GAP-SYMPTOMATIC | Table 3, 3.2.1 (p. 3330) | Symptomatic desmoid | "A watchful waiting approach for asymptomatic patients is recommended." | No separate surveillance recommendation for symptomatic patients. | Limitation | Gap shown |

## Scope limitations

| Rule ID | Location (page) | Tumour group | Statement | Category | Status |
|---|---|---|---|---|---|
| LIM-PANEL | Limitations (p. 3331) | All | "The panelists came from European countries only." … "these guidelines reflect the current knowledge and will require further updates in future." | Limitation | Implemented |
| BONE-NONE | — | Bone sarcoma / other bone tumours | The paper does not provide a postoperative bone tumour follow-up pathway. | Limitation | Not implemented (no sourced pathway) |
| NEOADJ-NONE | Table 1 (p. 3327) | STS during/after neoadjuvant therapy | Pre-resection response imaging is outside the postoperative surveillance scope of this tool. | Limitation | Not implemented |

## Brief items checked against the paper

- Grade categories: the paper uses "high-grade", "low-grade" and "grade 1". It does not map FNCLCC grade 2 to either category. The app therefore asks for the ESSR category and, for low-grade, whether the tumour is grade 1.
- Mediastinal sites are named in STS-LOC-CT-SITES, so "mediastinal" is a site option. Limb and trunk are separate because STS-LOC-US-LIMB applies to limb sarcomas only.
- "Experienced" ultrasound: text p. 3330, "by an experienced sonographer".
