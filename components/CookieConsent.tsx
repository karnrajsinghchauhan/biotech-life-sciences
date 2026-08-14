"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

// This site currently sets exactly one cookie — `btls_cart_id`, strictly
// necessary to keep your Shopify cart working across page loads (see
// app/api/shopify/cart/route.ts). There is no analytics or advertising
// script anywhere on the site. This banner discloses that honestly rather
// than presenting a generic "we use cookies to improve your experience"
// notice, and gives UK/EU visitors an explicit acknowledgement step before
// browsing on, per UK PECR / GDPR guidance on cookie disclosure.

const STORAGE_KEY = "btls_cookie_ack"

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  const acknowledge = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1")
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 80,
        maxWidth: 560,
        margin: "0 auto",
        background: "var(--surface, #14161a)",
        border: "1px solid var(--line, rgba(255,255,255,0.12))",
        borderRadius: 12,
        padding: "18px 20px",
        boxShadow: "0 12px 36px rgba(0,0,0,0.35)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <p style={{ fontSize: 13.5, lineHeight: 1.55, margin: 0, color: "var(--ink-2, rgba(255,255,255,0.72))" }}>
        We use one strictly necessary cookie to keep your cart working — nothing else. No analytics, no
        advertising trackers. See our{" "}
        <Link href="/privacy" style={{ color: "var(--blue, #4f9dff)", fontWeight: 600 }}>Privacy Policy</Link>{" "}
        for details.
      </p>
      <button
        onClick={acknowledge}
        className="btn primary sm"
        style={{ alignSelf: "flex-start" }}
      >
        Got it
      </button>
    </div>
  )
}
