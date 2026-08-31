import type { Metadata } from "next"
import Link from "next/link"
import Reveal from "@/components/Reveal"
import WhyTrustUs from "@/components/WhyTrustUs"
import TrustedByBand from "@/components/TrustedByBand"
import { site } from "@/lib/config"
import { aboutContent } from "@/lib/about"

export const metadata: Metadata = {
  title: "About",
  description: "Biotech Life Sciences — a UK-based research peptide supplier founded in 2000, operating its own Oxford QC and dispatch facility.",
}

export default function AboutPage() {
  return (
    <>
      <section className="section alt">
        <div className="container split center">
          <Reveal>
            <span className="eyebrow">About us</span>
            <h1 className="h-section">Documentation first, always.</h1>
            <p style={{ color: "var(--ink-2)", fontSize: 16, marginBottom: 14 }}>{aboutContent.heroLead}</p>
            <p style={{ color: "var(--ink-2)", fontSize: 16 }}>{aboutContent.sourcingParagraph}</p>
          </Reveal>
          <Reveal delay={1}>
            <div className="grid-2" style={{ gap: 14 }}>
              {aboutContent.stats.map((s) => (
                <div key={s.label} className="card" style={{ padding: "26px 22px", textAlign: "center" }}>
                  <b style={{ fontSize: 26, letterSpacing: "-0.02em" }}>{s.value}</b>
                  <div className="small" style={{ marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Our Oxford facility</span>
            <h2 className="h-section">The check that's ours</h2>
            <p className="lede">{aboutContent.facilityParagraph}</p>
          </Reveal>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Testing</span>
            <h2 className="h-section">Beyond purity and identity</h2>
            <p className="lede">{aboutContent.testingParagraph}</p>
          </Reveal>
        </div>
      </section>

      <WhyTrustUs />

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">What we stand for</span>
            <div className="grid-3" style={{ marginTop: 24 }}>
              {aboutContent.values.map((v, i) => (
                <div key={v.title} className="card" style={{ padding: 26, height: "100%" }}>
                  <span className="mono" style={{ color: "var(--teal)", fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ fontSize: 18, margin: "10px 0 8px" }}>{v.title}</h3>
                  <p className="small">{v.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <TrustedByBand />

      <section className="section">
        <div className="container" style={{ textAlign: "center", maxWidth: 720 }}>
          <Reveal>
            <h2 className="h-section">We support research worldwide</h2>
            <p className="lede" style={{ margin: "0 auto 26px" }}>{site.disclaimer}</p>
            <Link href="/contact" className="btn primary">Get in touch</Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
