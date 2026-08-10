"use client"

import { useState } from "react"
import { site } from "@/lib/config"

export default function ContactClient() {
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries())
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", ...fd }),
      })
      if (!res.ok) throw new Error("failed")
      setSent(true)
    } catch {
      setError(`Something went wrong — email us directly at ${site.email}.`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className="section tight alt">
        <div className="container" style={{ maxWidth: 800 }}>
          <span className="eyebrow">Support</span>
          <h1 className="h-section">Contact us</h1>
          <p className="lede">Research support, documentation, orders and wholesale — we respond within one business day.</p>
        </div>
      </section>
      <section className="section tight">
        <div className="container split wideleft">
          {sent ? (
            <div className="card" style={{ padding: 32, textAlign: "center" }}>
              <b style={{ fontSize: 18 }}>Message received ✓</b>
              <p className="small" style={{ marginTop: 8 }}>We’ll get back to you at the email you provided.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="card" style={{ padding: 30 }}>
              <div className="form-grid">
                {/* honeypot — hidden from people, filled by bots */}
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                <div className="field"><label>Name *</label><input name="name" required /></div>
                <div className="field"><label>Email *</label><input name="email" type="email" required /></div>
                <div className="field full"><label>Subject *</label>
                  <select name="subject" required defaultValue="Product information">
                    {["Product information", "Order support", "COA / documentation", "Shipping question", "Wholesale / bulk", "Other"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field full"><label>Order number (if applicable)</label><input name="order" /></div>
                <div className="field full"><label>Message *</label><textarea name="message" rows={5} required /></div>
              </div>
              {error && <div className="notice" style={{ marginTop: 16 }}>{error}</div>}
              <button className="btn primary wide" style={{ marginTop: 20 }} disabled={busy}>{busy ? "Sending…" : "Send message"}</button>
            </form>
          )}
          <div>
            <div className="card" style={{ padding: 26, marginBottom: 18 }}>
              <b>Get in touch</b>
              <p className="small mono" style={{ marginTop: 10, lineHeight: 2 }}>
                {site.name}<br />{site.location}<br />{site.email}<br />{site.phone}
              </p>
            </div>
            <div className="card" style={{ padding: 26 }}>
              <b>Business hours</b>
              <p className="small" style={{ marginTop: 8 }}>{site.hours}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
