"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { site } from "@/lib/config"

// Shown once per browser before any product content is meaningfully
// visible. Confirms the visitor is a legal-age, qualified researcher
// purchasing for laboratory research — the same acknowledgment already
// required at checkout, just moved to the front door instead of only
// appearing at the point of payment.

const STORAGE_KEY = "btls_gate_ack"

export default function AgeGate() {
  const [visible, setVisible] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [visible])

  const confirm = () => {
    if (!checked) return
    try {
      localStorage.setItem(STORAGE_KEY, "1")
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="age-gate" role="dialog" aria-modal="true" aria-label="Confirm before entering">
      <div className="age-gate-card">
        <Image
          src="/images/brand/logo-mark.png"
          alt=""
          width={360}
          height={321}
          style={{ width: "auto", height: 34, marginBottom: 22 }}
        />
        <h1 className="age-gate-h">Before you enter</h1>
        <p className="age-gate-p">
          {site.name} supplies research-grade compounds strictly for laboratory research by qualified
          professionals and institutions. Products are not intended for human or veterinary consumption,
          diagnosis, treatment, or prevention of disease.
        </p>
        <label className="age-gate-check">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          <span>
            I confirm I am at least 18 years old and a qualified researcher or professional, entering
            this site to purchase research materials for laboratory use only — not for personal
            consumption.
          </span>
        </label>
        <div className="age-gate-actions">
          <button type="button" className="btn primary wide" disabled={!checked} onClick={confirm}>
            Enter site
          </button>
          <a href="https://www.google.com" className="btn ghost wide">Leave</a>
        </div>
      </div>
    </div>
  )
}
