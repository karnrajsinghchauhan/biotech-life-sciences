import DiagramFrame from "./DiagramFrame"
import { evidenceLevels, type EvidenceLevel } from "@/lib/evidence"

const ORDER: EvidenceLevel[] = ["established", "clinical", "investigational", "preclinical", "limited"]

export default function EvidenceLevelDiagram() {
  return (
    <DiagramFrame
      title="Evidence-level scale"
      caption="The same vocabulary used on every research-application badge across the catalogue, strongest to weakest."
    >
      <svg width="440" height="120" viewBox="0 0 440 120" role="img" aria-labelledby="ev-title ev-desc">
        <title id="ev-title">Diagram of the evidence-level scale</title>
        <desc id="ev-desc">
          Five rungs from strongest to weakest evidence, each with its own definition.
        </desc>
        {ORDER.map((key, i) => {
          const x = 20 + i * 84
          const def = evidenceLevels[key]
          return (
            <g key={key}>
              <rect x={x} y={20} width={68} height={10} rx={5} fill="var(--glow-a)" opacity={1 - i * 0.16} />
              <text x={x + 34} y={50} textAnchor="middle" fontSize="11" fontWeight={600} fill="var(--ink)">{def.label}</text>
              <foreignObject x={x - 6} y={58} width="80" height="55">
                <div style={{ fontSize: 9.5, color: "var(--muted)", lineHeight: 1.35, textAlign: "center" }}>{def.definition}</div>
              </foreignObject>
            </g>
          )
        })}
      </svg>
    </DiagramFrame>
  )
}
