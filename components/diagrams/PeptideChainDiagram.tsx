import DiagramFrame from "./DiagramFrame"

const RESIDUE_X = [40, 100, 160, 220, 280, 340]

export default function PeptideChainDiagram() {
  return (
    <DiagramFrame
      title="Peptide chain structure"
      caption="A short peptide: amino-acid residues linked end-to-end by peptide bonds."
    >
      <svg width="400" height="140" viewBox="0 0 400 140" role="img" aria-labelledby="pcd-title pcd-desc">
        <title id="pcd-title">Diagram of a peptide chain</title>
        <desc id="pcd-desc">
          Six connected circles represent amino-acid residues in a chain, from the N-terminus on the left
          to the C-terminus on the right, joined by peptide bonds.
        </desc>

        {RESIDUE_X.slice(0, -1).map((x, i) => (
          <line key={`bond-${i}`} x1={x} y1={70} x2={RESIDUE_X[i + 1]} y2={70} stroke="var(--line-strong)" strokeWidth={2} />
        ))}

        {RESIDUE_X.map((x, i) => (
          <circle key={`residue-${i}`} cx={x} cy={70} r={16} fill={i % 2 === 0 ? "var(--glow-a)" : "var(--glow-b)"} opacity={0.85} />
        ))}

        <line x1={160} y1={54} x2={160} y2={30} stroke="var(--muted)" strokeWidth={1} />
        <text x="160" y="22" textAnchor="middle" fontSize="11" fill="var(--ink-2)">Peptide bond</text>

        <text x="40" y="110" textAnchor="middle" fontSize="11" fill="var(--muted)">N-terminus</text>
        <text x="340" y="110" textAnchor="middle" fontSize="11" fill="var(--muted)">C-terminus</text>
      </svg>
    </DiagramFrame>
  )
}
