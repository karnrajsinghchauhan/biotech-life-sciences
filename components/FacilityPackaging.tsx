import Image from "next/image"
import Reveal from "./Reveal"
import { site } from "@/lib/config"

// Every photograph in this file is the company's own, extracted from the
// catalogue PDF. No stock imagery is used.

const FACILITY = [
  { src: "/images/facility/manufacturing.webp", w: 1080, h: 573, caption: "Advanced peptide manufacturing facility — UK", alt: "Peptide manufacturing facility interior with process equipment and technicians" },
  { src: "/images/facility/building.webp", w: 1080, h: 568, caption: "Our facility in Oxford, United Kingdom", alt: "Exterior of the Biotech Life Sciences facility in Oxford" },
  { src: "/images/facility/quality-control.webp", w: 1080, h: 385, caption: "Quality control & testing — UK standards", alt: "Technician operating quality control and testing equipment" },
]

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
      {/* ---------------- FACILITY ---------------- */}
      <section className="section alt" style={{ position: "relative", overflow: "hidden" }}>
        <span className="molecular-layer bl" aria-hidden="true" />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <span className="eyebrow">Facility</span>
            <h2 className="h-section">Manufactured in the United Kingdom</h2>
            <p className="lede">
              {site.name} is headquartered in {site.location}. The photographs below are the
              company&rsquo;s own, supplied with its catalogue.
            </p>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 30 }}>
            {FACILITY.map((f, i) => (
              <Reveal key={f.src} delay={(i % 3) as 0 | 1 | 2}>
                <figure className="photo-frame" style={{ aspectRatio: "16 / 11" }}>
                  <Image src={f.src} alt={f.alt} width={f.w} height={f.h} sizes="(max-width: 720px) 92vw, 380px" />
                  <figcaption className="photo-caption">{f.caption}</figcaption>
                </figure>
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
