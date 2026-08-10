"use client"

import { useState } from "react"

export default function FAQList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div>
      {items.map((f, i) => (
        <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
          <button className="faq-q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            {f.q}
            <span className="pm">+</span>
          </button>
          <div className="faq-a"><p>{f.a}</p></div>
        </div>
      ))}
    </div>
  )
}
