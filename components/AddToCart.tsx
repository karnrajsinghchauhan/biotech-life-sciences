"use client"

import { useState } from "react"
import { Product } from "@/lib/data"
import { useCart } from "@/lib/cart"

export default function AddToCart({ p }: { p: Product }) {
  const { add, fmt } = useCart()
  const [size, setSize] = useState(p.sizes[0].label)
  const [qty, setQtyN] = useState(1)
  const sel = p.sizes.find((s) => s.label === size)!

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div className="small" style={{ fontWeight: 600, marginBottom: 8 }}>Size</div>
        <div className="pill-row">
          {p.sizes.map((s) => (
            <button
              key={s.label}
              onClick={() => setSize(s.label)}
              className="pill"
              style={
                s.label === size
                  ? { borderColor: "var(--blue)", background: "var(--blue-soft)", color: "var(--blue)", cursor: "pointer" }
                  : { cursor: "pointer" }
              }
            >
              {s.label} — {fmt(s.price)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="qty">
          <button aria-label="Decrease" onClick={() => setQtyN((q) => Math.max(1, q - 1))}>−</button>
          <span>{qty}</span>
          <button aria-label="Increase" onClick={() => setQtyN((q) => q + 1)}>+</button>
        </div>
        <button className="btn primary" style={{ flex: 1 }} onClick={() => add(p.slug, size, qty)}>
          Add to Cart — {fmt(sel.price * qty)}
        </button>
      </div>
      <p className="small">Supplied for laboratory research use only. Batch documentation accompanies every released lot.</p>
    </div>
  )
}
