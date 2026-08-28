"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

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
