"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { fireOrderConfirmation } from "@/components/Confetti"
import { useCart } from "@/lib/cart"
import { bySlug } from "@/lib/data"
import { payments, shipping, site } from "@/lib/config"

type PayMethod = "upi" | "bank"

export default function CheckoutClient() {
  const { items, subtotal, fmt, clear } = useCart()
  const [pay, setPay] = useState<PayMethod>(payments.upi.enabled ? "upi" : "bank")
  const [ruo, setRuo] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState<null | { orderId: string; total: number }>(null)
  const [form, setForm] = useState({
    name: "", email: "", phone: "", organization: "",
    address: "", city: "", state: "", pincode: "", country: "India", notes: "",
  })

  const ship = subtotal >= shipping.freeAbove || subtotal === 0 ? 0 : shipping.flatRate
  const total = subtotal + ship

  // Celebrate a completed order once. Respects prefers-reduced-motion.
  useEffect(() => {
    if (done) fireOrderConfirmation()
  }, [done])
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const upiConfigured = payments.upi.enabled && !payments.upi.vpa.startsWith("CONFIGURE")
  const upiLink = upiConfigured
    ? `upi://pay?pa=${encodeURIComponent(payments.upi.vpa)}&pn=${encodeURIComponent(payments.upi.payee)}&am=${total}&cu=INR&tn=${encodeURIComponent(done ? `Order ${done.orderId}` : payments.upi.note)}`
    : null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!ruo) { setError("Please confirm the Research Use Only acknowledgement."); return }
    if (items.length === 0) { setError("Your cart is empty."); return }
    setBusy(true)
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, items, payMethod: pay }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Order failed")
      setDone({ orderId: data.orderId, total })
      clear()
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err: any) {
      setError(err.message || "Something went wrong — please try again.")
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="card" style={{ padding: 36, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: "var(--teal-soft)", color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 24 }}>✓</div>
            <h1 style={{ fontSize: 26, marginBottom: 8 }}>Order received</h1>
            <p className="small" style={{ marginBottom: 6 }}>Order reference</p>
            <p className="mono" style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{done.orderId}</p>
            <p style={{ color: "var(--ink-2)", fontSize: 15, marginBottom: 20 }}>
              Amount payable: <b>{fmt(done.total)}</b>
            </p>
            {pay === "upi" ? (
              upiLink ? (
                <>
                  <a href={upiLink} className="btn primary wide" style={{ marginBottom: 12 }}>Pay via UPI app</a>
                  <p className="small">Pay to <b className="mono">{payments.upi.vpa}</b> and quote your order reference. Your order is confirmed once payment is received.</p>
                </>
              ) : (
                <div className="notice" style={{ textAlign: "left" }}>
                  UPI payment details will be sent to your email with this order reference. (Store owner: set your
                  UPI VPA in <code>lib/config.ts</code> to enable one-tap UPI payment here.)
                </div>
              )
            ) : (
              <div className="notice blue" style={{ textAlign: "left" }}>{payments.bankTransfer.details}</div>
            )}
            <p className="small" style={{ marginTop: 20 }}>
              A confirmation has been prepared for {form.email || "your email"}. Questions? {site.email}
            </p>
            <Link href="/products" className="btn ghost sm" style={{ marginTop: 18 }}>Continue browsing</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section tight">
      <div className="container">
        <div className="steps">
          <span className="step on"><span className="dot">1</span> Details</span>
          <span className="step on"><span className="dot">2</span> Payment</span>
          <span className="step"><span className="dot">3</span> Confirmation</span>
        </div>
        <div className="checkout-grid">
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div className="card" style={{ padding: 26 }}>
              <h2 style={{ fontSize: 20, marginBottom: 18 }}>Contact &amp; shipping</h2>
              <div className="form-grid">
                <div className="field"><label>Full name *</label><input required value={form.name} onChange={set("name")} autoComplete="name" /></div>
                <div className="field"><label>Email *</label><input required type="email" value={form.email} onChange={set("email")} autoComplete="email" /></div>
                <div className="field"><label>Phone *</label><input required value={form.phone} onChange={set("phone")} autoComplete="tel" /></div>
                <div className="field"><label>Organization / lab (optional)</label><input value={form.organization} onChange={set("organization")} /></div>
                <div className="field full"><label>Address *</label><input required value={form.address} onChange={set("address")} autoComplete="street-address" /></div>
                <div className="field"><label>City *</label><input required value={form.city} onChange={set("city")} /></div>
                <div className="field"><label>State *</label><input required value={form.state} onChange={set("state")} /></div>
                <div className="field"><label>PIN / Postal code *</label><input required value={form.pincode} onChange={set("pincode")} /></div>
                <div className="field"><label>Country *</label><input required value={form.country} onChange={set("country")} /></div>
                <div className="field full"><label>Order notes (optional)</label><textarea rows={2} value={form.notes} onChange={set("notes")} /></div>
              </div>
            </div>

            <div className="card" style={{ padding: 26 }}>
              <h2 style={{ fontSize: 20, marginBottom: 18 }}>Payment method</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {payments.upi.enabled && (
                  <label className={`pay-option ${pay === "upi" ? "active" : ""}`}>
                    <input type="radio" name="pay" checked={pay === "upi"} onChange={() => setPay("upi")} style={{ marginTop: 4 }} />
                    <span>
                      <b>UPI</b>
                      <span className="small" style={{ display: "block" }}>
                        Pay instantly with any UPI app (GPay, PhonePe, Paytm, BHIM). Payment details are shown after
                        you place the order.
                      </span>
                    </span>
                  </label>
                )}
                {payments.bankTransfer.enabled && (
                  <label className={`pay-option ${pay === "bank" ? "active" : ""}`}>
                    <input type="radio" name="pay" checked={pay === "bank"} onChange={() => setPay("bank")} style={{ marginTop: 4 }} />
                    <span>
                      <b>Bank transfer</b>
                      <span className="small" style={{ display: "block" }}>{payments.bankTransfer.details}</span>
                    </span>
                  </label>
                )}
                {!payments.cards.enabled && (
                  <p className="small">Card and net-banking payments will appear here once enabled on our payment gateway.</p>
                )}
              </div>
            </div>

            <div className="card" style={{ padding: 26 }}>
              <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" checked={ruo} onChange={(e) => setRuo(e.target.checked)} style={{ marginTop: 5 }} />
                <span style={{ fontSize: 14, color: "var(--ink-2)" }}>
                  <b>Research Use Only acknowledgement.</b> I confirm that the materials in this order will be used
                  exclusively for laboratory research by suitably qualified individuals, and not for any human or
                  veterinary use, diagnosis, treatment or prevention of disease.
                </span>
              </label>
            </div>

            {error && <div className="notice">{error}</div>}
            <button type="submit" className="btn primary wide" disabled={busy || items.length === 0}>
              {busy ? "Placing order…" : `Place Order — ${fmt(total)}`}
            </button>
          </form>

          <aside className="card" style={{ padding: 26, position: "sticky", top: 96 }}>
            <h2 style={{ fontSize: 18, marginBottom: 14 }}>Order summary</h2>
            {items.length === 0 ? (
              <p className="small">Your cart is empty. <Link href="/products" style={{ color: "var(--blue)", fontWeight: 600 }}>Browse the catalogue →</Link></p>
            ) : (
              <>
                {items.map((it) => {
                  const p = bySlug(it.slug)
                  const s = p?.sizes.find((z) => z.label === it.size)
                  if (!p || !s) return null
                  return (
                    <div key={`${it.slug}-${it.size}`} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--line)", fontSize: 14 }}>
                      <span>{p.name} <span className="small">({it.size}) × {it.qty}</span></span>
                      <b>{fmt(s.price * it.qty)}</b>
                    </div>
                  )
                })}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginTop: 14 }}>
                  <span className="small">Subtotal</span><b>{fmt(subtotal)}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginTop: 6 }}>
                  <span className="small">Shipping</span><b>{ship === 0 ? "Free" : fmt(ship)}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                  <b>Total</b><b>{fmt(total)}</b>
                </div>
                <p className="small" style={{ marginTop: 14 }}>
                  Tracked, insured, temperature-stable dispatch. {shipping.dispatchNote}
                </p>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
