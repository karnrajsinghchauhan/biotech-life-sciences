import type { Metadata } from "next"
import Link from "next/link"
import { site, shipping } from "@/lib/config"

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description: "Dispatch, tracking, packaging and international shipping at Biotech Life Sciences.",
}

const SECTIONS: [string, string][] = [
  ["Dispatch", `Orders are dispatched after payment confirmation. ${shipping.dispatchNote}`],
  ["Tracking", "Every consignment ships with full tracking information. Your tracking number is emailed at dispatch, so you have complete visibility from our facility to your door."],
  ["Packaging", "Products ship in tamper-evident, high-density protective packaging with temperature-stable insulation to maintain product integrity in transit. Outer packaging is plain and discreet."],
  ["International shipping", "We deliver to researchers worldwide. International shipments follow IATA guidelines and are fully insured. Buyers are responsible for confirming that importation of research materials is permitted in their jurisdiction; any duties or import taxes are the buyer's responsibility."],
  ["Damaged shipments", "If a consignment arrives damaged, photograph the outer packaging and contents before opening further, and contact support within 48 hours of delivery with your order number. Documented transit damage is eligible for replacement or refund."],
  ["Delivery issues", "If tracking shows delivered but the parcel is missing, or a shipment is significantly delayed, contact support and we will open a carrier investigation and keep you updated until resolution."],
]

export default function ShippingPage() {
  return (
    <>
      <section className="section tight alt">
        <div className="container" style={{ maxWidth: 800 }}>
          <span className="eyebrow">Logistics</span>
          <h1 className="h-section">Shipping &amp; Delivery</h1>
          <p className="lede">Tracked, insured, temperature-conscious dispatch — worldwide.</p>
        </div>
      </section>
      <section className="section tight">
        <div className="container" style={{ maxWidth: 800 }}>
          {SECTIONS.map(([t, d]) => (
            <div key={t} style={{ padding: "22px 0", borderBottom: "1px solid var(--line)" }}>
              <h2 style={{ fontSize: 19, marginBottom: 8 }}>{t}</h2>
              <p style={{ color: "var(--ink-2)", fontSize: 15 }}>{d}</p>
            </div>
          ))}
          <div className="notice blue" style={{ marginTop: 26 }}>
            Delivery estimates are confirmed with your order confirmation and vary by destination. Questions
            before ordering? <Link href="/contact" style={{ textDecoration: "underline" }}>Contact support</Link> — {site.email}.
          </div>
        </div>
      </section>
    </>
  )
}
