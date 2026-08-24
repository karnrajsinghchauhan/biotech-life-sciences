import type { Metadata } from "next"
import Link from "next/link"
import { products } from "@/lib/data"
import ShopProductCard from "@/components/ShopProductCard"
import Reveal from "@/components/Reveal"
import { site } from "@/lib/config"

export const metadata: Metadata = {
  title: "Research Pens",
  description: "Pre-filled, multi-dose research pen devices — same RUO standard and batch documentation as every other product in the catalogue.",
}

export default function PensPage() {
  const pens = products.filter((p) => p.deviceType === "pen")

  return (
    <>
      <section className="section tight alt">
        <div className="container">
          <span className="eyebrow">🖊️ Delivery-device research</span>
          <h1 className="h-section">Pre-filled research pens</h1>
          <p className="lede">
            The same compounds, purity specification and batch documentation as the vial catalogue —
            supplied in a pre-filled, multi-dose pen device for laboratory research into delivery-device
            consistency and dosing precision.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid-4">
            {pens.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4 > 2 ? 3 : (i % 4)) as 0 | 1 | 2 | 3}>
                <ShopProductCard p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight alt">
        <div className="container split wideleft">
          <div>
            <span className="eyebrow">Why a pen format</span>
            <h2 className="h-section" style={{ fontSize: 26 }}>Same standard, different device</h2>
            <p style={{ color: "var(--ink-2)", maxWidth: 620 }}>
              A pen format is useful in research contexts that specifically study delivery-device
              consistency and dosing precision, alongside a compound's established research applications.
              It changes the device, not the standard — every pen carries the same purity specification,
              batch traceability and disclaimer as the equivalent vial.
            </p>
            <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/products" className="btn ghost sm">Full catalogue</Link>
              <Link href="/coa" className="btn ghost sm">Verify a COA</Link>
              <Link href="/wholesale" className="btn primary sm">Bulk enquiry</Link>
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <b style={{ fontSize: 15 }}>{site.disclaimer}</b>
          </div>
        </div>
      </section>
    </>
  )
}
