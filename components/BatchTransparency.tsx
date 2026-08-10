import Link from "next/link"
import Reveal from "./Reveal"

const STEPS = [
  ["Batch Manufactured", "A lot is produced and assigned its batch number."],
  ["Sample Submitted for Testing", "A representative sample is drawn from that lot and sent for analysis."],
  ["Independent Laboratory Analysis", "The laboratory runs its own methods and reports its own values."],
  ["Results Documented", "Results are transcribed as reported — including anything not tested."],
  ["Batch Report Made Available", "The report is published against the batch number for review."],
]

export default function BatchTransparency() {
  return (
    <section className="section alt">
      <div className="container">
        <Reveal>
          <span className="eyebrow">100% Batch Transparency</span>
          <h2 className="h-section">Know exactly what you’re getting.</h2>
          <p className="lede">
            Every batch is documented. We believe customers should never have to rely on blind trust.
            Where applicable, we make the relevant batch documentation and laboratory reports available
            so the identity, purity and testing of a product can be independently reviewed.
          </p>
        </Reveal>

        <Reveal delay={1}>
          <div className="process-rail">
            {STEPS.map(([t, d], i) => (
              <div className="process-step" key={t}>
                <div className="bar"><i style={{ transitionDelay: `${i * 0.13}s` }} /></div>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <h4>{t}</h4>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={2}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 38 }}>
            <Link href="/batch-reports" className="btn primary">View Batch Reports</Link>
            <Link href="/coa" className="btn ghost">Verify Your Batch</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function TransparencyPromise() {
  return (
    <section className="section">
      <div className="container split wideleft center">
        <Reveal>
          <span className="eyebrow">Transparency over marketing</span>
          <h2 className="h-section" style={{ fontSize: 30 }}>Don’t just trust us. Verify the batch.</h2>
          <p style={{ color: "var(--ink-2)", fontSize: 16, maxWidth: 620 }}>
            We don’t expect you to take our word for it. Product documentation, batch information and
            laboratory reports should be available for independent review wherever applicable. If a
            result has not been tested, we say so. If evidence is limited, we say so. Our goal is to
            make the information behind every product as accessible and understandable as possible.
          </p>
        </Reveal>
        <Reveal delay={1}>
          <div className="glass" style={{ padding: 28 }}>
            {[
              ["If it wasn’t tested", "the report says “Not reported” — we never fill the gap with a number."],
              ["If evidence is limited", "the card says so, with the label that fits the actual literature."],
              ["If a batch isn’t in the registry", "verification fails rather than returning a reassuring result."],
            ].map(([a, b]) => (
              <div key={a} style={{ display: "flex", gap: 12, padding: "13px 0", borderBottom: "1px solid var(--line)" }}>
                <span style={{ color: "var(--teal)", flexShrink: 0, marginTop: 2 }} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <p style={{ fontSize: 14, color: "var(--ink-2)" }}><b style={{ color: "var(--ink)" }}>{a}</b>, {b}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
