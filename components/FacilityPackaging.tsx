import Image from "next/image"
import Reveal from "./Reveal"
import { site } from "@/lib/config"

// Packaging photography below is the company's own. We do not show
// "facility" photography because Biotech Life Sciences sources from
// manufacturing partners rather than operating its own synthesis facility —
// see the Sourcing & Quality section for the honest version of that claim.

const PACKAGING = [
  ["Tamper-evident packaging", "Each box is sealed with a tamper-evident hologram."],
  ["Secure & protective", "High-density foam insert protects the vial from movement and impact."],
  ["Temperature controlled", "Shipped in temperature-stable packaging to maintain stability."],
  ["Discreet shipping", "Plain, discreet outer packaging for complete confidentiality."],
  ["Global shipping", "Worldwide delivery with tracking and insurance."],
  ["Quality assured", "Every shipment meets strict quality and safety standards."],
]

export default function FacilityPackaging() {
  return (
    <>
      {/* ---------------- SOURCING & QUALITY ---------------- */}
      <section className="section alt" style={{ position: "relative", overflow: "hidden" }}>
        <span className="molecular-layer bl" aria-hidden="true" />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <span className="eyebrow">Sourcing &amp; quality</span>
            <h2 className="h-section">Vetted partners. Independently tested.</h2>
            <p className="lede">
              {site.name} is headquartered in {site.location}. We source research peptides from
              vetted, audited manufacturing partners rather than operating our own synthesis
              facility — every released batch carries a third-party Certificate of Analysis you
              can verify independently.
            </p>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 30 }}>
            {[
              ["Partner vetting", "Manufacturing partners are assessed for process controls and documentation before any batch is listed."],
              ["Independent testing", "Purity and identity are confirmed by third-party analytical testing, not self-certified."],
              ["Verifiable on paper", "Every released batch's COA is checkable on the COA Verification page — no claim without a document behind it."],
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

      {/* ---------------- PACKAGING ---------------- */}
      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Packaging &amp; shipping standards</span>
            <h2 className="h-section">Premium packaging. Global standards.</h2>
            <p className="lede">
              Every product is packaged with precision, protected with care, and delivered with
              integrity to researchers worldwide.
            </p>
          </Reveal>

          <div className="split center" style={{ marginTop: 34 }}>
            <Reveal>
              <figure className="photo-frame" style={{ background: "#000" }}>
                <Image
                  src="/images/packaging/box-and-vial.webp"
                  alt="Biotech Life Sciences product box shown open with the vial seated in its foam insert, alongside the closed box"
                  width={1180} height={576}
                  sizes="(max-width: 1024px) 92vw, 560px"
                  style={{ filter: "none" }}
                />
              </figure>
              <p className="small" style={{ marginTop: 12 }}>
                Box dimensions as published in the company catalogue: 3 × 2 × 1.4 inches (7.6 × 5.1 × 3.6 cm).
              </p>
            </Reveal>
            <Reveal delay={1}>
              <div>
                {PACKAGING.map(([t, d], i) => (
                  <div key={t} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
                    <span className="mono" style={{ color: "var(--muted)", minWidth: 26 }}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <b style={{ fontSize: 14.5 }}>{t}</b>
                      <p className="small">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <figure className="photo-frame" style={{ marginTop: 30, background: "#000" }}>
              <Image
                src="/images/packaging/box-faces.webp"
                alt="Front, back, top, bottom and open views of the Biotech Life Sciences product box"
                width={1240} height={340}
                sizes="(max-width: 1024px) 94vw, 1180px"
                style={{ filter: "none" }}
              />
              <figcaption className="photo-caption">Front · Back · Top · Bottom · Open view</figcaption>
            </figure>
          </Reveal>

          <Reveal delay={3}>
            <div className="notice" style={{ marginTop: 26 }}>
              For research purposes only. Not for human consumption. Store in a cool, dry place.
              Protect from light. Keep out of reach of children.
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
