import type { Metadata } from "next"
import { site } from "@/lib/config"

export const metadata: Metadata = { title: "Privacy Policy" }

const LAST_UPDATED = "14 August 2026"

const SECTIONS: [string, string[]][] = [
  ["What we collect", [
    "Checkout & order details — when you buy through our Shopify-hosted checkout: name, email, shipping/billing address, phone (if provided), and order contents. Payment card details are entered directly into Shopify's PCI-compliant checkout and never reach our own servers or database.",
    "Enquiry details — when you use our contact, wholesale, or custom-request forms: name, email, company, country, product interest, quantity, and your message.",
    "A cart identifier cookie (btls_cart_id) — strictly necessary to keep your cart contents across page loads. It expires automatically after 14 days and contains no personal data itself, only a reference to your Shopify cart.",
    "Coarse IP address on enquiry submissions — used only to rate-limit spam, never for tracking or profiling.",
    "We do not run advertising pixels, analytics trackers, or any other data-collection scripts on this site beyond the above.",
  ]],
  ["How we use it", [
    "To process and fulfil orders (via Shopify) — lawful basis: performance of a contract.",
    "To respond to enquiries, wholesale requests, and custom-compound requests — lawful basis: legitimate interests.",
    "To prevent spam and abuse of our forms — lawful basis: legitimate interests.",
    "To meet UK tax and accounting record-keeping obligations — lawful basis: legal obligation.",
    "We do not currently operate an email marketing list. If that changes, sign-up will be opt-in and this policy will be updated before it launches.",
  ]],
  ["Who we share it with", [
    "Shopify — processes checkout, payment, and order fulfilment data as our payment and commerce provider. See Shopify's own Consumer Privacy Policy.",
    "Supabase — hosts the database that stores enquiry submissions.",
    "Google Sheets — only if this optional internal mirror is enabled for our own order-handling workflow; it never receives payment data.",
    "We do not sell personal data, and we do not share it for third-party advertising.",
  ]],
  ["Data retention", [
    "Order and payment records: retained by Shopify per their own retention schedule, and by us for up to 6 years to meet UK tax and accounting requirements.",
    "Enquiry records: retained while relevant to your enquiry and for up to 24 months afterward, then deleted or anonymised.",
    "Cart cookie: expires automatically after 14 days of inactivity.",
  ]],
  ["International transfers", [
    "Our service providers may process data outside the UK. Where that happens, we rely on their standard contractual clauses or equivalent safeguards recognised under UK GDPR.",
  ]],
  ["Your rights", [
    `Under UK GDPR you can request access to, correction of, or deletion of your personal data, object to or restrict our processing, or request portability, by emailing ${site.email}.`,
    "You can also complain to the UK Information Commissioner's Office (ico.org.uk) at any time.",
  ]],
  ["Children", [
    "Our services are intended for research professionals and are not directed at children. We do not knowingly collect data from anyone under 18.",
  ]],
  ["Contact", [`Biotech Life Sciences, Oxford, United Kingdom. Privacy questions: ${site.email}.`]],
]

export default function Page() {
  return (
    <section className="section tight">
      <div className="container" style={{ maxWidth: 760 }}>
        <span className="eyebrow">Legal</span>
        <h1 className="h-section">Privacy Policy</h1>
        <p className="small" style={{ marginBottom: 18 }}>Last updated: {LAST_UPDATED}</p>
        {SECTIONS.map(([t, items]) => (
          <div key={t} style={{ padding: "18px 0", borderBottom: "1px solid var(--line)" }}>
            <h2 style={{ fontSize: 18, marginBottom: 10 }}>{t}</h2>
            <ul style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 20, color: "var(--ink-2)", fontSize: 15 }}>
              {items.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
