import Link from "next/link"
import Reveal from "./Reveal"
import { testimonials, PLACEHOLDER_COUNT, Testimonial } from "@/lib/testimonials"

// Renders real customer testimonials when lib/testimonials.ts contains any,
// and clearly-labelled placeholders when it does not. The placeholder state is
// deliberate: an empty slot that says so is more credible than an invented quote.

function VerifiedBadge() {
  return (
    <span className="verified-badge">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Verified Customer
    </span>
  )
}

function AvatarFallback() {
  return (
    <span className="tcard-avatar" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
      </svg>
    </span>
  )
}

function RealCard({ t }: { t: Testimonial }) {
  return (
    <article className="tcard">
      <p className="tcard-quote">“{t.quote}”</p>
      <div className="tcard-foot">
        {t.avatar ? (
          // Only ever a customer-supplied photograph — never stock imagery.
          <img className="tcard-avatar" src={t.avatar} alt="" width={42} height={42} />
        ) : (
          <AvatarFallback />
        )}
        <div style={{ flex: 1 }}>
          <div className="tcard-name">{t.name ?? "Verified Customer — Name withheld"}</div>
          <div className="tcard-meta">
            {[t.location, t.useCase].filter(Boolean).join(" · ") || "Details withheld at customer request"}
          </div>
        </div>
        {t.verified && <VerifiedBadge />}
      </div>
    </article>
  )
}

function PlaceholderCard() {
  return (
    <article className="tcard pending" aria-label="Testimonial slot pending verification">
      <p className="tcard-quote">
        Customer testimonial pending verification. We publish a quote only once we hold the
        customer’s own words and their permission to share them.
      </p>
      <div className="tcard-foot">
        <AvatarFallback />
        <div style={{ flex: 1 }}>
          <div className="tcard-name" style={{ color: "var(--muted)" }}>Awaiting verified customer</div>
          <div className="tcard-meta">No testimonial published in this slot</div>
        </div>
      </div>
    </article>
  )
}

export default function Testimonials() {
  const hasReal = testimonials.length > 0
  return (
    <section className="section alt">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Customer experience</span>
          <h2 className="h-section">What our customers say</h2>
          <p className="lede">
            Customer experience is a separate category from laboratory testing and from published
            research — we keep the three clearly apart. Quotes appear here only after we have verified
            them against a real order.
          </p>
        </Reveal>

        <div className="grid-3" style={{ marginTop: 30 }}>
          {hasReal
            ? testimonials.slice(0, 6).map((t, i) => (
                <Reveal key={i} delay={(i % 3) as 0 | 1 | 2}>
                  <RealCard t={t} />
                </Reveal>
              ))
            : Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                <Reveal key={i} delay={(i % 3) as 0 | 1 | 2}>
                  <PlaceholderCard />
                </Reveal>
              ))}
        </div>

        {!hasReal && (
          <Reveal delay={1}>
            <div className="notice blue" style={{ marginTop: 26, maxWidth: 760 }}>
              <b>No testimonials are published yet.</b> Rather than fill this section with invented
              quotes or stock photographs, we have left it empty until real customers give us their
              words and permission. In the meantime, the evidence worth judging us on is the{" "}
              <Link href="/batch-reports" style={{ textDecoration: "underline" }}>batch documentation</Link>.
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
