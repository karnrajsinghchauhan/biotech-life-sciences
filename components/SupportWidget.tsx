"use client"

import Link from "next/link"
import { useState } from "react"
import { site } from "@/lib/config"

const LINKS = [
  { href: "/library", label: "Research Documentation" },
  { href: "/coa", label: "COA Questions" },
  { href: "/products", label: "Product Information" },
  { href: "/wholesale", label: "Bulk / Wholesale" },
  { href: "/contact", label: "Order Support" },
]

export default function SupportWidget() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className={`support-panel ${open ? "show" : ""}`} role="dialog" aria-label="Research support">
        <b style={{ fontSize: 15.5 }}>Need help navigating the catalogue?</b>
        <p className="small" style={{ margin: "6px 0 14px" }}>
          Our research support team can help with documentation, COAs and orders. We do not provide medical advice.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="row" onClick={() => setOpen(false)}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--blue)" }} />
              {l.label}
            </Link>
          ))}
        </div>
        <p className="small mono" style={{ marginTop: 14, fontSize: 11.5 }}>{site.email} · {site.hours}</p>
      </div>
      <button className="support-fab" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 1 0-3.1 6.3L21 19l-.8-3.1A8 8 0 0 0 21 12Z" /></svg>
        <span className="lbl">Research Support</span>
      </button>
    </>
  )
}
