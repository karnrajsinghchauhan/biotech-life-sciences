import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { products, bySlug, categoryBySlug } from "@/lib/data"
import { coaForProduct, param } from "@/lib/coa"
import { researchApplications } from "@/lib/evidence"
import EvidenceBadge from "@/components/EvidenceBadge"
import Vial from "@/components/Vial"
import ProductViewer from "@/components/ProductViewer"
import AddToCart from "@/components/AddToCart"
import ProductCard from "@/components/ProductCard"
import FAQList from "@/components/FAQList"
import Reveal from "@/components/Reveal"
import { site } from "@/lib/config"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = bySlug(params.slug)
  return p ? { title: `${p.name} — Research Compound`, description: p.overview.slice(0, 155) } : {}
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = bySlug(params.slug)
  if (!p) notFound()
  const cat = categoryBySlug(p.category)!
  const coas = coaForProduct(p.slug)
  const related = (p.related || []).map(bySlug).filter(Boolean)
  const evidence = researchApplications.find((r) => r.productSlug === p.slug)

  const productFaqs = [
    { q: `What is ${p.name} supplied for?`, a: `${p.name} is supplied strictly as a laboratory research material. It is not intended for human or veterinary consumption, diagnosis, treatment, or prevention of disease.` },
    { q: "How is this batch documented?", a: `Each released batch is manufactured to specification${p.purity ? ` (${p.purity})` : ""} with identity confirmation, and carries a batch-specific Certificate of Analysis. Verify any batch number on the COA Verification page.` },
    { q: "How should it be stored?", a: `${p.storage}.${p.stability ? ` Stability: ${p.stability} in unopened, correctly stored condition.` : ""}` },
    { q: "Is bulk or wholesale pricing available?", a: "Yes — laboratories and institutions can request volume pricing via the Research Supply & Wholesale page." },
  ]

  return (
    <>
      <div className="container breadcrumb">
        <Link href="/">Home</Link> / <Link href="/products">Products</Link> /{" "}
        <Link href={`/categories/${cat.slug}`}>{cat.name}</Link> / <span style={{ color: "var(--ink)" }}>{p.name}</span>
      </div>

      <section className="section tight">
        <div className="container split">
          {/* media */}
          <Reveal>
            {p.image ? (
              <ProductViewer
                src={p.image}
                alt={`${p.name} research vial${p.code ? ` (${p.code})` : ""} — Biotech Life Sciences`}
                code={p.code}
                sku={p.sku}
                form={p.form}
              />
            ) : (
              <div className="vial-stage" style={{ borderRadius: 20, border: "1px solid var(--line)", minHeight: 480, background: "radial-gradient(120% 90% at 50% 20%, #24272e 0%, #101216 55%, #08090b 100%)" }}>
                <span className="molecular-layer tr" aria-hidden="true" />
                <div style={{ zIndex: 2, alignSelf: "center" }}>
                  <Vial code={p.code} name={p.name} size={210} />
                </div>
                <span className="mono" style={{ position: "absolute", bottom: 16, left: 20, fontSize: 11, color: "var(--muted)", zIndex: 4 }}>
                  {p.sku}{p.code ? ` · ${p.code}` : ""} · {p.form}
                </span>
              </div>
            )}
          </Reveal>

          {/* buy panel */}
          <Reveal delay={1}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="pill-row">
                <Link href={`/categories/${cat.slug}`} className="pill" style={{ color: "var(--blue)", borderColor: "var(--blue-soft)", background: "var(--blue-soft)" }}>{cat.name}</Link>
                <span className="pill">{p.compoundType}</span>
                {p.isNew && <span className="flag new" style={{ alignSelf: "center" }}>New</span>}
                {p.bestSeller && <span className="flag best" style={{ alignSelf: "center" }}>Best Seller</span>}
              </div>
              <h1 style={{ fontSize: "clamp(30px,3.6vw,44px)" }}>{p.name}</h1>
              {p.altName && <p className="small" style={{ fontSize: 15 }}>{p.altName}</p>}
              <p style={{ color: "var(--ink-2)", fontSize: 15.5 }}>{p.overview}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "4px 0 8px" }}>
                {coas.length > 0
                  ? <span className="chip doc">✓ COA Available — {coas.length} released batch{coas.length > 1 ? "es" : ""}</span>
                  : <span className="chip type">Batch documentation supplied with order</span>}
                <span className="chip type">In stock</span>
              </div>
              <div className="card" style={{ padding: 22 }}>
                <AddToCart p={p} />
              </div>
              <div className="notice">
                {site.disclaimer}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* research overview */}
      <section className="section tight alt">
        <div className="container split wideleft">
          <div>
            <Reveal>
              <span className="eyebrow">Research overview</span>
              <h2 className="h-section" style={{ fontSize: 26 }}>Research areas</h2>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                {p.research.map((r) => (
                  <li key={r} style={{ display: "flex", gap: 10, alignItems: "baseline", fontSize: 15, color: "var(--ink-2)" }}>
                    <span style={{ width: 7, height: 7, borderRadius: 4, background: "var(--teal)", flexShrink: 0, transform: "translateY(-1px)" }} />
                    {r}
                  </li>
                ))}
              </ul>
              <p className="small" style={{ marginTop: 18, maxWidth: 560 }}>
                Descriptions reflect areas of published research interest for this compound class. They are
                not claims of efficacy or safety, and this material is not supplied for any therapeutic purpose.
              </p>
            </Reveal>
            {evidence && (
              <Reveal delay={1}>
                <div className="card" style={{ padding: 24, marginTop: 24, maxWidth: 620 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <b style={{ fontSize: 15 }}>Evidence level</b>
                      <div className="rcard-app">{evidence.application}</div>
                    </div>
                    <EvidenceBadge level={evidence.level} />
                  </div>
                  <p style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 12 }}>{evidence.description}</p>
                  {evidence.note && <p className="rcard-note" style={{ marginTop: 12 }}>{evidence.note}</p>}
                  <a className="src-link" href={evidence.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 14, display: "inline-flex" }}>
                    View Research →
                  </a>
                </div>
              </Reveal>
            )}
          </div>
          <Reveal delay={1}>
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)", fontWeight: 650, fontSize: 14.5 }}>Specifications</div>
              <table className="spec-table">
                <tbody>
                  <tr><td>Product</td><td>{p.name}</td></tr>
                  <tr><td>SKU</td><td className="mono">{p.sku}</td></tr>
                  {p.code && <tr><td>Vial code</td><td className="mono">{p.code}</td></tr>}
                  <tr><td>Compound type</td><td>{p.compoundType}</td></tr>
                  {p.purity && <tr><td>Purity</td><td>{p.purity}</td></tr>}
                  <tr><td>Form</td><td>{p.form}</td></tr>
                  <tr><td>Storage</td><td>{p.storage}</td></tr>
                  {p.stability && <tr><td>Stability</td><td>{p.stability}</td></tr>}
                  {p.solubility && <tr><td>Solubility</td><td>{p.solubility}</td></tr>}
                  <tr><td>Sizes</td><td>{p.sizes.map((s) => s.label).join(" · ")}</td></tr>
                  <tr><td>Grade</td><td>Research grade — RUO</td></tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* documentation */}
      <section className="section tight">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Available documentation</span>
            <h2 className="h-section" style={{ fontSize: 26 }}>Certificates of Analysis</h2>
          </Reveal>
          {coas.length === 0 ? (
            <div className="notice blue" style={{ maxWidth: 720 }}>
              Batch documents for current lots are supplied with your order and can be verified on the{" "}
              <Link href="/coa" style={{ textDecoration: "underline" }}>COA Verification page</Link> using the batch
              number printed on the vial.
            </div>
          ) : (
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
                      <td>{param(c, "Purity") ?? <span className="not-reported">Not reported</span>}</td>
                      <td>{param(c, "Identity") ?? <span className="not-reported">Not reported</span>}</td>
                      <td>{c.pdf ? <a href={c.pdf} style={{ color: "var(--blue)", fontWeight: 600 }}>View PDF →</a> : <span className="not-reported">Not uploaded</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="section tight alt">
        <div className="container" style={{ maxWidth: 860 }}>
          <Reveal>
            <span className="eyebrow">Product questions</span>
            <h2 className="h-section" style={{ fontSize: 26 }}>Frequently asked</h2>
          </Reveal>
          <FAQList items={productFaqs} />
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="section tight">
          <div className="container">
            <Reveal>
              <span className="eyebrow">Related compounds</span>
              <h2 className="h-section" style={{ fontSize: 26 }}>Researchers also viewed</h2>
            </Reveal>
            <div className="grid-3" style={{ marginTop: 24 }}>
              {related.slice(0, 3).map((r) => (
                <ProductCard key={r!.slug} p={r!} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
