import Link from "next/link"
import Image from "next/image"
import FacilityPackaging from "@/components/FacilityPackaging"
import Reveal from "@/components/Reveal"
import ProductCard from "@/components/ProductCard"
import FAQList from "@/components/FAQList"
import CountUp from "@/components/CountUp"
import ResearchApplications from "@/components/ResearchApplications"
import Testimonials from "@/components/Testimonials"
import BatchTransparency, { TransparencyPromise } from "@/components/BatchTransparency"
import { categories, featured, inCategory, primaryCategories, products, categoryBySlug, CategorySlug } from "@/lib/data"
import { faqs } from "@/lib/faqs"
import { site } from "@/lib/config"
import { shopCategoryLabel, shopCategoryColor } from "@/lib/shopLabels"
import ShopCategoryRail from "@/components/ShopCategoryRail"
import ShopProductCard from "@/components/ShopProductCard"
import BundleAssistant from "@/components/BundleAssistant"
import TrustGrid from "@/components/TrustGrid"
import PenPromoBanner from "@/components/PenPromoBanner"

const SHOP_CATEGORY_ORDER: CategorySlug[] = [
  ...primaryCategories,
  ...categories.map((c) => c.slug).filter((s) => !primaryCategories.includes(s)),
]

export default function Home() {
  return (
    <>
      {/* HERO — centered */}
      <section className="hero hero-centered">
        <div className="container hero-grid-centered">
          <Reveal>
            <span className="eyebrow" style={{ justifyContent: "center" }}>Research-grade biology</span>
            <h1 className="h-display" style={{ margin: "18px auto 20px", maxWidth: 900 }}>
              Precision Peptides.<br />
              <span style={{ color: "var(--blue)" }}>Built for Research.</span>
            </h1>
            <p className="lede" style={{ margin: "0 auto 30px" }}>
              A complete catalogue of research-grade compounds manufactured to exacting standards —
              HPLC &amp; MS verified, batch documented, and supplied strictly for laboratory research.
            </p>
            <div className="shop-hero-actions" style={{ marginBottom: 16, justifyContent: "center" }}>
              <a href="#shop-categories" className="btn primary">Shop Now</a>
              <BundleAssistant />
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 44, justifyContent: "center" }}>
              <Link href="/products" className="btn ghost sm">Explore Research Catalogue</Link>
              <Link href="/coa" className="btn ghost sm">Verify a COA</Link>
            </div>
          </Reveal>

          {/* Composition built from the company's own vial photography. */}
          <Reveal delay={1}>
            <div className="hero-vials" aria-hidden="true">
              <span className="hero-glow" />
              <span className="hero-floor" />
              <Image className="hero-vial d" src="/images/products/cjc-1295-no-dac.webp" alt="" width={620} height={1343} sizes="(max-width: 720px) 80px, 180px" />
              <Image className="hero-vial a" src="/images/products/ghk-cu.webp" alt="" width={620} height={1343} sizes="(max-width: 720px) 100px, 220px" />
              <Image className="hero-vial b" src="/images/products/retatrutide.webp" alt="" width={620} height={1343} priority sizes="(max-width: 720px) 140px, 300px" />
              <Image className="hero-vial c" src="/images/products/tirzepatide.webp" alt="" width={620} height={1343} sizes="(max-width: 720px) 100px, 220px" />
              <Image className="hero-vial e" src="/images/products/ipamorelin.webp" alt="" width={620} height={1343} sizes="(max-width: 720px) 80px, 180px" />
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="hero-stats">
              <div className="hero-stat"><b>≥ 98%</b><span>Purity specification</span></div>
              <div className="hero-stat"><b>HPLC + MS</b><span>Every batch verified</span></div>
              <div className="hero-stat"><b><CountUp to={products.length} suffix="+" /></b><span>Research compounds</span></div>
              <div className="hero-stat"><b>RUO</b><span>Research use only</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PEN PROMO BANNER */}
      <section className="section tight" style={{ paddingBottom: 0 }}>
        <div className="container">
          <PenPromoBanner />
        </div>
      </section>

      {/* SHOP-FIRST: CATEGORY RAIL */}
      <section className="section tight" id="shop-categories">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Shop by goal</span>
            <h2 className="h-section" style={{ fontSize: 28 }}>Find what you&apos;re here for</h2>
          </Reveal>
          <ShopCategoryRail />
        </div>
      </section>

      {/* SHOP-FIRST: PRODUCT GRID BY CATEGORY */}
      <section className="section">
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: 52 }}>
          {SHOP_CATEGORY_ORDER.map((slug) => {
            const prods = inCategory(slug)
            if (prods.length === 0) return null
            return (
              <Reveal key={slug}>
                <div id={`shop-${slug}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                    <h3 style={{ fontSize: 22, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: shopCategoryColor[slug], display: "inline-block" }} />
                      {shopCategoryLabel[slug]}
                    </h3>
                    <Link href={`/categories/${slug}`} className="small" style={{ color: "var(--blue)" }}>See all {prods.length} →</Link>
                  </div>
                  <div className="grid-4">
                    {prods.slice(0, 4).map((p) => <ShopProductCard key={p.slug} p={p} />)}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ABOUT / LEGITIMACY BAND */}
      <section className="section alt">
        <div className="container split center">
          <Reveal>
            <span className="eyebrow">Since {site.founded}</span>
            <h2 className="h-section" style={{ fontSize: 30 }}>Real standards, not adjectives</h2>
            <p style={{ color: "var(--ink-2)", fontSize: 15.5, maxWidth: 520 }}>
              {site.name} is headquartered in {site.location}. We source from vetted, audited manufacturing
              partners — not our own factory — and every released batch carries a third-party Certificate of
              Analysis you can check yourself, not just take our word for.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
              <Link href="/about" className="btn ghost sm">Our story →</Link>
              <Link href="/coa" className="btn ghost sm">Verify a COA →</Link>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="purity-badge">
              <span className="purity-num">≥98%</span>
              <span className="purity-cap">Purity specification, verified by RP-HPLC on every released batch.</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRIMARY CATEGORY SHOWCASES */}
      <section className="section alt">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Explore research areas</span>
            <h2 className="h-section">Three pillars of the catalogue</h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 30 }}>
            {primaryCategories.map((slug, idx) => {
              const c = categoryBySlug(slug)!
              const prods = inCategory(slug)
              return (
                <Reveal key={slug} delay={(idx % 3) as 0 | 1 | 2}>
                  <div className="showcase" style={idx % 2 ? { direction: "rtl" } : undefined}>
                    <div className="showcase-media" style={{ direction: "ltr", background: idx === 0 ? "linear-gradient(140deg,#e8f0fb,#d7e5f7)" : idx === 1 ? "linear-gradient(140deg,#e7f6f4,#d3ece9)" : "linear-gradient(140deg,#eef1f8,#dde4f2)" }}>
                      <svg viewBox="0 0 500 380" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
                        <g stroke={idx === 1 ? "#0e9a8d" : "#1156d6"} strokeWidth="1.2" opacity="0.35" fill="none">
                          {Array.from({ length: 7 }).map((_, i) => (
                            <path key={i} d={`M-20 ${40 + i * 52} C 120 ${10 + i * 52}, 240 ${70 + i * 52}, 520 ${30 + i * 52}`} />
                          ))}
                        </g>
                        <g fill={idx === 1 ? "#0e9a8d" : "#1156d6"} opacity="0.5">
                          {Array.from({ length: 14 }).map((_, i) => (
                            <circle key={i} cx={(i * 137) % 500} cy={(i * 89 + 40) % 380} r={i % 3 === 0 ? 5 : 3} />
                          ))}
                        </g>
                        <text x="40" y="330" fontFamily="monospace" fontSize="13" fill={idx === 1 ? "#0e9a8d" : "#1156d6"} opacity="0.6">
                          {String(idx + 1).padStart(2, "0")} / {c.name.toUpperCase()}
                        </text>
                      </svg>
                    </div>
                    <div className="showcase-body" style={{ direction: "ltr" }}>
                      <span className="eyebrow">{String(idx + 1).padStart(2, "0")} — {c.short}</span>
                      <h3 style={{ fontSize: 28 }}>{c.name}</h3>
                      <p style={{ color: "var(--ink-2)", fontSize: 15.5 }}>{c.text}</p>
                      <div className="showcase-compounds">
                        {prods.slice(0, 5).map((p) => (
                          <Link key={p.slug} href={`/products/${p.slug}`} className="pill">{p.name}</Link>
                        ))}
                      </div>
                      <div>
                        <Link href={`/categories/${c.slug}`} className="btn ghost sm">
                          Explore {prods.length} compounds →
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
              <div>
                <span className="eyebrow">Flagship catalogue</span>
                <h2 className="h-section">Featured research compounds</h2>
              </div>
              <Link href="/products" className="btn ghost sm">View all products →</Link>
            </div>
          </Reveal>
          <div className="grid-4" style={{ marginTop: 28 }}>
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4 > 2 ? 3 : (i % 4)) as 0 | 1 | 2 | 3}>
                <ProductCard p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ALL CATEGORIES */}
      <section className="section alt">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Research by area</span>
            <h2 className="h-section">Organized for the way research works</h2>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 28 }}>
            {categories.filter((c) => inCategory(c.slug).length > 0).map((c, i) => (
              <Reveal key={c.slug} delay={(i % 3) as 0 | 1 | 2}>
                <Link href={`/categories/${c.slug}`}>
                  <div className="card catcard">
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{c.name}</h3>
                    <p>{c.text}</p>
                    <span className="count">{inCategory(c.slug).length} compounds →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH & APPLICATIONS — evidence, labelled honestly */}
      <ResearchApplications />

      {/* COA VERIFICATION CTA */}
      <section className="section" style={{ background: "var(--navy)", color: "#fff" }}>
        <div className="container split wideleft center">
          <Reveal>
            <span className="eyebrow" style={{ color: "#7fb0ff" }}>Documentation first</span>
            <h2 className="h-section" style={{ color: "#fff" }}>Verify your batch</h2>
            <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: 520, marginBottom: 26 }}>
              Every released batch carries a batch-specific Certificate of Analysis — RP-HPLC purity,
              mass-spectrometry identity, test date and issuing laboratory. Type the batch number from
              your vial to check it against our registry.
            </p>
            <Link href="/coa" className="btn blue">Verify a COA →</Link>
          </Reveal>
          <Reveal delay={2}>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 16, padding: 28 }}>
              <div className="mono" style={{ fontSize: 12, color: "#7fb0ff", marginBottom: 14 }}>CERTIFICATE OF ANALYSIS — SPECIMEN FIELDS</div>
              {[["Product", "Catalogue name + SKU"], ["Batch", "Printed on your vial"], ["Purity", "RP-HPLC area-%"], ["Identity", "ESI-MS confirmed"], ["Status", "Released"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.1)", fontSize: 13.5 }}>
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FACILITY & PACKAGING — the company's own photography */}
      <FacilityPackaging />

      {/* BATCH TRANSPARENCY */}
      <BatchTransparency />
      <TransparencyPromise />
      <Testimonials />

      {/* TRUST GRID — replaces the old text-only standards list */}
      <TrustGrid />

      {/* RESEARCH LIBRARY PREVIEW */}
      <section className="section alt">
        <div className="container">
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
              <div>
                <span className="eyebrow">Knowledge centre</span>
                <h2 className="h-section">The Research Library</h2>
              </div>
              <Link href="/library" className="btn ghost sm">Browse the library →</Link>
            </div>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 28 }}>
            {[
              { slug: "how-to-read-a-coa", t: "How to Read a Certificate of Analysis", c: "COA Guide" },
              { slug: "understanding-hplc", t: "Understanding HPLC Purity Testing", c: "Laboratory Testing" },
              { slug: "peptide-stability-and-storage", t: "Peptide Stability, Storage & Handling", c: "Peptide Fundamentals" },
            ].map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) as 0 | 1 | 2}>
                <Link href={`/library/${a.slug}`}>
                  <div className="card" style={{ padding: 26 }}>
                    <span className="chip type">{a.c}</span>
                    <h3 style={{ fontSize: 19, margin: "14px 0 8px" }}>{a.t}</h3>
                    <span className="small" style={{ color: "var(--blue)", fontWeight: 600 }}>Read article →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHOLESALE */}
      <section className="section">
        <div className="container">
          <div className="showcase">
            <div className="showcase-body">
              <span className="eyebrow">Institutional supply</span>
              <h2 style={{ fontSize: 30 }}>Research Supply &amp; Wholesale</h2>
              <p style={{ color: "var(--ink-2)" }}>
                Bulk research orders, laboratory procurement, recurring supply and custom compound
                requests — with volume pricing and batch documentation on every consignment.
              </p>
              <div><Link href="/wholesale" className="btn primary">Request a Wholesale Quote</Link></div>
            </div>
            <div className="showcase-media" style={{ background: "linear-gradient(140deg,#0b1f3a,#12315c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18, padding: 36, width: "100%" }}>
                {[["Bulk Orders", "Volume pricing tiers"], ["Institutional", "Universities & CROs"], ["Recurring Supply", "Standing schedules"], ["Custom Requests", "Compounds on request"]].map(([t, d]) => (
                  <div key={t} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: "18px 16px" }}>
                    <b style={{ color: "#fff", fontSize: 14.5 }}>{t}</b>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5, marginTop: 4 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section alt">
        <div className="container" style={{ maxWidth: 860 }}>
          <Reveal>
            <span className="eyebrow">Common questions</span>
            <h2 className="h-section">Frequently asked questions</h2>
          </Reveal>
          <FAQList items={faqs.slice(0, 6)} />
          <div style={{ marginTop: 22 }}>
            <Link href="/faq" className="btn ghost sm">All questions →</Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section" style={{ textAlign: "center" }}>
        <div className="container">
          <Reveal>
            <h2 className="h-display" style={{ fontSize: "clamp(30px,4.4vw,52px)" }}>
              Precision Research.<br />Powered by Science.
            </h2>
            <p className="lede" style={{ margin: "18px auto 30px" }}>
              Explore the complete Biotech Life Sciences research catalogue — documented, verified, and
              supplied for laboratory research worldwide.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/products" className="btn primary">Explore Catalogue</Link>
              <Link href="/contact" className="btn ghost">Talk to Research Support</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
