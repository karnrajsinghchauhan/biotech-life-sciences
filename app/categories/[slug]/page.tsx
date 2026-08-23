import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { categories, categoryBySlug, inCategory } from "@/lib/data"
import ShopProductCard from "@/components/ShopProductCard"
import Reveal from "@/components/Reveal"
import { shopCategoryColor } from "@/lib/shopLabels"

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = categoryBySlug(params.slug)
  return c ? { title: `${c.name} — Research Area`, description: c.text } : {}
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const c = categoryBySlug(params.slug)
  if (!c) notFound()
  const prods = inCategory(c.slug)
  const accent = shopCategoryColor[c.slug]

  return (
    <>
      <section
        className="section tight"
        style={{ background: `radial-gradient(120% 140% at 15% 0%, ${accent}22, transparent 55%), var(--navy)`, color: "#fff" }}
      >
        <div className="container">
          <div className="breadcrumb" style={{ color: "rgba(255,255,255,0.6)", padding: 0, marginBottom: 20 }}>
            <Link href="/">Home</Link> / <Link href="/categories">Research Areas</Link> / <span style={{ color: "#fff" }}>{c.name}</span>
          </div>
          <span className="eyebrow" style={{ color: accent }}>{c.short}</span>
          <h1 className="h-section" style={{ color: "#fff" }}>{c.name}</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: 640 }}>{c.text}</p>
          <p className="mono" style={{ marginTop: 18, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            {prods.length} compounds · research use only
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid-3">
            {prods.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) as 0 | 1 | 2}>
                <ShopProductCard p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight alt">
        <div className="container split wideleft">
          <div>
            <span className="eyebrow">Research context</span>
            <h2 className="h-section" style={{ fontSize: 26 }}>About this research area</h2>
            <p style={{ color: "var(--ink-2)", maxWidth: 620 }}>
              Compounds in this category appear in the published literature in connection with {c.text.toLowerCase()}{" "}
              Descriptions across this catalogue are framed as research context — they are not efficacy or safety
              claims, and no material here is supplied for therapeutic use.
            </p>
            <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/products" className="btn ghost sm">Full catalogue</Link>
              <Link href="/library" className="btn ghost sm">Research Library</Link>
              <Link href="/wholesale" className="btn primary sm">Bulk enquiry</Link>
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <b style={{ fontSize: 15 }}>Documentation on every batch</b>
            <p className="small" style={{ margin: "8px 0 14px" }}>
              RP-HPLC purity, MS identity, batch traceability. Verify any batch number from a vial in this category.
            </p>
            <Link href="/coa" className="btn blue sm">Verify a COA →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
