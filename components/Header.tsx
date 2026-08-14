"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import SearchOverlay from "./SearchOverlay"

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Research Areas" },
  { href: "/coa", label: "COAs" },
  { href: "/library", label: "Research Library" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
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

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : ""
  }, [mobile])

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
            <button className="icon-btn" aria-label="Search" onClick={() => setSearch(true)}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </button>
            <Link href="/shop" className="icon-btn" aria-label="Shop">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>
            </Link>
            <button className="icon-btn burger" aria-label="Menu" onClick={() => setMobile((v) => !v)}>
              {mobile ? (
                <svg width="17" height="17" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${mobile ? "show" : ""}`}>
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} onClick={() => setMobile(false)}>{n.label}</Link>
        ))}
        <Link href="/products" onClick={() => setMobile(false)} style={{ color: "var(--blue)" }}>Explore Catalogue →</Link>
      </div>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  )
}
