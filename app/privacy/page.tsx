import type { Metadata } from "next"
import { site } from "@/lib/config"

export const metadata: Metadata = { title: "Privacy Policy" }

const SECTIONS: [string, string][] = [
  ["Information we collect", "When you place an order or contact us we collect the details you provide: name, email, phone, shipping address, organization, and order contents. We do not collect or store payment card numbers on this site."],
  ["How we use it", "Order details are used to fulfil and support your order, respond to inquiries, and meet record-keeping obligations. We do not sell personal data."],
  ["Analytics", "We may use privacy-conscious, aggregate analytics to understand site usage (pages viewed, searches). Analytics are not used to build individual profiles."],
  ["Data retention", "Order records are retained as required for accounting and compliance; inquiry messages are retained while relevant to support."],
  ["Your rights", "You may request a copy, correction, or deletion of your personal data at any time by contacting us."],
  ["Contact", `Privacy questions: ${site.email}.`],
]

export default function Page() {
  return (
    <section className="section tight">
      <div className="container" style={{ maxWidth: 760 }}>
        <span className="eyebrow">Legal</span>
        <h1 className="h-section">Privacy Policy</h1>
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
