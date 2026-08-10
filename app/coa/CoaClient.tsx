"use client"

import Link from "next/link"
import { useState } from "react"
import { coaRecords, CoaRecord, labById } from "@/lib/coa"
import { bySlug } from "@/lib/data"
import { site } from "@/lib/config"
import Reveal from "@/components/Reveal"
import LabCredentials from "@/components/LabCredentials"

export default function CoaClient() {
  const [q, setQ] = useState("")
  const [searched, setSearched] = useState(false)
  const [hits, setHits] = useState<CoaRecord[]>([])

  const run = (e?: React.FormEvent) => {
    e?.preventDefault()
    const s = q.trim().toLowerCase()
    if (!s) return
    // A hit requires a real record. There is no fallback that returns a
    // reassuring result for an unknown batch — that would defeat the point.
    setHits(
      coaRecords.filter(
        (r) =>
          r.batch.toLowerCase() === s ||
          r.reportNo.toLowerCase() === s ||
          r.sku.toLowerCase() === s
      )
    )
    setSearched(true)
  }

  return (
    <>
      <section className="section" style={{ background: "var(--navy)", color: "#fff" }}>
        <div className="container" style={{ maxWidth: 760, textAlign: "center" }}>
          <Reveal>
            <span className="eyebrow" style={{ color: "#7fb0ff", justifyContent: "center" }}>Laboratory documentation</span>
            <h1 className="h-section" style={{ color: "#fff" }}>Verify Your Batch</h1>
            <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: 28 }}>
              Enter your batch number to access the corresponding laboratory documentation.
            </p>
            <form onSubmit={run} style={{ display: "flex", gap: 10, maxWidth: 520, margin: "0 auto" }}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Enter Batch Number"
                aria-label="Batch number"
                style={{ flex: 1, padding: "14px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 15 }}
              />
              <button type="submit" className="btn blue">Verify Batch</button>
            </form>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12.5, marginTop: 14 }}>
              The batch number is printed on the vial and on the outer box.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section tight">
        <div className="container" style={{ maxWidth: 860 }}>
          {searched &&
            (hits.length === 0 ? (
              <div className="verify-result bad">
                <span className="verify-status bad">
                  <span className="verify-dot bad" aria-hidden="true">!</span>
                  Batch not found
                </span>
                <p style={{ color: "var(--ink-2)", fontSize: 14.5, margin: "12px 0 0" }}>
                  Batch not found. Please check the batch number printed on your product.
                </p>
                <p className="small" style={{ marginTop: 10 }}>
                  {coaRecords.length === 0
                    ? "No batch documentation has been published to this registry yet, so no batch number will return a result at this stage."
                    : "If the number is correct and still does not appear, do not use material you cannot verify."}{" "}
                  Contact <a href={`mailto:${site.email}`} style={{ textDecoration: "underline" }}>{site.email}</a> with
                  your order number and we will send the document directly.
                </p>
              </div>
            ) : (
              hits.map((r) => {
                const p = bySlug(r.productSlug)
                const lab = labById(r.labId)
                return (
                  <div key={r.batch} className="verify-result ok" style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <span className="verify-status ok">
                        <span className="verify-dot ok" aria-hidden="true">✓</span>
                        Batch verified
                      </span>
                      <span className="chip doc">{r.status}</span>
                    </div>
                    <table className="spec-table" style={{ marginTop: 16 }}>
                      <tbody>
                        <tr><td>Product</td><td>{p?.name || r.productSlug}</td></tr>
                        <tr><td>Batch number</td><td className="mono">{r.batch}</td></tr>
                        <tr><td>Test date</td><td>{r.testDate}</td></tr>
                        <tr><td>Laboratory</td><td>{lab?.name ?? <span className="not-reported">Not reported</span>}</td></tr>
                        <tr><td>Report number</td><td className="mono">{r.reportNo}</td></tr>
                        {r.parameters.map((prm) => (
                          <tr key={prm.name}>
                            <td>{prm.name}</td>
                            <td>{prm.result ?? <span className="not-reported">Not reported</span>}</td>
                          </tr>
                        ))}
                        <tr>
                          <td>Original report</td>
                          <td>
                            {r.pdf ? (
                              <a href={r.pdf} target="_blank" rel="noopener noreferrer" className="src-link">Open PDF →</a>
                            ) : (
                              <span className="not-reported">Not yet uploaded</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )
              })
            ))}

          <div className="split" style={{ marginTop: searched ? 36 : 0 }}>
            <div>
              <span className="eyebrow">How it works</span>
              <h2 className="h-section" style={{ fontSize: 24 }}>Batch traceability</h2>
              <p style={{ color: "var(--ink-2)", fontSize: 15 }}>
                Every released batch carries a batch number printed on the vial, the box and its
                laboratory report. This tool checks that number against the published registry and
                returns the recorded parameters exactly as the laboratory reported them — including
                anything marked “Not reported”.
              </p>
              <p className="small" style={{ marginTop: 12 }}>
                Learn to interpret the document itself in{" "}
                <Link href="/library/how-to-read-a-coa" style={{ color: "var(--blue)", fontWeight: 600 }}>How to Read a COA</Link>, or{" "}
                <Link href="/batch-reports" style={{ color: "var(--blue)", fontWeight: 600 }}>browse all batch reports</Link>.
              </p>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <b style={{ fontSize: 15 }}>Can’t find your batch?</b>
              <p className="small" style={{ margin: "8px 0 14px" }}>
                Newly released batches are added to the registry on a rolling basis. Email your order
                number and batch number and we’ll send the document directly.
              </p>
              <a href={`mailto:${site.email}`} className="btn ghost sm">Email {site.email}</a>
            </div>
          </div>
        </div>
      </section>

      <LabCredentials />
    </>
  )
}
