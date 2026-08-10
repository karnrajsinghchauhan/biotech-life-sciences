"use client"

// Interactive 3D molecular structure — custom canvas renderer (no heavy 3D
// library). Slow rotation, cursor parallax, scroll response, depth-sorted
// atoms and bonds with soft particles.

import { useEffect, useRef } from "react"

type Atom = { x: number; y: number; z: number; r: number; hue: number }

export default function MoleculeCanvas({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext("2d")!
    let raf = 0
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    let scrollY = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      W = rect.width; H = rect.height
      canvas.width = W * dpr; canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Build a helical peptide-like backbone with side groups
    const atoms: Atom[] = []
    const bonds: [number, number][] = []
    const N = Math.round(26 * density)
    const backbone: number[] = []
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 4.2
      const y = (i / N - 0.5) * 300
      atoms.push({ x: Math.cos(t) * 92, y, z: Math.sin(t) * 92, r: i % 3 === 0 ? 11 : 8, hue: i % 5 === 0 ? 174 : 218 })
      const bi = atoms.length - 1
      backbone.push(bi)
      if (i > 0) bonds.push([backbone[i - 1], bi])
      // side atoms
      if (i % 2 === 0) {
        const sx = Math.cos(t) * 150, sz = Math.sin(t) * 150
        atoms.push({ x: sx, y: y + 9, z: sz, r: 5.5, hue: i % 4 === 0 ? 174 : 218 })
        bonds.push([bi, atoms.length - 1])
      }
    }
    // particles
    const parts = Array.from({ length: 46 }, () => ({
      x: (Math.random() - 0.5) * 560, y: (Math.random() - 0.5) * 480, z: (Math.random() - 0.5) * 500,
      r: Math.random() * 2 + 0.6, s: Math.random() * 0.3 + 0.05,
    }))

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    const onScroll = () => { scrollY = window.scrollY }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", resize)

    let t0 = performance.now()
    const draw = (now: number) => {
      const t = (now - t0) / 1000
      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04
      ctx.clearRect(0, 0, W, H)

      const cx = W / 2, cy = H / 2
      const rotY = t * 0.24 + mouse.x * 0.5 + scrollY * 0.0012
      const rotX = 0.32 + mouse.y * 0.3 + scrollY * 0.0006
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
      const persp = 640

      const proj = (p: { x: number; y: number; z: number }) => {
        let x = p.x * cosY - p.z * sinY
        let z = p.x * sinY + p.z * cosY
        let y = p.y * cosX - z * sinX
        z = p.y * sinX + z * cosX
        const s = persp / (persp + z)
        return { x: cx + x * s, y: cy + y * s, s, z }
      }

      // particles (behind)
      for (const p of parts) {
        p.y -= p.s
        if (p.y < -260) p.y = 260
        const q = proj(p)
        ctx.beginPath()
        ctx.arc(q.x, q.y, p.r * q.s, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(17, 86, 214, ${0.10 * q.s})`
        ctx.fill()
      }

      // bonds
      const projected = atoms.map(proj)
      for (const [a, b] of bonds) {
        const A = projected[a], B = projected[b]
        if (!A || !B) continue
        const depth = (A.s + B.s) / 2
        ctx.beginPath()
        ctx.moveTo(A.x, A.y)
        ctx.lineTo(B.x, B.y)
        ctx.lineWidth = 1.6 * depth
        ctx.strokeStyle = `rgba(51, 70, 95, ${0.16 + depth * 0.16})`
        ctx.stroke()
      }

      // atoms depth-sorted
      const order = projected.map((p, i) => ({ p, i })).sort((u, v) => u.p.z - v.p.z)
      for (const { p, i } of order) {
        const a = atoms[i]
        const r = a.r * p.s
        const grad = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.35, r * 0.15, p.x, p.y, r)
        if (a.hue === 174) {
          grad.addColorStop(0, `rgba(120, 220, 210, ${0.95 * p.s})`)
          grad.addColorStop(1, `rgba(14, 154, 141, ${0.85 * p.s})`)
        } else {
          grad.addColorStop(0, `rgba(150, 185, 250, ${0.95 * p.s})`)
          grad.addColorStop(1, `rgba(17, 86, 214, ${0.8 * p.s})`)
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", resize)
    }
  }, [density])

  return <canvas ref={ref} aria-hidden="true" />
}
