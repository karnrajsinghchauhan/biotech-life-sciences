export default function TopResearchAreas({ research }: { research: string[] }) {
  const top3 = research.slice(0, 3)
  return (
    <div className="top-research-areas">
      <span className="minimal-kicker">Top research areas</span>
      <ol>
        {top3.map((area, i) => (
          <li key={area}>
            <span className="top-research-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span>{area}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
