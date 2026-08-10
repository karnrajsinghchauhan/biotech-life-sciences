import Link from "next/link"
import Reveal from "./Reveal"
import EvidenceBadge, { EvidenceKey } from "./EvidenceBadge"
import { researchApplications } from "@/lib/evidence"

export default function ResearchApplications({ limit }: { limit?: number }) {
  const list = limit ? researchApplications.slice(0, limit) : researchApplications

  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Evidence, stated plainly</span>
          <h2 className="h-section">Research &amp; Applications</h2>
          <p className="lede">
            Peptides are studied across a range of biological and therapeutic applications. We
            distinguish published research from anecdotal claims and make the underlying evidence
            available wherever possible.
          </p>
        </Reveal>

        <div className="grid-3" style={{ marginTop: 30 }}>
          {list.map((r, i) => (
            <Reveal key={r.compound} delay={(i % 3) as 0 | 1 | 2}>
              <article className="card rcard">
                <div className="rcard-head">
                  <div>
                    <h3>{r.compound}</h3>
                    <div className="rcard-app">{r.application}</div>
                  </div>
                  <EvidenceBadge level={r.level} />
                </div>
                <p>{r.description}</p>
                {r.note && <p className="rcard-note">{r.note}</p>}
                <div className="rcard-foot">
                  <a className="src-link" href={r.sourceUrl} target="_blank" rel="noopener noreferrer">
                    View Research →
                  </a>
                  {r.productSlug && (
                    <Link href={`/products/${r.productSlug}`} className="small" style={{ fontWeight: 600 }}>
                      In catalogue
                    </Link>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={1}>
          <div style={{ marginTop: 44 }}>
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>How we label evidence</h3>
            <p className="small" style={{ marginBottom: 18, maxWidth: 720 }}>
              The same five labels are used everywhere on this site. A label describes the evidence for
              that specific application — a compound can be well-evidenced for one use and barely
              studied for another.
            </p>
            <EvidenceKey />
          </div>
        </Reveal>

        <Reveal delay={2}>
          <div className="notice" style={{ marginTop: 26 }}>
            Research findings are not product claims. Nothing in this section is a recommendation for
            self-administration, and none of the materials we supply are intended for human or
            veterinary use. Where a molecule also exists as an approved medicine, that medicine is
            prescribed and supervised by clinicians — which is a different thing from the research
            material sold here.
          </div>
        </Reveal>
      </div>
    </section>
  )
}
