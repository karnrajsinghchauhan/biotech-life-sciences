import DiagramFrame from "./DiagramFrame"

const BARS = [
  { x: 60, h: 14 }, { x: 100, h: 22 }, { x: 140, h: 40 }, { x: 180, h: 150 },
  { x: 220, h: 55 }, { x: 260, h: 18 }, { x: 300, h: 10 }, { x: 340, h: 6 },
]

export default function MassSpecDiagram() {
  return (
    <DiagramFrame
      title="ESI-MS spectrum (illustrative)"
      caption="A worked example: the tallest peak is the observed molecular mass, matching the theoretical sequence mass."
    >
      <svg width="400" height="200" viewBox="0 0 400 200" role="img" aria-labelledby="ms-title ms-desc">
        <title id="ms-title">Illustrative mass spectrum</title>
        <desc id="ms-desc">
          A stick plot showing signal strength across a range of mass-to-charge ratios, with one dominant labeled peak
          representing the observed molecular mass.
        </desc>

        <line x1="20" y1="170" x2="380" y2="170" stroke="var(--line-strong)" strokeWidth={1} />
        <line x1="20" y1="20" x2="20" y2="170" stroke="var(--line-strong)" strokeWidth={1} />

        {BARS.map((b) => (
          <rect key={b.x} x={b.x - 4} y={170 - b.h} width={8} height={b.h} rx={2} fill="var(--glow-a)" opacity={b.h === 150 ? 1 : 0.55} />
        ))}

        <text x="180" y="10" textAnchor="middle" fontSize="11" fill="var(--ink)">Observed: 1418.6 Da</text>

        <text x="200" y="192" textAnchor="middle" fontSize="11" fill="var(--muted)">m/z</text>
        <text x="12" y="95" textAnchor="middle" fontSize="11" fill="var(--muted)" transform="rotate(-90 12 95)">Relative intensity (%)</text>
      </svg>
    </DiagramFrame>
  )
}
