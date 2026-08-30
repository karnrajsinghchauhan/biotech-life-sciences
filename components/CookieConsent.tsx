"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

// This site currently sets exactly one cookie — `btls_cart_id`, strictly
// necessary to keep your Shopify cart working across page loads (see
// app/api/shopify/cart/route.ts). There is no analytics or advertising
// script anywhere on the site. If that ever changes, this banner's copy
// and consent flow must be revisited before shipping the new script —
// don't just add a script tag and leave this banner as-is.

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
    <div role="region" aria-label="Cookie notice" className="minimal-cookie">
      <p>One necessary cookie keeps your cart working. <Link href="/privacy">Privacy</Link></p>
      <button onClick={acknowledge} className="minimal-cookie-button">OK</button>
    </div>
  )
}
