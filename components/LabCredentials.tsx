import Reveal from "./Reveal"
import { laboratories } from "@/lib/coa"
import { site } from "@/lib/config"

// Renders real laboratory credentials from lib/coa.ts. Until a laboratory and
// its certificate are supplied, it states that plainly rather than implying an
// accreditation we cannot evidence. Accreditation claims are checkable against
// the accreditation body's public register — an incorrect one is worse than none.

export default function LabCredentials() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Independent laboratory testing</span>
          <h2 className="h-section">Who does the testing</h2>
          <p className="lede">
            Analytical results are only as meaningful as the laboratory behind them, so we name the
            laboratory and its accreditation scope on every report.
          </p>
        </Reveal>

        {laboratories.length === 0 ? (
          <Reveal delay={1}>
            <div className="notice" style={{ maxWidth: 780, marginTop: 24 }}>
              <b>Laboratory details are not yet published.</b> We will name the testing laboratory here,
              together with its accreditation scheme, certificate number and accredited scope, once those
              details are confirmed and we hold the certificate. We are not claiming an accreditation
              before then — for questions in the meantime, contact {site.email}.
            </div>
          </Reveal>
        ) : (
          <div className="grid-2" style={{ marginTop: 26 }}>
            {laboratories.map((l, i) => (
              <Reveal key={l.id} delay={(i % 3) as 0 | 1 | 2}>
                <div className="card" style={{ padding: 26 }}>
                  <h3 style={{ fontSize: 18 }}>{l.name}</h3>
                  {l.country && <p className="small">{l.country}</p>}
                  {l.accreditation ? (
                    <table className="spec-table" style={{ marginTop: 14 }}>
                      <tbody>
                        <tr><td>Scheme</td><td>{l.accreditation.scheme}</td></tr>
                        <tr><td>Certificate no.</td><td className="mono">{l.accreditation.number}</td></tr>
                        {l.accreditation.scope && <tr><td>Accredited scope</td><td>{l.accreditation.scope}</td></tr>}
                        {l.accreditation.registerUrl && (
                          <tr>
                            <td>Public record</td>
                            <td>
                              <a href={l.accreditation.registerUrl} target="_blank" rel="noopener noreferrer" className="src-link">
                                Verify on register →
                              </a>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <p className="small" style={{ marginTop: 12 }}>
                      No accreditation is claimed for this laboratory.
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={2}>
          <div className="notice blue" style={{ marginTop: 26, maxWidth: 860 }}>
            <b>What accreditation does and does not mean.</b> Accreditation applies to a defined scope of
            test methods, not to a laboratory as a whole, and not to the products it tests. Laboratory
            accreditation is not a product approval: it does not mean a compound is approved by any
            medicines regulator, and we make no such claim anywhere on this site.
          </div>
        </Reveal>
      </div>
    </section>
  )
}
