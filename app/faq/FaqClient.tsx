"use client"

import { useMemo, useState } from "react"
import { faqs } from "@/lib/faqs"
import FAQList from "@/components/FAQList"

const TAGS = ["all", "research", "quality", "coa", "orders", "payment", "shipping", "refunds", "wholesale", "handling", "legal", "support"]

export default function FaqClient() {
  const [q, setQ] = useState("")
  const [tag, setTag] = useState("all")

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return faqs.filter(
      (f) =>
        (tag === "all" || f.tags.includes(tag)) &&
        (!s || f.q.toLowerCase().includes(s) || f.a.toLowerCase().includes(s))
    )
  }, [q, tag])

  return (
    <>
      <section className="section tight alt">
        <div className="container" style={{ maxWidth: 860 }}>
          <span className="eyebrow">Help centre</span>
          <h1 className="h-section">Frequently Asked Questions</h1>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search questions…"
            aria-label="Search FAQ"
            style={{ width: "100%", padding: "13px 18px", borderRadius: 999, border: "1px solid var(--line-strong)", outline: "none", marginTop: 8, background: "var(--surface)" }}
          />
          <div className="pill-row" style={{ marginTop: 14 }}>
            {TAGS.map((t) => (
              <button
                key={t}
                className="pill"
                onClick={() => setTag(t)}
                style={t === tag ? { borderColor: "var(--blue)", background: "var(--blue-soft)", color: "var(--blue)", cursor: "pointer", textTransform: "capitalize" } : { cursor: "pointer", textTransform: "capitalize" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="section tight">
        <div className="container" style={{ maxWidth: 860 }}>
          {list.length === 0 ? <p className="lede">No questions match. Try different terms.</p> : <FAQList items={list} />}
        </div>
      </section>
    </>
  )
}
