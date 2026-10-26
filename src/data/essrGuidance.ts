import type { Citation, EssrRule, StsSubtype } from "@/lib/types";

export const ESSR_SOURCE = {
  id: "ESSR-2024-STT-PART3",
  shortCitation: "Noebauer-Huhmann et al., Eur Radiol 2025;35:3324–3335",
  title:
    "Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology–Guidelines 2024: imaging immediately after neoadjuvant therapy in soft tissue sarcoma, soft tissue tumor surveillance, and the role of interventional radiology",
  journal: "European Radiology (2025) 35:3324–3335",
  doi: "10.1007/s00330-024-11242-0",
  licence: "CC BY 4.0",
  localFile: "reference/s00330-024-11242-0.pdf",
} as const;

export const NO_SOURCED_RECOMMENDATION = "No sourced recommendation available.";
export const NO_SOURCED_PATHWAY = "No sourced pathway available in this prototype.";

export const SAFETY_NOTICE =
  "Prototype decision-support tool. Not a validated clinical pathway. It does not diagnose recurrence, place imaging orders or replace sarcoma MDT review. Clinicians must review every item and follow local sarcoma MDT policy.";

const sourceId = ESSR_SOURCE.id;

const ENTITIES_WITH_SPECIFIC_STRATEGY: readonly StsSubtype[] = [
  "alveolar_soft_part_sarcoma",
  "angiosarcoma",
  "epithelioid_sarcoma",
  "clear_cell_sarcoma",
  "rhabdomyosarcoma",
  "leiomyosarcoma",
  "undifferentiated_pleomorphic_sarcoma",
];

export const BONE_PATHWAY = {
  status: "no_sourced_pathway",
  message: NO_SOURCED_PATHWAY,
  detail:
    "The supplied ESSR paper covers soft tissue tumours. It does not provide a postoperative bone sarcoma or general bone tumour follow-up pathway, so no schedule is generated.",
} as const;

export const ALT_NO_PATHWAY = {
  message: NO_SOURCED_PATHWAY,
  detail:
    "The supplied paper applies longer annual follow-up to well-differentiated (retroperitoneal) liposarcoma and refers atypical lipomatous tumours to a separate ESSR publication that is not part of this prototype's source. No schedule is generated for well-differentiated liposarcoma outside the retroperitoneum.",
  citation: {
    page: "3330",
    location: "Table 3, note to section 3.2.2",
    footnote: "\"For nerve sheath tumors and atypical lipomatous tumors, please see [9]\"",
  } satisfies Citation,
} as const;

export const ESSR_RULES = [
  // ---------- Soft tissue sarcoma: follow-up intervals ----------
  {
    id: "STS-GEN-BASELINE",
    sourceId,
    section: "intervals",
    category: "general",
    title: "Baseline follow-up",
    quote: "Baseline follow-up no earlier than 3 months post-treatment",
    timing: "No earlier than 3 months after resection or adjuvant therapy, whichever comes later",
    schedule: {
      anchor: "post_treatment",
      bands: [
        {
          label: "Baseline",
          start: { months: 3 },
          end: null,
          intervalText: "No earlier than 3 months post-treatment",
        },
      ],
    },
    citation: {
      page: "3328–3329",
      location: "Table 2, section 2.2.1",
      footnote: "Footnote a: \"After resection or adjuvant therapy, whatever comes latest\"",
    },
    caveats: ["Statements in section 2.2.1 are introduced with \"We would generally advocate\"."],
    appliesTo: { pathway: ["sts"] },
  },
  {
    id: "STS-GEN-HIGH",
    sourceId,
    section: "intervals",
    category: "general",
    title: "High-grade sarcoma follow-up intervals",
    quote:
      "In high-grade sarcoma: Year 1–3 every 3–4 months, year 4–5 every 6 months, year 6–10 annually",
    timing: "Years 1–10 after treatment",
    schedule: {
      anchor: "post_treatment",
      bands: [
        { label: "Years 1–3", start: { months: 0 }, end: { months: 36 }, intervalText: "Every 3–4 months" },
        { label: "Years 4–5", start: { months: 36 }, end: { months: 60 }, intervalText: "Every 6 months" },
        { label: "Years 6–10", start: { months: 60 }, end: { months: 120 }, intervalText: "Annually" },
      ],
    },
    citation: {
      page: "3328",
      location: "Table 2, section 2.2.1",
      footnote: "Footnote a: \"After resection or adjuvant therapy, whatever comes latest\"",
    },
    caveats: [
      "Intervals are shown exactly as written. The tool does not choose a value within a range such as 3–4 months.",
      "The paper gives follow-up intervals and imaging modalities as separate statements.",
    ],
    appliesTo: { pathway: ["sts"], gradeCategory: ["high"] },
  },
  {
    id: "STS-GEN-LOW",
    sourceId,
    section: "intervals",
    category: "general",
    title: "Low-grade sarcoma follow-up intervals",
    quote: "In low-grade sarcoma: Year 1–3 every 6 months, year 4–10 annually",
    timing: "Years 1–10 after treatment",
    schedule: {
      anchor: "post_treatment",
      bands: [
        { label: "Years 1–3", start: { months: 0 }, end: { months: 36 }, intervalText: "Every 6 months" },
        { label: "Years 4–10", start: { months: 36 }, end: { months: 120 }, intervalText: "Annually" },
      ],
    },
    citation: {
      page: "3328–3329",
      location: "Table 2, section 2.2.1",
      footnote:
        "Footnote b: \"For modified strategies (intervals and modalities) in special entities and conditions please see under 'Individualized strategy'\"",
    },
    caveats: [
      "In the source, footnote a (post-treatment timing) is attached to the baseline and high-grade lines but not to this line. Dates shown use the same post-treatment reference date; confirm locally.",
      "The paper gives follow-up intervals and imaging modalities as separate statements.",
    ],
    appliesTo: { pathway: ["sts"], gradeCategory: ["low"] },
  },
  {
    id: "STS-GEN-PIFU",
    sourceId,
    section: "intervals",
    category: "general",
    title: "Patient-initiated follow-up may be considered after year 5",
    quote:
      "In grade 1 sarcoma with initial R0 resection, patient-initiated follow-up, instead of regular intervals, may be considered after year 5 in compliant patients.",
    timing: "After year 5",
    schedule: {
      anchor: "post_treatment",
      bands: [
        {
          label: "After year 5",
          start: { months: 60 },
          end: null,
          intervalText: "Patient-initiated follow-up may be considered instead of regular intervals",
          condition: "In compliant patients (clinical judgement; not collected by this tool)",
        },
      ],
    },
    citation: {
      page: "3328–3329",
      location: "Table 2, section 2.2.1",
      footnote:
        "Footnote c: \"R0 resection indicates a microscopically margin-negative resection, in which no gross or microscopic tumor remains in the primary tumor bed\"",
    },
    caveats: ["\"May be considered\" — this is an option for discussion, not a default."],
    appliesTo: { pathway: ["sts"], gradeCategory: ["low"], grade1: ["yes"], margin: ["R0"] },
  },
  {
    id: "STS-GEN-ENDPOINT",
    sourceId,
    section: "intervals",
    category: "general",
    title: "Duration of regular follow-up",
    quote: "Regular follow-up should be carried out during the first 10 years after the initial diagnosis.",
    timing: "First 10 years after the initial diagnosis",
    citation: { page: "3328", location: "Table 2, section 2.2.2" },
    caveats: [
      "This endpoint is counted from the initial diagnosis, whereas the interval bands are counted post-treatment. The paper does not reconcile these, and neither does this tool.",
    ],
    appliesTo: { pathway: ["sts"] },
    modifiedBy: ["STS-MOD-LONGTERM"],
  },
  {
    id: "STS-MOD-LONGTERM",
    sourceId,
    section: "intervals",
    category: "entity_specific",
    title: "Annual follow-up continued beyond 10 years",
    quote:
      "Regular annual follow-up should be continued longer than 10 years in patients with well-differentiated (retroperitoneal) liposarcomas and myxoid liposarcoma.",
    timing: "Annually, beyond year 10",
    schedule: {
      anchor: "post_treatment",
      bands: [
        {
          label: "Beyond year 10",
          start: { months: 120 },
          end: null,
          intervalText: "Annually (continued longer than 10 years)",
        },
      ],
    },
    citation: { page: "3328", location: "Table 2, section 2.2.2" },
    caveats: [
      "No end date is stated in the source.",
      "The source writes \"(retroperitoneal)\" in parentheses; this tool applies it to retroperitoneal well-differentiated liposarcoma only.",
    ],
    appliesTo: {
      pathway: ["sts"],
      subtype: ["myxoid_liposarcoma", "well_differentiated_liposarcoma"],
    },
  },
  {
    id: "STS-GEN-RECURRENCE",
    sourceId,
    section: "intervals",
    category: "general",
    title: "Restart after recurrence",
    quote: "In case of recurrence, the surveillance algorithm should restart.",
    timing: "From the restart reference date",
    citation: { page: "3328", location: "Table 2, section 2.2.2" },
    caveats: [
      "The source does not state the date from which the algorithm restarts. This tool uses a restart reference date entered by the clinician.",
    ],
    appliesTo: { pathway: ["sts"] },
    conditionalNotes: [
      {
        when: { recurrence: ["yes"] },
        text: "Recurrence recorded: dates are calculated from the clinician-entered restart reference date.",
      },
    ],
  },

  // ---------- Soft tissue sarcoma: local / loco-regional ----------
  {
    id: "STS-LOC-MRI",
    sourceId,
    section: "local",
    category: "general",
    title: "Local and loco-regional surveillance: MRI",
    quote: "MRI is the method of choice for local and loco-regional surveillance of soft tissue sarcomas.",
    modality: "MRI",
    coverage: "Whole surgical/post-therapeutic region with one anatomic landmark (see MRI protocol considerations)",
    timing: "At follow-up time points (see follow-up intervals)",
    citation: { page: "3328", location: "Table 2, section 2.3.2" },
    caveats: [],
    appliesTo: { pathway: ["sts"] },
    conditionalNotes: [
      {
        when: { mriContraindication: ["yes"], site: ["trunk", "other"] },
        text: "MRI contraindication recorded. The paper names alternatives only for limb sarcomas (ultrasound) and for mediastinal, retroperitoneal and visceral sites (CT). No sourced recommendation available for this site — refer to MDT.",
        requiresMdt: true,
      },
    ],
  },
  {
    id: "STS-LOC-CT-SITES",
    sourceId,
    section: "local",
    category: "general",
    title: "CT may be indicated instead of MRI at this site",
    quote:
      "In sarcomas of the mediastinum, retroperitoneum and visceral sites, CT may be indicated instead of MRI for local and loco-regional surveillance.",
    modality: "CT (or PET/CT, per discussion text)",
    coverage: "Local and loco-regional",
    timing: "At follow-up time points (see follow-up intervals)",
    citation: { page: "3328", location: "Table 2, section 2.3.2; discussion p. 3330" },
    caveats: ["Discussion text (p. 3330) reads \"CT or PET/CT may be indicated instead of MRI\"."],
    appliesTo: { pathway: ["sts"], site: ["mediastinal", "retroperitoneal", "visceral"] },
  },
  {
    id: "STS-LOC-US-LIMB",
    sourceId,
    section: "local",
    category: "general",
    title: "Ultrasound as an alternative in limb sarcoma",
    quote:
      "In limb sarcomas, US represents a valuable alternative for the assessment of local recurrence if MRI is inconclusive due to artifacts, in cases where MRI is contraindicated, or in rare cases where MRI is not available.",
    modality: "Ultrasound (by an experienced sonographer)",
    coverage: "Assessment of local recurrence",
    timing: "When MRI is inconclusive due to artefacts, contraindicated or unavailable",
    citation: { page: "3328", location: "Table 2, section 2.3.2; discussion p. 3330" },
    caveats: [
      "Discussion text (p. 3330): \"especially in the early postoperative period, close comparison with a baseline MRI is needed\".",
    ],
    appliesTo: { pathway: ["sts"], site: ["limb"] },
    conditionalNotes: [
      {
        when: { mriContraindication: ["yes"] },
        text: "MRI contraindication recorded: this is one of the situations named for ultrasound.",
      },
      {
        when: { metalwork: ["yes"] },
        text: "Metalwork recorded: ultrasound is named for when MRI is inconclusive due to artefacts.",
      },
    ],
  },
  {
    id: "STS-LOC-US-SUBCUT",
    sourceId,
    section: "local",
    category: "general",
    title: "Ultrasound may be considered for subcutaneous low-grade lesions",
    quote:
      "In subcutaneous low-grade lesions, and given that potential LR would be likely palpable, local surveillance with ultrasound may be considered instead of MRI.",
    modality: "Ultrasound",
    coverage: "Local surveillance",
    timing: "Instead of MRI, if conditions are met",
    citation: { page: "3328", location: "Table 2, section 2.3.2" },
    caveats: [
      "Applies only if the lesion is subcutaneous and a local recurrence would likely be palpable. Tumour depth is not collected by this tool.",
    ],
    appliesTo: { pathway: ["sts"], gradeCategory: ["low"] },
  },

  // ---------- Soft tissue sarcoma: distant / metastatic ----------
  {
    id: "STS-DIST-CHEST-CT",
    sourceId,
    section: "distant",
    category: "general",
    title: "Metastatic surveillance: chest CT",
    quote:
      "For metastatic disease, chest CT should be performed (For modified strategies in special entities and conditions please see under \u201cIndividualized strategy\u201d).",
    modality: "Chest CT",
    coverage: "Chest",
    timing: "At follow-up time points (see follow-up intervals)",
    citation: { page: "3328", location: "Table 2, section 2.3.2" },
    caveats: [
      "The paper does not state separately whether every follow-up time point includes chest CT.",
    ],
    appliesTo: { pathway: ["sts"] },
    modifiedBy: ["MLS-DIST-CHEST", "MLS-DIST-WBMRI"],
  },
  {
    id: "STS-TECH-PETCT",
    sourceId,
    section: "distant",
    category: "technical",
    title: "FDG PET/CT as a problem-solving tool",
    quote: "FDG PET/CT can be a useful problem-solving tool if another study is equivocal.",
    modality: "FDG PET/CT",
    coverage: "Whole body (problem solving)",
    timing: "If another study is equivocal",
    citation: { page: "3328", location: "Table 2, section 2.3.2; discussion p. 3331" },
    caveats: [
      "Discussion text (p. 3331): \"particularly in cases of suboptimal MRI because of extensive metal artifacts or where MRI is contraindicated\".",
    ],
    appliesTo: { pathway: ["sts"] },
  },

  // ---------- Soft tissue sarcoma: MRI protocol considerations ----------
  {
    id: "STS-TECH-FOV",
    sourceId,
    section: "mri_protocol",
    category: "technical",
    title: "Field of view",
    quote: "The FOV should cover the whole surgical/post-therapeutic region.",
    modality: "Local MRI",
    coverage: "Whole surgical/post-therapeutic region",
    citation: { page: "3328", location: "Table 2, section 2.3.3" },
    caveats: [],
    appliesTo: { pathway: ["sts"] },
  },
  {
    id: "STS-TECH-LANDMARK",
    sourceId,
    section: "mri_protocol",
    category: "technical",
    title: "Anatomic landmark",
    quote: "One anatomic landmark should be visible.",
    modality: "Local MRI",
    citation: { page: "3328", location: "Table 2, section 2.3.3" },
    caveats: [],
    appliesTo: { pathway: ["sts"] },
  },
  {
    id: "STS-TECH-SEQUENCES",
    sourceId,
    section: "mri_protocol",
    category: "technical",
    title: "Sequence parameters",
    quote:
      "Same sequence parameters as in primary diagnosis can be used, except for sites where modifications are required to reduce artifacts from metallic hardware.",
    modality: "Local MRI",
    citation: { page: "3328", location: "Table 2, section 2.3.3" },
    caveats: [],
    appliesTo: { pathway: ["sts"] },
  },
  {
    id: "STS-TECH-CONTRAST",
    sourceId,
    section: "mri_protocol",
    category: "technical",
    title: "Contrast agent",
    quote: "If possible/not contraindicated, contrast agent should be used.",
    modality: "Local MRI",
    citation: { page: "3328", location: "Table 2, section 2.3.3; discussion p. 3331" },
    caveats: [],
    appliesTo: { pathway: ["sts"] },
    conditionalNotes: [
      {
        when: { contrastContraindication: ["yes"] },
        text: "Contrast contraindication recorded: contrast is not used. No sourced recommendation available for an alternative sequence.",
      },
    ],
  },
  {
    id: "STS-TECH-METAL-MRI",
    sourceId,
    section: "mri_protocol",
    category: "technical",
    title: "Metallic hardware: MRI artefact reduction",
    quote:
      "In case of metallic hardware, lower MRI field strengths are preferred, and dedicated sequences that are optimized for minimizing susceptibility artifacts should be used",
    modality: "Local MRI",
    citation: { page: "3330–3331", location: "Discussion, imaging modalities and parameters" },
    caveats: ["Discussion text, not a separately scored statement."],
    appliesTo: { pathway: ["sts"], metalwork: ["yes"] },
  },
  {
    id: "STS-TECH-METAL-CT",
    sourceId,
    section: "mri_protocol",
    category: "technical",
    title: "Large metallic hardware: CT or PET/CT alternatives",
    quote:
      "In case of large metallic hardware, dual-energy CT or CT using modern iterative reconstruction algorithms of raw datasets, or PET/CT can be considered as alternative or additive to MRI",
    modality: "Dual-energy CT, CT with iterative reconstruction, or PET/CT",
    coverage: "Local",
    citation: { page: "3330", location: "Discussion, imaging modalities for local surveillance" },
    caveats: ["Applies to large metallic hardware. Discussion text, not a separately scored statement."],
    appliesTo: { pathway: ["sts"], metalwork: ["yes"] },
  },
  {
    id: "STS-TECH-DWI",
    sourceId,
    section: "mri_protocol",
    category: "technical",
    title: "Diffusion-weighted imaging (optional consideration)",
    quote:
      "Although diffusion-weighted imaging is currently hampered by limited image quality, it facilitates the detection of recurrent lesions and, when evaluated in conjunction with other sequences, may increase confidence in diagnosing recurrence",
    modality: "Local MRI",
    citation: { page: "3331", location: "Discussion, imaging parameters" },
    caveats: ["Technical consideration, not a mandatory sequence."],
    appliesTo: { pathway: ["sts"] },
  },
  {
    id: "STS-TECH-DCE",
    sourceId,
    section: "mri_protocol",
    category: "technical",
    title: "Dynamic contrast-enhanced MRI (optional consideration)",
    quote:
      "Dynamic contrast-enhanced MRI is useful in the differentiation of recurrent soft tissue sarcoma and post-therapeutic fibrosis",
    modality: "Local MRI",
    citation: { page: "3331", location: "Discussion, imaging parameters" },
    caveats: ["Technical consideration, not a mandatory sequence. Requires contrast."],
    appliesTo: { pathway: ["sts"] },
    conditionalNotes: [
      {
        when: { contrastContraindication: ["yes"] },
        text: "Contrast contraindication recorded: DCE MRI requires contrast.",
      },
    ],
  },
  {
    id: "STS-TECH-COMPARE",
    sourceId,
    section: "mri_protocol",
    category: "technical",
    title: "Comparison with previous imaging",
    quote:
      "Follow-up imaging should always be compared with previous images (especially those of the primary tumor, the baseline post-therapeutic images, as well as the most recent previous study).",
    citation: { page: "3329", location: "Table 2, section 2.5; discussion p. 3331" },
    caveats: [
      "The study should ideally be performed on the same scanner, with the previous examination available for copying sequence planes and parameters.",
    ],
    appliesTo: { pathway: ["sts"] },
  },

  // ---------- Myxoid liposarcoma ----------
  {
    id: "MLS-LOC-MRI",
    sourceId,
    section: "local",
    category: "entity_specific",
    title: "Myxoid liposarcoma: dedicated local MRI",
    quote: "(for local surveillance, additional dedicated local MRI is recommended)",
    modality: "Dedicated local MRI",
    coverage: "Local (separate from whole-body MRI)",
    timing: "At follow-up time points (see follow-up intervals)",
    citation: { page: "3329", location: "Table 2, section 2.4.1" },
    caveats: [],
    appliesTo: { pathway: ["sts"], subtype: ["myxoid_liposarcoma"] },
  },
  {
    id: "MLS-DIST-WBMRI",
    sourceId,
    section: "distant",
    category: "entity_specific",
    title: "Myxoid liposarcoma: whole-body MRI for metastases",
    quote:
      "For the detection of metastases, WB-MRI is recommended (for local surveillance, additional dedicated local MRI is recommended).",
    modality: "Whole-body MRI",
    coverage: "Whole body",
    timing: NO_SOURCED_RECOMMENDATION,
    citation: { page: "3329", location: "Table 2, section 2.4.1; discussion p. 3331" },
    caveats: [
      "The paper does not state a whole-body MRI interval.",
      "The paper does not specify a contrast requirement for whole-body MRI.",
    ],
    appliesTo: { pathway: ["sts"], subtype: ["myxoid_liposarcoma"] },
    conditionalNotes: [
      {
        when: { mriContraindication: ["yes"] },
        text: "MRI contraindication recorded. No sourced alternative to whole-body MRI is given for myxoid liposarcoma — refer to MDT.",
        requiresMdt: true,
      },
    ],
  },
  {
    id: "MLS-DIST-CHEST",
    sourceId,
    section: "distant",
    category: "entity_specific",
    title: "Myxoid liposarcoma: chest imaging schedule",
    quote:
      "For the detection of metastases, in year 0–2, chest CTs are recommended every 3 months, followed by chest radiographs every 6 months up to year 5 thereafter.",
    timing: "Year 0–2, then up to year 5",
    schedule: {
      anchor: "post_treatment",
      bands: [
        {
          label: "Year 0–2",
          start: { months: 0 },
          end: { months: 24 },
          intervalText: "Every 3 months",
          modality: "Chest CT",
        },
        {
          label: "Thereafter, up to year 5",
          start: { months: 24 },
          end: { months: 60 },
          intervalText: "Every 6 months",
          modality: "Chest radiograph",
        },
      ],
    },
    citation: { page: "3329", location: "Table 2, section 2.4.1" },
    caveats: [
      "\"Year 0–2\" is as written in the source; dates are counted from the post-treatment reference date.",
      "Nothing is stated for chest imaging after year 5.",
    ],
    appliesTo: { pathway: ["sts"], subtype: ["myxoid_liposarcoma"] },
  },
  {
    id: "MLS-TECH-WBMRI",
    sourceId,
    section: "mri_protocol",
    category: "technical",
    title: "Myxoid liposarcoma: possible whole-body MRI protocol",
    quote: "A possible protocol contains at least coronal and axial STIR and a coronal T1w sequence",
    modality: "Whole-body MRI",
    citation: { page: "3331", location: "Discussion, special entities; Table 2, section 2.3.3" },
    caveats: [
      "Labelled a possible protocol in the source.",
      "Table 2, 2.3.3: \"For surveillance, the parameters of primary staging can be used.\"",
    ],
    appliesTo: { pathway: ["sts"], subtype: ["myxoid_liposarcoma"] },
  },

  // ---------- Entity-specific evidence gaps ----------
  {
    id: "ENT-GAP-SPECIFIC",
    sourceId,
    section: "exceptions",
    category: "evidence_gap",
    title: "Entity requires a specific follow-up strategy",
    quote: "Other entities which require specific follow-up imaging strategies",
    timing: NO_SOURCED_RECOMMENDATION,
    citation: {
      page: "3329",
      location: "Table 2, section 2.4.2",
      footnote: "Footnote e: \"Details are provided in the additional electronic material\"",
    },
    caveats: [
      "The supplementary material is not part of this prototype's source. The general schedule is shown for reference but may be modified for this entity — MDT review required.",
    ],
    appliesTo: { pathway: ["sts"], subtype: ENTITIES_WITH_SPECIFIC_STRATEGY },
  },
  {
    id: "ENT-GAP-RP-LPS",
    sourceId,
    section: "exceptions",
    category: "evidence_gap",
    title: "Retroperitoneal well-/de-differentiated liposarcoma requires a specific strategy",
    quote: "retroperitoneal (well-/) de-differentiated liposarcoma",
    timing: NO_SOURCED_RECOMMENDATION,
    citation: {
      page: "3329",
      location: "Table 2, section 2.4.2",
      footnote: "Footnote e: \"Details are provided in the additional electronic material\"",
    },
    caveats: [
      "The supplementary material is not part of this prototype's source. The general schedule is shown for reference but may be modified for this entity — MDT review required.",
    ],
    appliesTo: {
      pathway: ["sts"],
      subtype: ["well_differentiated_liposarcoma", "dedifferentiated_liposarcoma"],
      site: ["retroperitoneal"],
    },
  },

  // ---------- Desmoid-type fibromatosis (not a sarcoma) ----------
  {
    id: "DTF-WW",
    sourceId,
    section: "local",
    category: "entity_specific",
    title: "Watchful waiting for asymptomatic patients",
    quote: "A watchful waiting approach for asymptomatic patients is recommended.",
    citation: { page: "3330", location: "Table 3, section 3.2.1" },
    caveats: [],
    appliesTo: { pathway: ["desmoid"], desmoidSymptoms: ["asymptomatic"] },
  },
  {
    id: "DTF-MRI",
    sourceId,
    section: "local",
    category: "entity_specific",
    title: "Desmoid surveillance: MRI",
    quote: "MRI is preferred for surveillance. It should include T2w and contrast-enhanced sequences.",
    modality: "MRI with T2-weighted and contrast-enhanced sequences",
    coverage: "Lesion",
    timing: "At follow-up time points (see follow-up intervals)",
    citation: { page: "3330", location: "Table 3, section 3.2.1" },
    caveats: [],
    appliesTo: { pathway: ["desmoid"] },
    conditionalNotes: [
      {
        when: { mriContraindication: ["yes"] },
        text: "MRI contraindication recorded. No sourced alternative modality is given for desmoid surveillance — refer to MDT.",
        requiresMdt: true,
      },
      {
        when: { contrastContraindication: ["yes"] },
        text: "Contrast contraindication recorded. The paper states surveillance MRI should include contrast-enhanced sequences; no sourced alternative is given — refer to MDT.",
        requiresMdt: true,
      },
    ],
  },
  {
    id: "DTF-FIRST",
    sourceId,
    section: "intervals",
    category: "entity_specific",
    title: "First re-evaluation during watchful waiting",
    quote: "A watchful waiting approach should include a first re-evaluation within 8–12 weeks.",
    timing: "Within 8–12 weeks",
    schedule: {
      anchor: "surveillance_start",
      bands: [
        {
          label: "First re-evaluation",
          start: { weeks: 8 },
          end: { weeks: 12 },
          intervalText: "Within 8–12 weeks",
        },
      ],
    },
    citation: { page: "3330", location: "Table 3, section 3.2.1" },
    caveats: [
      "The source does not state the start point. Dates are counted from the clinician-entered surveillance start date.",
    ],
    appliesTo: { pathway: ["desmoid"], desmoidManagement: ["watchful_waiting"] },
  },
  {
    id: "DTF-SCHEDULE",
    sourceId,
    section: "intervals",
    category: "entity_specific",
    title: "Desmoid general follow-up scheme",
    quote:
      "General follow-up scheme by imaging every 3 months in the first year, then every 6 months up to the fifth year, and yearly thereafter in case of stable disease.",
    timing: "Year 1 onwards",
    schedule: {
      anchor: "surveillance_start",
      bands: [
        { label: "First year", start: { months: 0 }, end: { months: 12 }, intervalText: "Every 3 months" },
        { label: "Up to the fifth year", start: { months: 12 }, end: { months: 60 }, intervalText: "Every 6 months" },
        {
          label: "Thereafter",
          start: { months: 60 },
          end: null,
          intervalText: "Yearly",
          condition: "In case of stable disease",
        },
      ],
    },
    citation: { page: "3330", location: "Table 3, section 3.2.1" },
    caveats: [
      "Described in the source as a \"general\" scheme; it is not a universal schedule for every clinical situation.",
      "The source does not state the start point. Dates are counted from the clinician-entered surveillance start date.",
    ],
    appliesTo: { pathway: ["desmoid"] },
  },
  {
    id: "DTF-GAP-SYMPTOMATIC",
    sourceId,
    section: "exceptions",
    category: "evidence_gap",
    title: "Symptomatic desmoid",
    quote: "A watchful waiting approach for asymptomatic patients is recommended.",
    timing: NO_SOURCED_RECOMMENDATION,
    citation: { page: "3330", location: "Table 3, section 3.2.1" },
    caveats: [
      "The watchful-waiting recommendation is for asymptomatic patients. The paper gives no separate surveillance recommendation for symptomatic patients — MDT review required.",
    ],
    appliesTo: { pathway: ["desmoid"], desmoidSymptoms: ["symptomatic"] },
  },

  // ---------- Evidence limitations (all supported pathways) ----------
  {
    id: "STS-LIM-EVIDENCE",
    sourceId,
    section: "exceptions",
    category: "limitation",
    title: "Evidence base for routine follow-up",
    quote: "Still, there are no evidence-based recommendations for routine follow-up in surgically treated sarcomas.",
    citation: { page: "3328", location: "Table 2, section 2.1" },
    caveats: [
      "The schedule is expert consensus (Delphi). It is not shown to improve survival.",
    ],
    appliesTo: { pathway: ["sts"] },
  },
  {
    id: "STS-GEN-PATIENT",
    sourceId,
    section: "exceptions",
    category: "general",
    title: "Patient participation",
    quote:
      "Patients should be included by adequate information and encouragement to participate in the surveillance process",
    citation: { page: "3329", location: "Table 2, section 2.5" },
    caveats: [],
    appliesTo: { pathway: ["sts"] },
  },
  {
    id: "LIM-PANEL",
    sourceId,
    section: "exceptions",
    category: "limitation",
    title: "Scope of the consensus",
    quote:
      "The panelists came from European countries only. … these guidelines reflect the current knowledge and will require further updates in future.",
    citation: { page: "3331", location: "Discussion, Limitations" },
    caveats: [],
    appliesTo: { pathway: ["sts", "desmoid"] },
  },
] as const satisfies readonly EssrRule[];

export type EssrRuleId = (typeof ESSR_RULES)[number]["id"];
