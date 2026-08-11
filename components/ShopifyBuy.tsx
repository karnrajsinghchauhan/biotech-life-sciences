"use client"

import { useState } from "react"
import type { ShopifyProduct } from "@/lib/shopify"

// Variant picker + add-to-cart. Talks only to our own /api/shopify/cart
// route, so the Storefront token never reaches the browser.

type Variant = ShopifyProduct["variants"][number]

export default function ShopifyBuy({
  variants,
  currency,
}: {
  variants: Variant[]
  currency: string
}) {
  const [selected, setSelected] = useState<Variant | undefined>(
    variants.find((v) => v.availableForSale) ?? variants[0]
  )
  const [qty, setQty] = useState(1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [added, setAdded] = useState<{ checkoutUrl: string; count: number } | null>(null)

  const money = (amount: string) => {
    const n = Number(amount)
    try {
      return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: currency === "INR" ? 0 : 2,
      }).format(n)
    } catch {
      return `${currency} ${n}`
    }
  }

  const add = async () => {
    if (!selected) return
    setBusy(true)
    setError("")
    try {
      const res = await fetch("/api/shopify/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: selected.id, quantity: qty }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not add to cart")
      setAdded({ checkoutUrl: data.cart.checkoutUrl, count: data.cart.totalQuantity })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  if (variants.length === 0) {
    return <p className="small">No purchasable sizes are configured for this product yet.</p>
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div className="small" style={{ fontWeight: 600, marginBottom: 8 }}>Size</div>
        <div className="pill-row">
          {variants.map((v) => {
            const on = v.id === selected?.id
            return (
              <button
                key={v.id}
                className="pill"
                onClick={() => { setSelected(v); setAdded(null) }}
                disabled={!v.availableForSale}
                aria-pressed={on}
                style={{
                  cursor: v.availableForSale ? "pointer" : "not-allowed",
                  opacity: v.availableForSale ? 1 : 0.45,
                  ...(on ? { borderColor: "#fff", background: "rgba(255,255,255,0.1)", color: "#fff" } : {}),
                }}
              >
                {v.title} — {money(v.price.amount)}
                {!v.availableForSale && " · sold out"}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="qty">
          <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span>{qty}</span>
          <button aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(99, q + 1))}>+</button>
        </div>
        <button
          className="btn primary"
          style={{ flex: 1 }}
          onClick={add}
          disabled={busy || !selected?.availableForSale}
        >
          {busy ? "Adding…" : selected?.availableForSale ? "Add to Cart" : "Unavailable"}
        </button>
      </div>

      {error && <div className="notice">{error}</div>}

      {added && (
        <div className="verify-result ok">
          <span className="verify-status ok">
            <span className="verify-dot ok" aria-hidden="true">✓</span>
            Added — {added.count} item{added.count === 1 ? "" : "s"} in cart
          </span>
          <a href={added.checkoutUrl} className="btn primary wide" style={{ marginTop: 14 }}>
            Checkout securely with Shopify →
          </a>
          <p className="small" style={{ marginTop: 10 }}>
            Payment is handled by Shopify Checkout. You will be taken to a secure Shopify page.
          </p>
        </div>
      )}

      <p className="small">
        Supplied for laboratory research use only. Not for human or veterinary consumption.
      </p>
    </div>
  )
}
