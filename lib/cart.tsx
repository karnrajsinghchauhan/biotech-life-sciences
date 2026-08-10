"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { bySlug } from "./data"
import { Region, regions } from "./config"

export type CartItem = { slug: string; size: string; qty: number }

type CartCtx = {
  items: CartItem[]
  add: (slug: string, size: string, qty?: number) => void
  remove: (slug: string, size: string) => void
  setQty: (slug: string, size: string, qty: number) => void
  clear: () => void
  count: number
  subtotal: number // INR
  open: boolean
  setOpen: (v: boolean) => void
  region: Region
  setRegion: (r: Region) => void
  fmt: (inr: number) => string
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)
  const [region, setRegionState] = useState<Region>("IN")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("btls-cart")
      if (raw) setItems(JSON.parse(raw))
      const r = localStorage.getItem("btls-region") as Region | null
      if (r && regions.some((x) => x.code === r)) setRegionState(r)
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem("btls-cart", JSON.stringify(items))
  }, [items, loaded])

  const setRegion = (r: Region) => {
    setRegionState(r)
    try { localStorage.setItem("btls-region", r) } catch {}
  }

  const add = (slug: string, size: string, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.slug === slug && x.size === size)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], qty: next[i].qty + qty }
        return next
      }
      return [...prev, { slug, size, qty }]
    })
    setOpen(true)
  }

  const remove = (slug: string, size: string) =>
    setItems((prev) => prev.filter((x) => !(x.slug === slug && x.size === size)))

  const setQty = (slug: string, size: string, qty: number) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((x) => !(x.slug === slug && x.size === size))
        : prev.map((x) => (x.slug === slug && x.size === size ? { ...x, qty } : x))
    )

  const clear = () => setItems([])

  const { count, subtotal } = useMemo(() => {
    let count = 0
    let subtotal = 0
    for (const it of items) {
      const p = bySlug(it.slug)
      const s = p?.sizes.find((z) => z.label === it.size)
      if (p && s) {
        count += it.qty
        subtotal += s.price * it.qty
      }
    }
    return { count, subtotal }
  }, [items])

  const fmt = (inr: number) => {
    const r = regions.find((x) => x.code === region)!
    const v = inr * r.rate
    const opts: Intl.NumberFormatOptions =
      r.currency === "INR" ? { maximumFractionDigits: 0 } : { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    return `${r.symbol}${v.toLocaleString(r.currency === "INR" ? "en-IN" : "en-US", opts)}`
  }

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, count, subtotal, open, setOpen, region, setRegion, fmt }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCart = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error("useCart outside CartProvider")
  return c
}
