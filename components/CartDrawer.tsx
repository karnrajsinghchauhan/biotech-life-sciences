"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { ShopifyCart } from "@/lib/shopify"

type CartDrawerProps = {
  open: boolean
  onClose: () => void
  onCountChange: (count: number) => void
}

function money(amount: string, currency: string) {
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

export default function CartDrawer({ open, onClose, onCountChange }: CartDrawerProps) {
  const [cart, setCart] = useState<ShopifyCart | null>(null)
  const [loading, setLoading] = useState(false)
  const [busyLine, setBusyLine] = useState("")
  const [error, setError] = useState("")

  const refresh = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/shopify/cart", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not load your cart")
      const next = data.cart as ShopifyCart | null
      setCart(next)
      onCountChange(next?.totalQuantity ?? 0)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return

    void refresh()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    requestAnimationFrame(() => document.getElementById("cart-drawer-close")?.focus())
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  const asideRef = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const el = asideRef.current
    if (!el) return
    if (open) el.removeAttribute("inert")
    else el.setAttribute("inert", "")
  }, [open])

  const updateLine = async (lineId: string, quantity: number) => {
    setBusyLine(lineId)
    setError("")
    try {
      const res = await fetch("/api/shopify/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId, quantity }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not update your cart")
      const next = data.cart as ShopifyCart
      setCart(next)
      onCountChange(next.totalQuantity)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusyLine("")
    }
  }

  const removeLine = async (lineId: string) => {
    setBusyLine(lineId)
    setError("")
    try {
      const res = await fetch(`/api/shopify/cart?lineId=${encodeURIComponent(lineId)}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not remove that item")
      const next = data.cart as ShopifyCart
      setCart(next)
      onCountChange(next.totalQuantity)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusyLine("")
    }
  }

  const hasItems = Boolean(cart && cart.lines.length > 0)

  return (
    <>
      <div className={`overlay ${open ? "show" : ""}`} onClick={onClose} aria-hidden="true" />
      <aside
        ref={asideRef}
        id="cart-drawer"
        className={`drawer cart-drawer ${open ? "show" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        aria-hidden={!open}
      >
        <div className="drawer-head">
          <div>
            <span className="eyebrow">Your selection</span>
            <h2 id="cart-drawer-title" style={{ fontSize: 24, marginTop: 6 }}>Research cart</h2>
          </div>
          <button id="cart-drawer-close" className="icon-btn" type="button" onClick={onClose} aria-label="Close cart">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="drawer-body">
          {loading ? (
            <p className="small" role="status" aria-live="polite">Loading your cart…</p>
          ) : error ? (
            <div className="notice" role="alert">{error}</div>
          ) : !cart || cart.lines.length === 0 ? (
            <div style={{ padding: "32px 0" }}>
              <p style={{ fontWeight: 700, fontSize: 18 }}>Your cart is empty.</p>
              <p className="small" style={{ marginTop: 8 }}>Choose a research compound to begin. Your selection will stay available as you move around the site.</p>
              <Link href="/shop" className="btn primary" style={{ marginTop: 18 }} onClick={onClose}>Browse the storefront</Link>
            </div>
          ) : (
            <>
              <div aria-live="polite" className="small" style={{ marginBottom: 6 }}>
                {cart.totalQuantity} item{cart.totalQuantity === 1 ? "" : "s"} selected
              </div>
              {cart.lines.map((line) => {
                const lineBusy = busyLine === line.id
                return (
                  <div className="cart-row" key={line.id}>
                    <div className="cart-thumb">
                      {line.merchandise.product.featuredImage ? (
                        <img src={line.merchandise.product.featuredImage.url} alt="" width={62} height={62} />
                      ) : <span className="small">RUO</span>}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Link href={`/shop/${line.merchandise.product.handle}`} onClick={onClose} style={{ fontWeight: 700, display: "block" }}>
                        {line.merchandise.product.title}
                      </Link>
                      <div className="small" style={{ marginTop: 2 }}>{line.merchandise.title}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 10 }}>
                        <div className="qty" aria-label={`Quantity for ${line.merchandise.product.title}`}>
                          <button type="button" aria-label={`Decrease ${line.merchandise.product.title} quantity`} disabled={lineBusy} onClick={() => void updateLine(line.id, line.quantity - 1)}>−</button>
                          <span aria-live="polite">{line.quantity}</span>
                          <button type="button" aria-label={`Increase ${line.merchandise.product.title} quantity`} disabled={lineBusy} onClick={() => void updateLine(line.id, line.quantity + 1)}>+</button>
                        </div>
                        <strong>{money(line.merchandise.price.amount, line.merchandise.price.currencyCode)}</strong>
                      </div>
                      <button type="button" className="cart-remove" disabled={lineBusy} onClick={() => void removeLine(line.id)}>
                        {lineBusy ? "Updating…" : "Remove"}
                      </button>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>

        {hasItems && cart && (
          <div className="drawer-foot">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 15, marginBottom: 14 }}>
              <span className="small">Estimated total</span>
              <strong>{money(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}</strong>
            </div>
            <a href={cart.checkoutUrl} className="btn primary wide">Checkout securely with Shopify →</a>
            <p className="small" style={{ marginTop: 10 }}>Payment, delivery options and tax are handled securely by Shopify Checkout.</p>
          </div>
        )}
      </aside>
    </>
  )
}
