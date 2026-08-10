const ITEMS = [
  "Research-grade compounds",
  "Batch documentation",
  "HPLC & MS verified",
  "UK-based · founded 2000",
  "Worldwide research support",
  "For research purposes only",
]

export default function AnnouncementBar() {
  const seq = (
    <span aria-hidden="true">
      {ITEMS.map((t, i) => (
        <span key={i}>{t} •</span>
      ))}
    </span>
  )
  return (
    <div className="annbar" role="note" aria-label="Site notices">
      <div className="annbar-track">
        {seq}
        {seq}
      </div>
    </div>
  )
}
