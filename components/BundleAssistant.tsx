"use client"

import { useState } from "react"
import { CategorySlug, Product, inCategory } from "@/lib/data"
import WhatsAppOrderButton from "./WhatsAppOrderButton"

type Goal = { id: string; label: string; categories: CategorySlug[] }

const GOALS: Goal[] = [
  { id: "recovery", label: "Recovery & Repair", categories: ["tissue-repair", "connective"] },
  { id: "skin", label: "Skin & Glow", categories: ["dermal"] },
  { id: "focus", label: "Focus & Cognition", categories: ["cognitive"] },
  { id: "metabolic", label: "Metabolic", categories: ["metabolic"] },
  { id: "sleep", label: "Sleep", categories: ["sleep"] },
  { id: "longevity", label: "Longevity", categories: ["longevity", "mitochondrial"] },
  { id: "performance", label: "GH & Performance", categories: ["gh-performance"] },
]

function pickProducts(goal: Goal): Product[] {
  const seen = new Set<string>()
  const picked: Product[] = []
  for (const slug of goal.categories) {
    const pool = [...inCategory(slug)].sort(
      (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || Number(b.featured) - Number(a.featured)
    )
    for (const p of pool) {
      if (picked.length >= 3) break
      if (!seen.has(p.slug)) {
        seen.add(p.slug)
        picked.push(p)
      }
    }
    if (picked.length >= 3) break
  }
  return picked
}

export default function BundleAssistant() {
  const [open, setOpen] = useState(false)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [bundle, setBundle] = useState<Product[]>([])

  function selectGoal(g: Goal) {
    setGoal(g)
    setBundle(pickProducts(g))
  }

  function close() {
    setOpen(false)
    setGoal(null)
    setBundle([])
  }

  function removeItem(slug: string) {
    setBundle((b) => b.filter((p) => p.slug !== slug))
  }

  return (
    <>
      <button type="button" className="btn ghost" onClick={() => setOpen(true)}>
        Build Your Bundle
      </button>
      <div
        className={`bundle-overlay ${open ? "show" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Build your bundle"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="bundle-sheet">
          <button type="button" className="btn ghost sm bundle-close" onClick={close} aria-label="Close">✕</button>
          {!goal ? (
            <>
              <span className="eyebrow">Personalized stock</span>
              <h3 style={{ fontSize: 22, marginTop: 8 }}>What&apos;s your goal?</h3>
              <p className="small" style={{ marginTop: 6 }}>
                Pick a focus area and we&apos;ll suggest a starting bundle from the catalogue.
              </p>
              <div className="bundle-goal-grid">
                {GOALS.map((g) => (
                  <button key={g.id} type="button" className="bundle-goal-btn" onClick={() => selectGoal(g)}>
                    {g.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <span className="eyebrow">{goal.label}</span>
              <h3 style={{ fontSize: 22, marginTop: 8 }}>Your suggested bundle</h3>
              <p className="small" style={{ marginTop: 6 }}>
                Remove anything you don&apos;t want, then order the rest in one message.
              </p>
              <div style={{ marginTop: 14 }}>
                {bundle.length === 0 ? (
                  <p className="small">No items left in this bundle.</p>
                ) : (
                  bundle.map((p) => (
                    <div key={p.slug} className="bundle-item-row">
                      <div>
                        <b style={{ fontSize: 14.5 }}>{p.name}</b>
                        <div className="small">{p.sku}</div>
                      </div>
                      <button type="button" className="bundle-item-remove" onClick={() => removeItem(p.slug)}>
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                <button type="button" className="btn ghost sm" onClick={() => setGoal(null)}>← Change goal</button>
                {bundle.length > 0 && (
                  <WhatsAppOrderButton products={bundle} className="btn primary sm" label="Order this bundle on WhatsApp" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
