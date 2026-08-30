"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import SearchOverlay from "./SearchOverlay"
import CartDrawer from "./CartDrawer"

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/coa", label: "Verify" },
  { href: "/library", label: "Research" },
  { href: "/contact", label: "Support" },
]

function Logo() {
  // The company's actual logo, extracted from the catalogue PDF.
  return (
    <Link href="/" className="logo" aria-label="Biotech Life Sciences — home">
      <Image
        src="/images/brand/logo-mark.png"
        alt=""
        width={360}
        height={321}
        priority
        style={{ width: "auto", height: 30 }}
      />
      <span>
        Biotech<small>Life Sciences</small>
      </span>
    </Link>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [search, setSearch] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobile || cartOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobile, cartOpen])

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = mobileMenuRef.current
    if (!el) return
    if (mobile) el.removeAttribute("inert")
    else el.setAttribute("inert", "")
  }, [mobile])

  useEffect(() => {
    let active = true
    const loadCartCount = async () => {
      try {
        const res = await fetch("/api/shopify/cart", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (active) setCartCount(data.cart?.totalQuantity ?? 0)
      } catch {
        // Cart access remains available even when the count request is unavailable.
      }
    }
    void loadCartCount()

    const onCartUpdated = (event: Event) => {
      const count = (event as CustomEvent<{ count?: number }>).detail?.count
      if (typeof count === "number") setCartCount(count)
      else void loadCartCount()
    }
    window.addEventListener("btls-cart-updated", onCartUpdated)
    return () => {
      active = false
      window.removeEventListener("btls-cart-updated", onCartUpdated)
    }
  }, [])

  const openCart = () => {
    setMobile(false)
    setCartOpen(true)
  }

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <Logo />
          <nav className="nav" aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}>{n.label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <button className="icon-btn" type="button" aria-label="Search" onClick={() => setSearch(true)}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </button>
            <button className="icon-btn" type="button" aria-label={`Cart${cartCount ? `, ${cartCount} item${cartCount === 1 ? "" : "s"}` : ""}`} aria-controls="cart-drawer" aria-expanded={cartOpen} onClick={openCart}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 7h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>
              {cartCount > 0 && <span className="cart-badge" aria-hidden="true">{cartCount > 99 ? "99+" : cartCount}</span>}
            </button>
            <button className="icon-btn burger" type="button" aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={mobile} onClick={() => setMobile((v) => !v)}>
              {mobile ? (
                <svg width="17" height="17" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div ref={mobileMenuRef} className={`mobile-menu ${mobile ? "show" : ""}`} aria-hidden={!mobile}>
        <button className="mobile-cart-link" type="button" onClick={openCart}>
          <span>Research cart</span>
          <span>{cartCount ? `${cartCount} item${cartCount === 1 ? "" : "s"}` : "Empty"}</span>
        </button>
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} onClick={() => setMobile(false)}>{n.label}</Link>
        ))}
        <Link href="/shop" onClick={() => setMobile(false)} style={{ color: "var(--mint)" }}>Enter storefront →</Link>
      </div>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCountChange={setCartCount} />
    </>
  )
}
