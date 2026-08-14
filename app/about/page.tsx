import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import CountUp from "@/components/CountUp"
import Reveal from "@/components/Reveal"
import { site } from "@/lib/config"
import { products } from "@/lib/data"

const FACILITY = [
  { src: "/images/facility/building.webp", w: 1080, h: 568, caption: "Our facility in Oxford, United Kingdom", alt: "Exterior of the Biotech Life Sciences facility in Oxford" },
  { src: "/images/facility/manufacturing.webp", w: 1080, h: 573, caption: "Advanced peptide manufacturing facility — UK", alt: "Peptide manufacturing facility interior with process equipment and technicians" },
  { src: "/images/facility/quality-control.webp", w: 1080, h: 385, caption: "Quality control & testing — UK standards", alt: "Technician operating quality control and testing equipment" },
]

export const metadata: Metadata = {
  title: "About",
  description: "Biotech Life Sciences — a UK-based research peptide company founded in 2000, supplying documented research-grade compounds worldwide.",
}

const VALUES = [
  ["Science First", "We put science at the heart of everything we do, ensuring our products support meaningful research and innovation."],
  ["Quality Without Compromise", "From raw materials to final product, we follow strict quality-control measures to ensure exceptional purity and consistency."],
  ["Innovation", "We continuously invest in advanced technologies and processes to stay ahead and deliver superior solutions."],
  ["Integrity", "We believe in honesty, transparency, and ethical practices in every partnership we build."],
  ["Customer Focus", "Our customers' success is our success. We are dedicated to building long-term relationships through trust and support."],
]

export default function AboutPage() {
  return (
    <>
      <section className="section alt">
        <div className="container split center">
          <Reveal>
            <span className="eyebrow">About us</span>
            <h1 className="h-section">Advancing Science Through Innovation</h1>
            <p style={{ color: "var(--ink-2)", fontSize: 16, marginBottom: 14 }}>
              For more than 25 years, Biotech Life Sciences has been committed to supporting scientific
              advancement through the development and supply of premium-quality research peptides. Founded
              in {site.founded} and headquartered in the United Kingdom, our company has earned the trust of
              researchers and distributors by maintaining exceptional standards of quality, consistency, and innovation.
            </p>
            <p style={{ color: "var(--ink-2)", fontSize: 16 }}>
              We understand that reliable research begins with reliable products. Every peptide is manufactured
              using advanced production techniques and undergoes rigorous quality control to ensure purity,
              stability, and batch-to-batch consistency.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <div className="grid-2" style={{ gap: 14 }}>
              {[
                [<CountUp key="y" to={25} suffix="+" />, "Years of excellence"],
                [<CountUp key="p" to={products.length} suffix="+" />, "Research compounds"],
                [<CountUp key="c" to={50} suffix="+" />, "Countries served"],
                ["UK", `Based in ${site.location.split(",")[0]}`],
              ].map(([v, l], i) => (
                <div key={i} className="card" style={{ padding: "26px 22px", textAlign: "center" }}>
                  <b style={{ fontSize: 30, letterSpacing: "-0.02em" }}>{v}</b>
                  <div className="small" style={{ marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ position: "relative", overflow: "hidden" }}>
        <span className="molecular-layer tr" aria-hidden="true" />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <span className="eyebrow">Where it's made</span>
            <h2 className="h-section">Our facility</h2>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 24 }}>
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

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Mission &amp; vision</span>
            <div className="grid-2" style={{ marginTop: 22 }}>
              <div className="card" style={{ padding: 30 }}>
                <h3 style={{ fontSize: 20, marginBottom: 10 }}>Our Mission</h3>
                <p style={{ color: "var(--ink-2)", fontSize: 15 }}>
                  To advance scientific research by providing premium research peptides manufactured to the
                  highest standards of quality, precision, and reliability.
                </p>
              </div>
              <div className="card" style={{ padding: 30 }}>
                <h3 style={{ fontSize: 20, marginBottom: 10 }}>Our Vision</h3>
                <p style={{ color: "var(--ink-2)", fontSize: 15 }}>
                  To be recognized as the world's leading biotechnology company for research peptides, setting
                  new benchmarks in innovation, product quality, and customer trust.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Core values</span>
            <h2 className="h-section">What we stand for</h2>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 24 }}>
            {VALUES.map(([t, d], i) => (
              <Reveal key={t as string} delay={(i % 3) as 0 | 1 | 2}>
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

      <section className="section">
        <div className="container" style={{ textAlign: "center", maxWidth: 720 }}>
          <Reveal>
            <h2 className="h-section">We support research worldwide</h2>
            <p className="lede" style={{ margin: "0 auto 26px" }}>
              Research laboratories · Universities &amp; academic institutions · Biotechnology companies ·
              Pharmaceutical research · Contract research organizations · Research distributors
            </p>
            <Link href="/contact" className="btn primary">Get in touch</Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
