"use client"

import { useMemo, useState } from "react"
import { products, categories, compoundTypes, CategorySlug } from "@/lib/data"
import ProductCard from "@/components/ProductCard"
import Reveal from "@/components/Reveal"

type Sort = "featured" | "new" | "az" | "priceAsc" | "priceDesc"

export default function CatalogClient() {
  const [q, setQ] = useState("")
  const [cat, setCat] = useState<CategorySlug | "all">("all")
  const [type, setType] = useState<string>("all")
  const [sort, setSort] = useState<Sort>("featured")

  const list = useMemo(() => {
    let out = products.filter((p) => {
      const s = q.trim().toLowerCase()
      const okQ =
        !s ||
        p.name.toLowerCase().includes(s) ||
        p.altName?.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s)
      const okC = cat === "all" || p.categories.includes(cat)
      const okT = type === "all" || p.compoundType === type
      return okQ && okC && okT
    })
    const price = (p: (typeof products)[number]) => Math.min(...p.sizes.map((s) => s.price))
    switch (sort) {
      case "az": out = [...out].sort((a, b) => a.name.localeCompare(b.name)); break
      case "priceAsc": out = [...out].sort((a, b) => price(a) - price(b)); break
      case "priceDesc": out = [...out].sort((a, b) => price(b) - price(a)); break
      case "new": out = [...out].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew)); break
      default: out = [...out].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
    }
    return out
  }, [q, cat, type, sort])

  return (
    <>
      <section className="section tight alt">
        <div className="container">
          <span className="eyebrow">Complete catalogue</span>
          <h1 className="h-section">Research Compounds</h1>
          <p className="lede">
            Every compound in the Biotech Life Sciences portfolio — normalized by compound type,
            organized by research area, documented batch by batch.
          </p>
          <div className="filter-bar" role="search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or SKU…"
              aria-label="Search products"
              style={{ padding: "9px 16px", borderRadius: 999, border: "1px solid var(--line-strong)", minWidth: 220, outline: "none", background: "var(--surface)" }}
            />
            <select value={cat} onChange={(e) => setCat(e.target.value as any)} aria-label="Filter by research area">
              <option value="all">All research areas</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by compound type">
              <option value="all">All compound types</option>
              {compoundTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort">
              <option value="featured">Featured</option>
              <option value="new">Newest</option>
              <option value="az">A–Z</option>
              <option value="priceAsc">Price: Low → High</option>
              <option value="priceDesc">Price: High → Low</option>
            </select>
            <span className="small" style={{ marginLeft: "auto" }}>{list.length} of {products.length} products</span>
          </div>
        </div>
      </section>
      <section className="section tight">
        <div className="container">
          {list.length === 0 ? (
            <p className="lede" style={{ padding: "40px 0" }}>No compounds match those filters. Try clearing the search.</p>
          ) : (
            <div className="grid-3">
              {list.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) as 0 | 1 | 2}>
                  <ProductCard p={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
