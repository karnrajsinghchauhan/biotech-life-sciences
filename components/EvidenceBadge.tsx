import { EvidenceLevel, evidenceLevels } from "@/lib/evidence"

export default function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const e = evidenceLevels[level]
  return (
    <span className={`ev ${e.tone}`} title={e.definition}>
      {e.label}
    </span>
  )
}

export function EvidenceKey() {
  return (
    <div className="ev-key">
      {(Object.keys(evidenceLevels) as EvidenceLevel[]).map((k) => (
        <div key={k}>
          <EvidenceBadge level={k} />
          <p>{evidenceLevels[k].definition}</p>
        </div>
      ))}
    </div>
  )
}
