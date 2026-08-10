import type { Metadata } from "next"
import { site } from "@/lib/config"

export const metadata: Metadata = { title: "Terms of Service" }

const SECTIONS: [string, string][] = [
  ["Research use only", "All products are supplied exclusively for laboratory research use by suitably qualified individuals. By ordering you represent that materials will not be used for human or veterinary consumption, diagnosis, treatment, or prevention of disease, and that your use complies with the laws of your jurisdiction."],
  ["Ordering", "An order is an offer to purchase; it is accepted when we confirm dispatch. We may refuse or cancel orders that indicate non-research use, cannot be verified, or cannot lawfully be fulfilled to the destination."],
  ["Pricing & payment", "Prices are shown at checkout in your selected display currency; settlement occurs in the checkout currency stated. Orders are dispatched after payment confirmation."],
  ["Shipping & risk", "Risk in the goods passes on delivery. Claims for transit damage, incorrect or missing items must be raised within 48 hours of delivery per the Returns & Refunds policy."],
  ["Limitation of liability", "To the maximum extent permitted by law, our liability in respect of any order is limited to the amount paid for that order. We are not liable for consequential losses arising from use of research materials contrary to these terms."],
  ["Intellectual property", "Site content, branding and product documentation are the property of the company and may not be reproduced without permission."],
  ["Contact", `Questions about these terms: ${site.email}.`],
]

export default function Page() {
  return (
    <section className="section tight">
      <div className="container" style={{ maxWidth: 760 }}>
        <span className="eyebrow">Legal</span>
        <h1 className="h-section">Terms of Service</h1>
        {SECTIONS.map(([t, d]) => (
          <div key={t} style={{ padding: "18px 0", borderBottom: "1px solid var(--line)" }}>
            <h2 style={{ fontSize: 18, marginBottom: 6 }}>{t}</h2>
            <p style={{ color: "var(--ink-2)", fontSize: 15 }}>{d}</p>
          </div>
        ))}
        <div className="notice" style={{ marginTop: 24 }}>Template pending final legal review before launch.</div>
      </div>
    </section>
  )
}
