import Reveal from "./Reveal"

const REASONS = [
  {
    title: "Our own Oxford facility",
    body: "Every released batch is received, quality-checked, repackaged and stored at our facility in Oxford before it ships.",
  },
  {
    title: "Testing beyond the baseline",
    body: "HPLC purity and mass-spectrometry identity on every batch, plus heavy-metal and endotoxin/residual-solvent screening.",
  },
  {
    title: "A COA for every batch",
    body: "Batch number, purity and identity — checkable independently on the COA Verification page, not just asserted on this one.",
  },
]

export default function WhyTrustUs() {
  return (
    <section className="section alt why-trust-us">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Why trust us</span>
          <h2 className="h-section">What actually backs that up</h2>
        </Reveal>
        <div className="grid-3" style={{ marginTop: 26 }}>
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) as 0 | 1 | 2}>
              <div className="card why-trust-card" style={{ padding: 26, height: "100%" }}>
                <span className="why-trust-icon" aria-hidden="true" />
                <h3 style={{ fontSize: 17, margin: "14px 0 8px" }}>{r.title}</h3>
                <p className="small">{r.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
