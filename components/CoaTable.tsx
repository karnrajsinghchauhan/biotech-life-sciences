import Link from "next/link"

export type CoaRow = { batch: string; testDate: string; purity: string; identity: string; pdf?: string }

export default function CoaTable({ coas }: { coas: CoaRow[] }) {
  if (coas.length === 0) {
    return (
      <div className="notice blue" style={{ maxWidth: 720 }}>
        Batch documents for current lots are supplied with your order and can be verified independently on the{" "}
        <Link href="/coa" style={{ textDecoration: "underline" }}>COA Verification page</Link> using the batch
        number printed on the vial.
      </div>
    )
  }
  return (
    <div className="card" style={{ overflow: "auto" }}>
      <table className="param-table" style={{ minWidth: 680 }}>
        <thead>
          <tr><th>Batch</th><th>Test date</th><th>Purity</th><th>Identity</th><th>Report</th></tr>
        </thead>
        <tbody>
          {coas.map((c) => (
            <tr key={c.batch}>
              <td className="mono">{c.batch}</td>
              <td>{c.testDate}</td>
              <td>{c.purity}</td>
              <td>{c.identity}</td>
              <td>{c.pdf ? <a href={c.pdf} style={{ color: "var(--blue)", fontWeight: 600 }}>View PDF →</a> : <span className="not-reported">Not uploaded</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
