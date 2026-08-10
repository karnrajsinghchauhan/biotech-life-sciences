// ============================================================
// BATCH REPORT / COA REGISTRY
//
// THIS REGISTRY SHIPS EMPTY ON PURPOSE. NEVER INVENT A LABORATORY
// RESULT, A REPORT NUMBER, A TEST DATE, OR AN ACCREDITATION.
//
// A fabricated purity figure is the single most damaging thing that
// could appear on this site: it is the exact claim a buyer is trusting,
// and it is trivially disprovable. If a parameter was not tested,
// record `result: null` and the UI prints "Not reported" — which is
// both true and, to a technical buyer, more credible than a number.
//
// TO PUBLISH A REAL BATCH
//  1. Add the testing laboratory to `laboratories` below, using its
//     legal name. Only fill `accreditation` if you hold the certificate
//     and the number is correct — accreditation claims are checkable
//     against the accreditation body's public register.
//  2. Add one `BatchReport` per released lot, transcribing values from
//     the laboratory's own report. Do not round, restate or "tidy" them.
//  3. Drop the laboratory's PDF in /public/coa/ and set `pdf`.
//  4. Products with a released batch automatically show COA badges and
//     become verifiable on the /coa page.
// ============================================================

export type Accreditation = {
  /** The accreditation scheme exactly as awarded. */
  scheme: "ISO/IEC 17025" | "UKAS" | "Other"
  /** The accreditation number as printed on the certificate. */
  number: string
  /** Link to the accreditation body's public record, where one exists. */
  registerUrl?: string
  /** The accredited scope. Accreditation applies to a scope, not to a
   *  laboratory in general — state it so the claim is not overread. */
  scope?: string
}

export type Laboratory = {
  id: string
  name: string
  country?: string
  /** Omit entirely unless the certificate is held and current. */
  accreditation?: Accreditation
}

export const laboratories: Laboratory[] = [
  // Example of the shape — DELETE and replace with the real laboratory:
  // {
  //   id: "lab-1",
  //   name: "<Laboratory legal name>",
  //   country: "United Kingdom",
  //   accreditation: {
  //     scheme: "ISO/IEC 17025",
  //     number: "<certificate number>",
  //     registerUrl: "<link to public accreditation record>",
  //     scope: "<accredited scope, e.g. chromatographic purity testing>",
  //   },
  // },
]

/** A single tested parameter. `result: null` renders as "Not reported". */
export type TestParameter = {
  name: string
  /** Null means this parameter was NOT tested. Never substitute a value. */
  result: string | null
  /** Analytical method, e.g. "RP-HPLC, 220 nm". Null if not stated. */
  method: string | null
}

export type CoaRecord = {
  /** Batch number exactly as printed on the vial. */
  batch: string
  productSlug: string // must match a product slug in lib/data.ts
  sku: string
  /** ISO date of testing, e.g. "2026-08-01". */
  testDate: string
  /** Must match an id in `laboratories`. */
  labId: string
  /** The laboratory's own report/reference number. */
  reportNo: string
  /** Every parameter the laboratory actually reported. */
  parameters: TestParameter[]
  /** Path to the original document, e.g. "/coa/BT26-0001.pdf". */
  pdf?: string
  status: "Released" | "Superseded" | "Withdrawn"
}

export const coaRecords: CoaRecord[] = [
  // Intentionally empty — see the header of this file before adding anything.
]

export const labById = (id: string) => laboratories.find((l) => l.id === id)

/** Convenience: pull a named parameter's result, or null if not reported. */
export const param = (r: CoaRecord, name: string) =>
  r.parameters.find((p) => p.name.toLowerCase() === name.toLowerCase())?.result ?? null

export const findBatch = (q: string) =>
  coaRecords.filter(
    (r) =>
      r.batch.toLowerCase() === q.trim().toLowerCase() ||
      r.sku.toLowerCase() === q.trim().toLowerCase()
  )

export const coaForProduct = (slug: string) =>
  coaRecords.filter((r) => r.productSlug === slug && r.status === "Released")
