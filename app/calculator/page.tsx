import type { Metadata } from "next"
import Link from "next/link"
import ReconstitutionCalculator from "@/components/ReconstitutionCalculator"
import Reveal from "@/components/Reveal"

export const metadata: Metadata = {
  title: "Concentration & Dilution Calculator",
  description: "Laboratory dilution arithmetic — calculate solution concentration or required diluent volume for research use.",
}

export default function CalculatorPage() {
  return (
    <>
      <section className="section" style={{ background: "var(--navy)", color: "#fff" }}>
        <div className="container" style={{ maxWidth: 760, textAlign: "center" }}>
          <Reveal>
            <span className="eyebrow" style={{ color: "#7fb0ff", justifyContent: "center" }}>🧮 Laboratory tools</span>
            <h1 className="h-section" style={{ color: "#fff" }}>Concentration &amp; Dilution Calculator</h1>
            <p style={{ color: "rgba(255,255,255,0.75)" }}>
              Basic dilution arithmetic for laboratory research — not dosing guidance, and not a
              recommendation for any human or animal protocol.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section tight">
        <div className="container" style={{ maxWidth: 640 }}>
          <Reveal>
            <ReconstitutionCalculator />
          </Reveal>
        </div>
      </section>

      <section className="section tight alt">
        <div className="container" style={{ maxWidth: 640, textAlign: "center" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>Related</span>
          <h2 className="h-section" style={{ fontSize: 24 }}>Verify a batch or browse the catalogue</h2>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 16 }}>
            <Link href="/coa" className="btn ghost sm">Verify a COA</Link>
            <Link href="/products" className="btn ghost sm">Full catalogue</Link>
            <Link href="/library" className="btn primary sm">Research Library</Link>
          </div>
        </div>
      </section>
    </>
  )
}
