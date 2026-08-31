import DiagramFrame from "./DiagramFrame"

const FIELDS = [
  { label: "Batch number", y: 40 },
  { label: "Purity (RP-HPLC)", y: 80 },
  { label: "Identity (MS)", y: 120 },
  { label: "Test date", y: 160 },
  { label: "Issuing lab", y: 200 },
]

export default function CoaAnatomyDiagram() {
  return (
    <DiagramFrame
      title="Anatomy of a Certificate of Analysis"
      caption="Five callouts worth checking on any lab report before trusting the results it describes."
    >
      <svg width="360" height="240" viewBox="0 0 360 240" role="img" aria-labelledby="coa-title coa-desc">
        <title id="coa-title">Diagram of a Certificate of Analysis document</title>
        <desc id="coa-desc">
          A document outline with five annotated callouts pointing to where each piece of information sits: which
          production run it came from, how pure it tested by liquid chromatography, how its identity was confirmed
          by mass spectrometry, when testing occurred, and which laboratory issued the report.
        </desc>

        <rect x="40" y="20" width="140" height="200" rx="4" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth={1} />
        {FIELDS.map((f) => (
          <rect key={f.label} x="56" y={f.y - 8} width="108" height="10" rx="2" fill="var(--line-strong)" />
        ))}

        {FIELDS.map((f) => (
          <g key={f.label}>
            <line x1="180" y1={f.y - 3} x2="220" y2={f.y - 3} stroke="var(--glow-a)" strokeWidth={1} />
            <text x="226" y={f.y} fontSize="12" fill="var(--ink-2)">{f.label}</text>
          </g>
        ))}
      </svg>
    </DiagramFrame>
  )
}
