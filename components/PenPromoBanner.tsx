import Link from "next/link"
import Reveal from "./Reveal"

export default function PenPromoBanner() {
  return (
    <Reveal>
      <Link href="/pens" className="promo-banner" style={{ display: "flex" }}>
        <div className="promo-banner-left">
          <span className="promo-emoji" aria-hidden="true">🖊️</span>
          <div>
            <b>New: pre-filled research pens</b>
            <span className="sub">GHK-Cu, Retatrutide, BPC-157 and TB-500 — same RUO standard, precision delivery format</span>
          </div>
        </div>
        <span className="btn ghost sm">Shop pens →</span>
      </Link>
    </Reveal>
  )
}
