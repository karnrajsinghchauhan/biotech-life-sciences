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
  {
    compound: "PT-141 (Bremelanotide)",
    productSlug: "pt-141",
    application: "Melanocortin-receptor / sexual-function research",
    level: "established",
    description:
      "Bremelanotide is a melanocortin-4-receptor agonist that has completed randomized clinical trials for hypoactive sexual desire disorder in premenopausal women, the indication for which it holds regulatory approval in some jurisdictions.",
    sourceLabel: "Registered clinical trials (ClinicalTrials.gov)",
    sourceUrl: "https://clinicaltrials.gov/search?term=bremelanotide",
    note: "Approved medicines containing this molecule are prescribed and supervised by clinicians for a specific diagnosed condition. Nothing here is a recommendation for self-administration.",
  },
  {
    compound: "Thymosin Alpha-1",
    productSlug: "thymosin-alpha-1",
    application: "Immune-signaling / immunomodulation research",
    level: "clinical",
    description:
      "Thymalfasin (thymosin alpha-1) has been evaluated in human clinical trials and holds regulatory approval as an immune adjunct in a number of countries outside the United States, though not as an FDA-approved medicine.",
    sourceLabel: "Clinical and immunology literature (PubMed)",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+alpha+1+clinical+trial",
  },
  {
    compound: "Ipamorelin",
    productSlug: "ipamorelin",
    application: "Growth-hormone secretagogue research",
    level: "investigational",
    description:
      "Ipamorelin is studied as a selective ghrelin-receptor agonist for growth-hormone release, noted in the literature for reduced cortisol and prolactin co-release relative to earlier secretagogues. Human evidence remains early-stage outside the specific trials that have been run.",
    sourceLabel: "Endocrine research literature (PubMed)",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=ipamorelin+growth+hormone+secretagogue",
  },
  {
    compound: "TB-500 (Thymosin β4 fragment)",
    productSlug: "tb-500",
    application: "Preclinical research / tissue-repair research",
    level: "preclinical",
    description:
      "TB-500 is studied as an actin-binding fragment of thymosin beta-4 in cell-migration and wound-model research. As with BPC-157, the evidence base is predominantly preclinical, and human clinical data are limited.",
    sourceLabel: "Preclinical literature (PubMed)",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+beta-4+tissue+repair",
    note: "Predominantly animal and in-vitro studies. Findings in preclinical models frequently do not translate to humans.",
  },
  {
    compound: "Epitalon",
    productSlug: "epitalon",
    application: "Telomerase-activity / aging-biology research",
    level: "preclinical",
    description:
      "Epitalon (epithalon) is studied within the peptide-bioregulator literature, largely originating from Russian research groups, in relation to telomerase activity and pineal function. Rigorous, independently replicated human trial data are limited.",
    sourceLabel: "Preclinical and bioregulator literature (PubMed)",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=epitalon+OR+epithalon+telomerase",
    note: "Much of the underlying literature has not been independently replicated outside the originating research groups.",
  },
  {
    compound: "NAD+",
    productSlug: "nad-plus",
    application: "Cellular-energy / redox-biology research",
    level: "limited",
    description:
      "NAD+ is a well-characterized coenzyme central to cellular redox biology, but direct human evidence for exogenous NAD+ administration (as distinct from NAD+ precursor supplementation, which has its own separate literature) remains limited.",
    sourceLabel: "Cellular biology literature (PubMed)",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=NAD%2B+administration+human",
  },
  {
    compound: "Semax",
    productSlug: "semax",
    application: "Neurotrophin / cognition research",
    level: "investigational",
    description:
      "Semax is a registered nasal drug in Russia and has an associated body of Russian-language clinical literature, but it does not hold FDA or EMA approval and Western-language, independently replicated trial data are comparatively sparse.",
    sourceLabel: "Neuroscience literature (PubMed)",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=semax+peptide+cognition",
  },
]
