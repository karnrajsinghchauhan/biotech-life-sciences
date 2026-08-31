import Reveal from "./Reveal"
import { aboutContent } from "@/lib/about"

export default function WhyTrustUs() {
  return (
    <section className="section alt why-trust-us">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Why trust us</span>
          <h2 className="h-section">What actually backs that up</h2>
        </Reveal>
        <div className="grid-3" style={{ marginTop: 26 }}>
          {aboutContent.trustReasons.map((r, i) => (
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
