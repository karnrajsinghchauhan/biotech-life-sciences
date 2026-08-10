import type { Metadata } from "next"
import { site } from "@/lib/config"

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "Returns and refunds policy for Biotech Life Sciences research materials.",
}

const POLICY: [string, string][] = [
  ["Damaged products", "If your order arrives damaged, contact support within 48 hours of delivery with your order number and photographs of the outer packaging, inner packaging and affected vials. Verified transit damage is replaced or refunded in full, including shipping."],
  ["Incorrect orders", "If you receive an item different from what you ordered, report it within 48 hours. We will dispatch the correct item at our cost; depending on the case we may arrange collection of the incorrect item unopened."],
  ["Missing items", "If an item listed on your order confirmation is missing from the parcel, report it within 48 hours with photos of the parcel contents and packaging, and we will investigate and resolve it with a replacement or refund."],
  ["Order cancellation", "Orders can be cancelled for a full refund at any point before dispatch. Once a consignment has been handed to the carrier it can no longer be cancelled."],
  ["Non-returnable products", "Because research compounds are temperature-sensitive materials whose integrity cannot be verified after leaving our custody, correctly supplied products cannot be returned or refunded once delivered. This does not affect your rights in respect of damaged, incorrect or missing items."],
  ["Claim requirements", "All claims require the order number, the batch number(s) involved, and clear photographs. Claims must be raised within 48 hours of the delivery scan."],
  ["Refund procedure", "Approved refunds are issued to the original payment method within 5–7 business days of approval. Replacements are dispatched as new consignments with fresh tracking."],
]

export default function ReturnsPage() {
  return (
    <>
      <section className="section tight alt">
        <div className="container" style={{ maxWidth: 800 }}>
          <span className="eyebrow">Policies</span>
          <h1 className="h-section">Returns &amp; Refunds</h1>
          <p className="lede">Fair, documented, and fast when something goes wrong in transit.</p>
        </div>
      </section>
      <section className="section tight">
        <div className="container" style={{ maxWidth: 800 }}>
          {POLICY.map(([t, d]) => (
            <div key={t} style={{ padding: "22px 0", borderBottom: "1px solid var(--line)" }}>
              <h2 style={{ fontSize: 19, marginBottom: 8 }}>{t}</h2>
              <p style={{ color: "var(--ink-2)", fontSize: 15 }}>{d}</p>
            </div>
          ))}
          <div className="notice" style={{ marginTop: 26 }}>
            This policy template is pending final legal review by the business before launch. To raise a claim,
            email {site.email} with your order number.
          </div>
        </div>
      </section>
    </>
  )
}
