import DiagramFrame from "./DiagramFrame"

export default function DilutionDiagram() {
  return (
    <DiagramFrame
      title="Reconstitution arithmetic"
      caption="Peptide mass ÷ diluent volume = solution concentration. Laboratory arithmetic only — not a dosing instruction."
    >
      <svg width="400" height="140" viewBox="0 0 400 140" role="img" aria-labelledby="dil-title dil-desc">
        <title id="dil-title">Diagram of reconstitution arithmetic</title>
        <desc id="dil-desc">
          A vial containing ten milligrams of peptide, combined with two milliliters of diluent, equals a
          resulting concentration of five milligrams per milliliter.
        </desc>

        <rect x="20" y="40" width="50" height="60" rx="6" fill="var(--glow-a)" opacity={0.25} stroke="var(--glow-a)" strokeWidth={1.5} />
        <text x="45" y="120" textAnchor="middle" fontSize="12" fill="var(--ink)">10 mg</text>

        <text x="100" y="76" textAnchor="middle" fontSize="20" fill="var(--muted)">+</text>

        <rect x="130" y="40" width="50" height="60" rx="6" fill="var(--glow-b)" opacity={0.25} stroke="var(--glow-b)" strokeWidth={1.5} />
        <text x="155" y="120" textAnchor="middle" fontSize="12" fill="var(--ink)">2 mL</text>

        <text x="210" y="76" textAnchor="middle" fontSize="20" fill="var(--muted)">=</text>

        <rect x="240" y="30" width="140" height="80" rx="8" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth={1} />
        <text x="310" y="65" textAnchor="middle" fontSize="16" fontWeight={600} fill="var(--ink)">5 mg/mL</text>
        <text x="310" y="85" textAnchor="middle" fontSize="10" fill="var(--muted)">resulting concentration</text>
      </svg>
    </DiagramFrame>
  )
}
