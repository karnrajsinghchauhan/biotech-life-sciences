"use client"

import Link from "next/link"
import { useState } from "react"
import { site } from "@/lib/config"

const LINKS = [
  { href: "/library", label: "Research documentation", emoji: "📚" },
  { href: "/coa", label: "COA verification", emoji: "🧾" },
  { href: "/products", label: "Product information", emoji: "🧪" },
  { href: "/wholesale", label: "Bulk / wholesale pricing", emoji: "📦" },
  { href: "/contact", label: "Order support", emoji: "✉️" },
]

export default function SupportWidget() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className={`support-panel ${open ? "show" : ""}`} role="dialog" aria-label="Expert guidance">
        <b style={{ fontSize: 15.5 }}>Talk to research support</b>
        <p className="small" style={{ margin: "6px 0 14px" }}>
          Our team can help with documentation, COAs, sizing and orders. We do not provide medical advice.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="row" onClick={() => setOpen(false)}>
              <span aria-hidden="true">{l.emoji}</span>
              {l.label}
            </Link>
          ))}
        </div>
        <p className="small mono" style={{ marginTop: 14, fontSize: 11.5 }}>{site.email} · {site.hours}</p>
      </div>
      <button className="support-fab" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="support-fab-dot" aria-hidden="true" />
        <span className="lbl">Expert Guidance</span>
      </button>
    </>
  )
}
