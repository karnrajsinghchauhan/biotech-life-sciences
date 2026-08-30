import Link from "next/link"
import Reveal from "./Reveal"
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp"
import { site } from "@/lib/config"

const ITEMS = [
  {
    emoji: "🎓",
    title: `Supplying research since ${site.founded}`,
    body: `${new Date().getFullYear() - site.founded}+ years serving laboratories, universities and institutional researchers with consistent, documented supply.`,
    href: "/about",
    cta: "About us",
  },
  {
    emoji: "🧾",
    title: "Batch-documented, every time",
    body: "Every released batch carries a third-party Certificate of Analysis you can verify yourself, not just take our word for.",
    href: "/coa",
    cta: "Verify a COA",
  },
  {
    emoji: "🔬",
    title: "Independently tested",
    body: "Purity and identity are confirmed by third-party analytical testing — RP-HPLC and mass spectrometry, not self-certified.",
    href: "/quality",
    cta: "Our standards",
  },
  {
    emoji: "📦",
    title: "Discreet, tracked shipping",
    body: "Tamper-evident, temperature-stable packaging with tracking and insurance, shipped worldwide.",
    href: "/shipping",
    cta: "Shipping info",
  },
  {
    emoji: "💬",
    title: "Order on WhatsApp",
    body: "Skip the form — message us directly and we'll confirm sizing and availability in minutes.",
    href: buildGeneralWhatsAppLink(),
    cta: "Message us",
    external: true,
  },
  {
    emoji: "🤝",
    title: "Wholesale & volume pricing",
    body: "Laboratories, universities and institutions get tiered pricing on recurring or bulk research orders.",
    href: "/wholesale",
    cta: "Request a quote",
  },
  {
    emoji: "🛡️",
    title: "Research-use-only, stated everywhere",
    body: "The same disclaimer appears on every product, every page and every order confirmation — no fine print that contradicts the headline.",
    href: "/research-use-only",
    cta: "Read the policy",
  },
]

export default function TrustGrid() {
  return (
    <section className="section alt">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Why researchers order from us</span>
          <h2 className="h-section">Real standards, verifiable at every step</h2>
        </Reveal>
        <div className="grid-3 trust-grid" style={{ marginTop: 28 }}>
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) as 0 | 1 | 2}>
              <div className="card trust-card">
                <span className="trust-emoji" aria-hidden="true">{item.emoji}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <Link
                  href={item.href}
                  className="trust-link"
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                >
                  {item.cta} →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
