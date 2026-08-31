import DiagramFrame from "./DiagramFrame"
import { bySlug } from "@/lib/data"

const SLUGS = ["epitalon", "pinealon", "cartalax", "chonluten", "cortagen", "pancregen"]
const ANGLES = [270, 330, 30, 90, 150, 210] // degrees, evenly spaced around the hub

export default function BioregulatorClassDiagram() {
  const cx = 200, cy = 150, r = 100

  return (
    <DiagramFrame
      title="Peptide bioregulator class"
      caption="Six catalogue compounds sharing a research lineage — see the Bioregulators article for sourcing context."
    >
      <svg width="400" height="300" viewBox="0 0 400 300" role="img" aria-labelledby="bio-title bio-desc">
        <title id="bio-title">Diagram of the peptide bioregulator compound class</title>
        <desc id="bio-desc">
          A central hub connects to six satellite nodes, one for each compound in this class.
        </desc>

        {SLUGS.map((slug, i) => {
          const angle = (ANGLES[i] * Math.PI) / 180
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          return <line key={`line-${slug}`} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line-strong)" strokeWidth={1} />
        })}

        <circle cx={cx} cy={cy} r={44} fill="var(--glow-gradient)" opacity={0.9} />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fontWeight={600} fill="var(--ink-dark)">Peptide</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fontWeight={600} fill="var(--ink-dark)">Bioregulators</text>

        {SLUGS.map((slug, i) => {
          const angle = (ANGLES[i] * Math.PI) / 180
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          const product = bySlug(slug)!
          return (
            <g key={slug}>
              <circle cx={x} cy={y} r={22} fill="var(--surface-2)" stroke="var(--glow-a)" strokeWidth={1.5} />
              <text x={x} y={y + 38} textAnchor="middle" fontSize="11" fill="var(--ink-2)">{product.name}</text>
            </g>
          )
        })}
      </svg>
    </DiagramFrame>
  )
}
