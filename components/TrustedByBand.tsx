const CATEGORIES = [
  "Research laboratories",
  "Universities & academic institutions",
  "Biotechnology companies",
  "Contract research organizations",
  "Research distributors",
]

export default function TrustedByBand() {
  return (
    <div className="trusted-by-band">
      <span className="minimal-kicker">Trusted by</span>
      <div className="trusted-by-chips">
        {CATEGORIES.map((c) => (
          <span key={c} className="trusted-by-chip">{c}</span>
        ))}
      </div>
    </div>
  )
}
