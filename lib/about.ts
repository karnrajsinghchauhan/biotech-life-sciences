import { site } from "./config"
import { products } from "./data"

export type AboutStat = { value: string; label: string }
export type AboutValue = { title: string; body: string }

export const aboutContent = {
  heroLead:
    `Biotech Life Sciences has supplied documented research peptides since ${site.founded}, from ` +
    `${site.location}. Every batch that reaches a researcher is traceable back through a Certificate ` +
    `of Analysis to the partner that made it and the checks it passed before release.`,

  sourcingParagraph:
    "We don't operate the synthesis line. Every compound is made by an audited, vetted manufacturing " +
    "partner and characterized before it's accepted into our catalogue — we build trust through the " +
    "documentation that follows each batch, not through claiming a factory we don't run.",

  facilityParagraph:
    "What we do operate is our own facility in Oxford. Every batch that clears a partner's release is " +
    "received, quality-checked against its own Certificate of Analysis, repackaged and labeled for " +
    "dispatch, and stored there until it ships — the synthesis happens with our partners, the final " +
    "check and everything after it happens with us.",

  testingParagraph:
    "Purity and identity are confirmed by RP-HPLC and mass spectrometry on every released batch, the " +
    "same as any credible research supplier. Beyond that baseline, batches are also screened for heavy " +
    "metals and for endotoxins and residual solvents — the panel most suppliers stop short of, and the " +
    "one that actually determines whether a research material is safe to bring into a lab at all.",

  stats: [
    { value: String(site.founded), label: "Supplying research peptides since" },
    { value: `${products.length}+`, label: "Research compounds in the catalogue" },
    { value: "Oxford", label: `Own facility, ${site.location}` },
  ] satisfies AboutStat[],

  values: [
    {
      title: "Documentation before claims",
      body: "A batch number that doesn't resolve to a real Certificate of Analysis is treated as a defect, not a formality.",
    },
    {
      title: "Vetted partners, audited",
      body: "Manufacturing partners are checked against GMP-adjacent process standards before a single batch is accepted.",
    },
    {
      title: "The check that's ours",
      body: "Synthesis happens with our partners. QC, repackaging, storage and dispatch happen at our own Oxford facility.",
    },
  ] satisfies AboutValue[],
}
