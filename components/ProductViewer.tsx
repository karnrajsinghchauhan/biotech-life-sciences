"use client"

import Image from "next/image"
import { useRef } from "react"

/**
 * Presents the company's real vial photograph with interface-level depth —
 * perspective tilt, a moving key light and a sheen pass. The product itself is
 * never altered; only the stage around it moves.
 */
export default function ProductViewer({
  src, alt, code, sku, form,
}: { src: string; alt: string; code?: string; sku: string; form: string }) {
  const stage = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  const onMove = (e: React.MouseEvent) => {
    if (reduced() || !stage.current || !inner.current) return
    const r = stage.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    inner.current.style.transform = `rotateY(${px * 13}deg) rotateX(${-py * 9}deg) translateZ(0)`
    stage.current.style.setProperty("--kx", `${50 + px * 46}%`)
    stage.current.style.setProperty("--ky", `${34 + py * 26}%`)
  }

  const onLeave = () => {
    if (!inner.current) return
    inner.current.style.transform = "rotateY(0deg) rotateX(0deg)"
  }

  return (
    <div
      ref={stage}
      className="tilt-stage vial-stage"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        minHeight: 520,
        borderRadius: 20,
        border: "1px solid var(--line)",
        background:
          "radial-gradient(120% 90% at var(--kx,50%) var(--ky,34%), #24272e 0%, #101216 55%, #08090b 100%)",
      }}
    >
      <span className="molecular-layer tr" aria-hidden="true" />
      <div ref={inner} className="tilt-inner" style={{ height: 470, display: "flex", alignItems: "flex-end" }}>
        <Image
          className="vial-img"
          src={src}
          alt={alt}
          width={620}
          height={1343}
          priority
          sizes="(max-width: 1024px) 70vw, 460px"
          style={{ height: "100%" }}
        />
      </div>
      <span className="tilt-sheen" aria-hidden="true" />
      <span className="mono" style={{ position: "absolute", bottom: 16, left: 20, fontSize: 11, color: "var(--muted)", zIndex: 4 }}>
        {sku}{code ? ` · ${code}` : ""} · {form}
      </span>
    </div>
  )
}
