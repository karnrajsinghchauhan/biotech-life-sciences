"use client"

import { useState } from "react"
import Reveal from "@/components/Reveal"
import { site } from "@/lib/config"

const PILLARS = [
  ["Bulk Research Orders", "Volume pricing tiers on catalogue compounds, with consolidated batch documentation."],
  ["Institutional Orders", "Universities, biotech companies and CROs — quotations, PO-based ordering and invoicing."],
  ["Laboratory Procurement", "Multi-compound consignments assembled against your procurement list."],
  ["Recurring Supply", "Standing schedules with reserved batches and consistent documentation."],
  ["Custom Requests", "Compounds not in the catalogue, quoted on request — availability never guaranteed until confirmed."],
]

export default function WholesaleClient({ defaultProduct }: { defaultProduct?: string }) {
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries())
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "wholesale", ...fd }),
      })
      if (!res.ok) throw new Error("Submission failed")
      setSent(true)
    } catch {
      setError(`Something went wrong — email us directly at ${site.email}.`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className="section alt">
        <div className="container" style={{ maxWidth: 820 }}>
          <span className="eyebrow">Institutional supply</span>
          <h1 className="h-section">Research Supply &amp; Wholesale</h1>
          <p className="lede">
            Bulk quantities, laboratory procurement and recurring supply — with the same batch documentation
            standard on every consignment.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid-3">
            {PILLARS.map(([t, d], i) => (
              <Reveal key={t} delay={(i % 3) as 0 | 1 | 2}>
                <div className="card" style={{ padding: 26, height: "100%" }}>
                  <span className="mono" style={{ color: "var(--blue)", fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ fontSize: 18, margin: "10px 0 8px" }}>{t}</h3>
                  <p className="small">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight alt">
        <div className="container" style={{ maxWidth: 760 }}>
          <span className="eyebrow">Get a quotation</span>
          <h2 className="h-section" style={{ fontSize: 26 }}>Request a Wholesale Quote</h2>
          {sent ? (
            <div className="card" style={{ padding: 32, textAlign: "center", marginTop: 16 }}>
              <b style={{ fontSize: 18 }}>Request received ✓</b>
              <p className="small" style={{ marginTop: 8 }}>
                Our team will respond with a quotation or follow-up questions, typically within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="card" style={{ padding: 30, marginTop: 16 }}>
              <div className="form-grid">
                {/* honeypot — hidden from people, filled by bots */}
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                <div className="field"><label>Name *</label><input name="name" required /></div>
                <div className="field"><label>Company / Institution *</label><input name="company" required /></div>
                <div className="field"><label>Email *</label><input name="email" type="email" required /></div>
                <div className="field"><label>Country *</label><input name="country" required /></div>
                <div className="field full"><label>Products of interest *</label><input name="products" required defaultValue={defaultProduct} placeholder="e.g. BPC-157 10 mg, GHK-Cu 100 mg…" /></div>
                <div className="field"><label>Approximate quantity *</label><input name="quantity" required placeholder="e.g. 50 vials / month" /></div>
                <div className="field"><label>Research application</label><input name="application" placeholder="e.g. preclinical tissue-repair models" /></div>
                <div className="field full"><label>Message</label><textarea name="message" rows={4} /></div>
              </div>
              {error && <div className="notice" style={{ marginTop: 16 }}>{error}</div>}
              <button className="btn primary wide" style={{ marginTop: 20 }} disabled={busy}>
                {busy ? "Sending…" : "Request Wholesale Quote"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
