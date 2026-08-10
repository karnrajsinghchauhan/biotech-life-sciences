"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { coaRecords, laboratories, labById, CoaRecord } from "@/lib/coa"
import { bySlug, products } from "@/lib/data"
import { site } from "@/lib/config"
import LabCredentials from "@/components/LabCredentials"

function ReportCard({ r, open, onToggle }: { r: CoaRecord; open: boolean; onToggle: () => void }) {
  const p = bySlug(r.productSlug)
  const lab = labById(r.labId)
  return (
    <div className="report-card">
      <button className="report-head" onClick={onToggle} aria-expanded={open}>
        <span>
          <b style={{ fontSize: 15.5 }}>{p?.name || r.productSlug}</b>
          <span className="small mono" style={{ display: "block", marginTop: 2 }}>
            Batch {r.batch} · Report {r.reportNo} · {r.testDate}
          </span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className={`chip ${r.status === "Released" ? "doc" : "type"}`}>{r.status}</span>
          <span className="pm" style={{ fontSize: 18, color: "var(--blue)", transform: open ? "rotate(45deg)" : "none", transition: "transform 0.25s", display: "inline-block" }}>+</span>
        </span>
      </button>
      {open && (
        <div className="report-body">
          <table className="param-table">
            <tbody>
              <tr><td style={{ color: "var(--muted)", width: "34%" }}>Product</td><td>{p?.name || r.productSlug}</td></tr>
              <tr><td style={{ color: "var(--muted)" }}>SKU</td><td className="mono">{r.sku}</td></tr>
              <tr><td style={{ color: "var(--muted)" }}>Batch number</td><td className="mono">{r.batch}</td></tr>
              <tr><td style={{ color: "var(--muted)" }}>Test date</td><td>{r.testDate}</td></tr>
              <tr><td style={{ color: "var(--muted)" }}>Laboratory</td><td>{lab?.name ?? <span className="not-reported">Not reported</span>}</td></tr>
              <tr>
                <td style={{ color: "var(--muted)" }}>Accreditation</td>
                <td>
                  {lab?.accreditation
                    ? `${lab.accreditation.scheme} — ${lab.accreditation.number}`
                    : <span className="not-reported">Not reported</span>}
                </td>
              </tr>
              <tr><td style={{ color: "var(--muted)" }}>Report number</td><td className="mono">{r.reportNo}</td></tr>
            </tbody>
          </table>

          <h4 style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", margin: "22px 0 4px", padding: "0 12px" }}>
            Reported parameters
          </h4>
          <table className="param-table">
            <thead>
              <tr><th>Parameter</th><th>Result</th><th>Method</th></tr>
            </thead>
            <tbody>
              {r.parameters.map((prm) => (
                <tr key={prm.name}>
                  <td>{prm.name}</td>
                  <td>{prm.result ?? <span className="not-reported">Not reported</span>}</td>
                  <td>{prm.method ?? <span className="not-reported">Not reported</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: "18px 12px 0" }}>
            {r.pdf ? (
              <a href={r.pdf} target="_blank" rel="noopener noreferrer" className="btn ghost sm">
                Open original laboratory report (PDF) →
              </a>
            ) : (
              <p className="small">Original document not yet uploaded for this batch. Request it from {site.email}.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function BatchReportsClient() {
  const [q, setQ] = useState("")
  const [product, setProduct] = useState("all")
  const [lab, setLab] = useState("all")
  const [openBatch, setOpenBatch] = useState<string | null>(null)

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return coaRecords.filter((r) => {
      const okQ =
        !s ||
        r.batch.toLowerCase().includes(s) ||
        r.reportNo.toLowerCase().includes(s) ||
        r.sku.toLowerCase().includes(s) ||
        r.testDate.includes(s) ||
        (bySlug(r.productSlug)?.name.toLowerCase().includes(s) ?? false)
      return okQ && (product === "all" || r.productSlug === product) && (lab === "all" || r.labId === lab)
    })
  }, [q, product, lab])

  return (
    <>
      <section className="section tight alt">
        <div className="container">
          <div className="breadcrumb" style={{ padding: 0, marginBottom: 18 }}>
            <Link href="/">Home</Link> / <span style={{ color: "var(--ink)" }}>Batch Reports</span>
          </div>
          <span className="eyebrow">Documentation registry</span>
          <h1 className="h-section">Batch Reports</h1>
          <p className="lede">
            Search released batch documentation by product, batch number, test date, laboratory or
            report number. Values are transcribed from the laboratory’s own report — where a parameter
            was not tested, it reads “Not reported”.
          </p>

          <div className="filter-bar" role="search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Batch, report no., SKU or date…"
              aria-label="Search batch reports"
              style={{ padding: "9px 16px", borderRadius: 999, border: "1px solid var(--line-strong)", minWidth: 250, outline: "none", background: "var(--surface)" }}
            />
            <select value={product} onChange={(e) => setProduct(e.target.value)} aria-label="Filter by product">
              <option value="all">All products</option>
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
            <select value={lab} onChange={(e) => setLab(e.target.value)} aria-label="Filter by laboratory">
              <option value="all">All laboratories</option>
              {laboratories.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            <span className="small" style={{ marginLeft: "auto" }}>
              {list.length} report{list.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container" style={{ maxWidth: 940 }}>
          {coaRecords.length === 0 ? (
            <div className="notice" style={{ maxWidth: 780 }}>
              <b>No batch reports are published yet.</b> This registry is live and will list every
              released batch once laboratory documentation is uploaded. We have deliberately left it
              empty rather than display specimen results that could be mistaken for real ones. If you
              hold a product and need its documentation now, email {site.email} with the batch number
              printed on the vial.
            </div>
          ) : list.length === 0 ? (
            <p className="lede">No reports match those filters.</p>
          ) : (
            list.map((r) => (
              <ReportCard
                key={r.batch}
                r={r}
                open={openBatch === r.batch}
                onToggle={() => setOpenBatch(openBatch === r.batch ? null : r.batch)}
              />
            ))
          )}

          <div className="card" style={{ padding: 26, marginTop: 26 }}>
            <b style={{ fontSize: 15 }}>Have a batch number to check?</b>
            <p className="small" style={{ margin: "8px 0 14px" }}>
              The verification tool checks a batch number against this same registry and tells you
              plainly whether it is there.
            </p>
            <Link href="/coa" className="btn blue sm">Verify Your Batch →</Link>
          </div>
        </div>
      </section>

      <LabCredentials />
    </>
  )
}
