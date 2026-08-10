"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { products, categories } from "@/lib/data"

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("")
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => ref.current?.focus(), 120)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const hits = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return { prods: [], cats: [] }
    const prods = products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.altName?.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s) ||
        p.compoundType.toLowerCase().includes(s)
    ).slice(0, 8)
    const cats = categories.filter((c) => c.name.toLowerCase().includes(s)).slice(0, 3)
    return { prods, cats }
  }, [q])

  return (
    <>
      <div className={`overlay ${open ? "show" : ""}`} onClick={onClose} />
      <div className={`search-panel ${open ? "show" : ""}`} role="dialog" aria-label="Search">
        <div className="container">
          <div className="search-input-row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search compounds, SKUs, research areas…" aria-label="Search query" />
            <button className="btn ghost sm" onClick={onClose}>Close</button>
          </div>
          <div className="search-results">
            {q && hits.prods.length === 0 && hits.cats.length === 0 && (
              <p className="small" style={{ padding: "18px 10px" }}>No results for “{q}”. Try a compound name, SKU or category.</p>
            )}
            {hits.cats.map((c) => (
              <Link key={c.slug} href={`/categories/${c.slug}`} className="search-hit" onClick={onClose}>
                <span><b>{c.name}</b> <span className="small">— research category</span></span>
                <span className="small">Explore →</span>
              </Link>
            ))}
            {hits.prods.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="search-hit" onClick={onClose}>
                <span>
                  <b>{p.name}</b>{p.altName && <span className="small"> · {p.altName}</span>}
                  <span className="small"> — {p.compoundType}</span>
                </span>
                <span className="mono small">{p.sku}</span>
              </Link>
            ))}
            {!q && (
              <p className="small" style={{ padding: "18px 10px" }}>
                Try “BPC”, “GHK”, “retatrutide”, or a catalogue number like BTLS-601.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
