import DiagramFrame from "./DiagramFrame"

const TRACE_PATH =
  "M 20,150 L 60,148 L 90,146 L 120,140 L 150,60 L 165,20 L 180,60 L 210,144 " +
  "L 260,142 L 280,130 L 290,110 L 300,130 L 320,143 L 380,146"

export default function ChromatogramDiagram() {
  return (
    <DiagramFrame
      title="HPLC chromatogram (illustrative)"
      caption="A worked example: one dominant peak accounting for the large majority of peak area, one minor peak in the impurity range."
    >
      <svg width="400" height="200" viewBox="0 0 400 200" role="img" aria-labelledby="chrom-title chrom-desc">
        <title id="chrom-title">Illustrative HPLC chromatogram</title>
        <desc id="chrom-desc">
          A line trace of UV detector signal over elution time, showing one dominant peak labeled with a purity
          figure and one small labeled minor peak, plotted against time in minutes and detector signal at 220 nanometers.
        </desc>

        <line x1="20" y1="160" x2="380" y2="160" stroke="var(--line-strong)" strokeWidth={1} />
        <line x1="20" y1="20" x2="20" y2="160" stroke="var(--line-strong)" strokeWidth={1} />

        <path d={TRACE_PATH} fill="none" stroke="var(--glow-a)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        <circle cx="165" cy="20" r="3" fill="var(--glow-a)" />
        <text x="165" y="12" textAnchor="middle" fontSize="11" fill="var(--ink)">98.6%</text>

        <circle cx="290" cy="110" r="3" fill="var(--glow-a)" />
        <text x="290" y="102" textAnchor="middle" fontSize="10" fill="var(--muted)">1.1%</text>

        <text x="200" y="185" textAnchor="middle" fontSize="11" fill="var(--muted)">Retention time (min)</text>
        <text x="12" y="90" textAnchor="middle" fontSize="11" fill="var(--muted)" transform="rotate(-90 12 90)">Absorbance (220 nm)</text>
      </svg>
    </DiagramFrame>
  )
}
