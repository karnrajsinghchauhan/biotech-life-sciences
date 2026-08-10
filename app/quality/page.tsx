import type { Metadata } from "next"
import Link from "next/link"
import Reveal from "@/components/Reveal"

export const metadata: Metadata = {
  title: "Our Standards",
  description: "Quality assurance at Biotech Life Sciences — purity, identity verification, batch traceability, testing and documentation.",
}

const PROCESS = [
  ["Raw Material Inspection", "Verification of identity and purity of all incoming materials."],
  ["In-Process Control", "Continuous monitoring during synthesis and purification."],
  ["Analytical Testing", "Advanced testing for purity, potency and structural integrity."],
  ["Review & Approval", "Results reviewed by our quality experts and approved."],
  ["Final Product Testing", "Final verification before release of each batch."],
  ["Quality Release", "Only products that meet our strict standards are released."],
  ["Secure Delivery", "Safe, secure and temperature-conscious shipping."],
]

export default function QualityPage() {
  return (
    <>
      <section className="section alt">
        <div className="container" style={{ maxWidth: 800 }}>
          <span className="eyebrow">Quality assurance</span>
          <h1 className="h-section">Our Promise. Your Confidence.</h1>
          <p className="lede">
            Quality is not just a standard — it is the foundation of everything we do. Our quality assurance
            system ensures that every product we supply is reliable, reproducible, and suitable for demanding
            research applications.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Quality pillars</span>
            <h2 className="h-section">Five commitments on every batch</h2>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 24 }}>
            {[
              ["Premium Raw Materials", "We source only high-purity raw materials from trusted and qualified suppliers."],
              ["Rigorous Testing", "Every batch undergoes analytical testing to confirm identity and purity — RP-HPLC and mass spectrometry."],
              ["Batch Consistency", "Strict process control and in-process monitoring for consistent quality in every batch."],
              ["Documented Excellence", "Full traceability and documentation at every stage of manufacturing."],
              ["Continuous Improvement", "Ongoing investment in technology and quality systems."],
            ].map(([t, d], i) => (
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

      <section className="section alt">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Quality control process</span>
            <h2 className="h-section">From raw material to release</h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 24, maxWidth: 720 }}>
            {PROCESS.map(([t, d], i) => (
              <Reveal key={t} delay={(i % 3) as 0 | 1 | 2}>
                <div style={{ display: "flex", gap: 20, padding: "18px 0", borderBottom: "1px solid var(--line)" }}>
                  <span className="mono" style={{ color: "var(--blue)", fontSize: 13, minWidth: 30 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <b style={{ fontSize: 15.5 }}>{t}</b>
                    <p className="small">{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split center">
          <div>
            <span className="eyebrow">Documentation</span>
            <h2 className="h-section" style={{ fontSize: 26 }}>Every batch, on paper</h2>
            <p style={{ color: "var(--ink-2)" }}>
              A batch-specific Certificate of Analysis accompanies every released lot — RP-HPLC purity,
              mass-spectrometry identity, test date and status. Verify any batch number from your vial.
            </p>
            <div style={{ marginTop: 20 }}>
              <Link href="/coa" className="btn primary">Verify a COA →</Link>
            </div>
          </div>
          <div className="notice blue">
            We publish only claims we can document. Purity figures come from batch testing; capabilities and
            processes described here reflect our published quality materials. If a claim isn't on a document,
            it isn't on this site.
          </div>
        </div>
      </section>
    </>
  )
}
