// ============================================================
// EVIDENCE TAXONOMY & RESEARCH APPLICATIONS
//
// One consistent vocabulary for describing how strong the published
// evidence is for a given compound + application. Used on research
// cards and product pages.
//
// RULES FOR EDITING THIS FILE:
//  · Never use the word "proven" because a compound is popular online.
//  · The evidence level must describe THIS application, not the compound
//    in general. A compound can be ESTABLISHED for one indication and
//    PRECLINICAL for another.
//  · Every entry needs a real, checkable source link (PubMed, a
//    peer-reviewed journal, ClinicalTrials.gov, or a regulator).
//    Never cite forums, Reddit, TikTok or influencer content.
// ============================================================

export type EvidenceLevel =
  | "established"
  | "clinical"
  | "investigational"
  | "preclinical"
  | "limited"

export const evidenceLevels: Record<
  EvidenceLevel,
  { label: string; definition: string; tone: "teal" | "blue" | "slate" | "amber" }
> = {
  established: {
    label: "Established",
    definition: "Strong human clinical evidence and established medical use.",
    tone: "teal",
  },
  clinical: {
    label: "Clinical Research",
    definition:
      "Human clinical research exists, but the application shown may not represent an approved indication.",
    tone: "blue",
  },
  investigational: {
    label: "Investigational",
    definition: "Limited or early-stage human evidence.",
    tone: "slate",
  },
  preclinical: {
    label: "Preclinical",
    definition: "Primarily laboratory and animal research.",
    tone: "slate",
  },
  limited: {
    label: "Evidence Limited",
    definition:
      "Insufficient high-quality evidence to draw strong conclusions.",
    tone: "amber",
  },
}

export type ResearchApplication = {
  compound: string
  productSlug?: string // links to catalogue where we supply the compound
  application: string
  level: EvidenceLevel
  description: string
  /** Human-readable description of where the evidence lives. */
  sourceLabel: string
  /** Search-style links resolve reliably and let the reader see the whole
   *  body of literature rather than one cherry-picked paper. */
  sourceUrl: string
  note?: string
}

export const researchApplications: ResearchApplication[] = [
  {
    compound: "Semaglutide",
    productSlug: "semaglutide",
    application: "Metabolic health / obesity research",
    level: "established",
    description:
      "Semaglutide has been extensively studied in human clinical trials for weight management and metabolic disease. Published trials have demonstrated substantial reductions in body weight in appropriate patient populations.",
    sourceLabel: "Published clinical trial literature (PubMed)",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=semaglutide+weight+management+randomized+trial",
    note: "Approved medicines containing this molecule are prescribed and supervised by clinicians. Nothing here is a recommendation for self-administration.",
  },
  {
    compound: "Tirzepatide",
    productSlug: "tirzepatide",
    application: "Metabolic health / obesity research",
    level: "established",
    description:
      "Tirzepatide has been evaluated extensively in randomized clinical trials for obesity and metabolic disease. In a 72-week phase 3b trial, tirzepatide produced greater average weight reduction than semaglutide in adults with obesity without diabetes.",
    sourceLabel: "Head-to-head phase 3b trial literature (PubMed)",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=tirzepatide+versus+semaglutide+obesity+phase+3",
    note: "Approved medicines containing this molecule are prescribed and supervised by clinicians. Nothing here is a recommendation for self-administration.",
  },
  {
    compound: "Retatrutide",
    productSlug: "retatrutide",
    application: "Multi-receptor metabolic signaling research",
    level: "investigational",
    description:
      "Retatrutide is an investigational triple agonist of the GIP, GLP-1 and glucagon receptors. It has entered human trials, but it is not an approved medicine and the evidence base is earlier-stage than that for semaglutide or tirzepatide.",
    sourceLabel: "Registered clinical trials (ClinicalTrials.gov)",
    sourceUrl: "https://clinicaltrials.gov/search?term=retatrutide",
  },
  {
    compound: "BPC-157",
    productSlug: "bpc-157",
    application: "Preclinical research / tissue-repair research",
    level: "preclinical",
    description:
      "BPC-157 has attracted research interest in tissue repair and inflammatory processes. However, human clinical evidence remains limited, and much of the published evidence is preclinical.",
    sourceLabel: "Preclinical literature (PubMed)",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157",
    note: "Predominantly animal and in-vitro studies. Findings in preclinical models frequently do not translate to humans.",
  },
  {
    compound: "CJC-1295 / Ipamorelin",
    productSlug: "cjc-1295-no-dac",
    application: "Growth-hormone-axis research",
    level: "investigational",
    description:
      "These compounds have been investigated in relation to growth-hormone signaling and endocrine physiology. Evidence for many performance and recovery applications remains investigational.",
    sourceLabel: "Endocrine research literature (PubMed)",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=CJC-1295+OR+ipamorelin+growth+hormone",
  },
  {
    compound: "GHK-Cu",
    productSlug: "ghk-cu",
    application: "Dermal / skin biology research",
    level: "limited",
    description:
      "GHK-Cu has been investigated for biological effects involving skin and connective-tissue processes. Evidence varies substantially by application and study design.",
    sourceLabel: "Dermal science literature (PubMed)",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=GHK-Cu+copper+peptide+skin",
    note: "Study quality and endpoints differ widely across this literature. Results for one formulation or route do not generalize to others.",
  },
]
