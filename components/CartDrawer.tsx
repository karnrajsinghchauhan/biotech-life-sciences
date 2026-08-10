"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart"
import { bySlug } from "@/lib/data"
import { shipping } from "@/lib/config"
import Vial from "./Vial"

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, fmt } = useCart()

  const ship = subtotal >= shipping.freeAbove || subtotal === 0 ? 0 : shipping.flatRate

  return (
    <>
      <div className={`overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? "show" : ""}`} aria-label="Cart" aria-hidden={!open}>
        <div className="drawer-head">
          <b style={{ fontSize: 17 }}>Your Cart</b>
          <button className="icon-btn" aria-label="Close cart" onClick={() => setOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="drawer-body">
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>Your cart is empty</p>
              <p className="small" style={{ marginBottom: 20 }}>Browse the research catalogue to add materials.</p>
              <Link href="/products" className="btn primary sm" onClick={() => setOpen(false)}>Explore Catalogue</Link>
            </div>
          ) : (
            items.map((it) => {
              const p = bySlug(it.slug)
              if (!p) return null
              const size = p.sizes.find((s) => s.label === it.size)
              return (
                <div className="cart-row" key={`${it.slug}-${it.size}`}>
                  <div className="cart-thumb"><Vial code={p.code} name={p.name} size={34} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <b style={{ fontSize: 14.5 }}>{p.name}</b>
                      <b style={{ fontSize: 14 }}>{size ? fmt(size.price * it.qty) : "—"}</b>
                    </div>
                    <div className="small">{it.size} · {p.sku}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                      <div className="qty">
                        <button aria-label="Decrease" onClick={() => setQty(it.slug, it.size, it.qty - 1)}>−</button>
                        <span>{it.qty}</span>
                        <button aria-label="Increase" onClick={() => setQty(it.slug, it.size, it.qty + 1)}>+</button>
                      </div>
                      <button onClick={() => remove(it.slug, it.size)} style={{ background: "none", border: "none", fontSize: 12.5, color: "var(--muted)", textDecoration: "underline" }}>Remove</button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
        {items.length > 0 && (
          <div className="drawer-foot">
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
              <span className="small">Subtotal</span><b>{fmt(subtotal)}</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
              <span className="small">Shipping</span>
              <b>{ship === 0 ? "Free" : fmt(ship)}</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, margin: "10px 0 14px", paddingTop: 10, borderTop: "1px solid var(--line)" }}>
              <b>Total</b><b>{fmt(subtotal + ship)}</b>
            </div>
            <p className="small" style={{ marginBottom: 12 }}>
              All materials are supplied for laboratory research use only.
            </p>
            <Link href="/checkout" className="btn primary wide" onClick={() => setOpen(false)}>Proceed to Checkout</Link>
          </div>
        )}
      </aside>
    </>
  )
}
