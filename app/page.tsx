import Image from "next/image"
import Link from "next/link"
import HomeProductSpotlight from "@/components/HomeProductSpotlight"
import Reveal from "@/components/Reveal"
import { bySlug, categories, inCategory } from "@/lib/data"
import { shopCategoryLabel } from "@/lib/shopLabels"

const FEATURED_SLUGS = ["retatrutide", "ghk-cu", "bpc-157-tb-500", "tirzepatide"] as const
const CATEGORY_SLUGS = ["metabolic", "tissue-repair", "dermal", "cellular", "cognitive", "longevity"] as const

const spotlightProducts = FEATURED_SLUGS.map((slug) => bySlug(slug)!).map((product) => ({
  slug: product.slug,
  name: product.name,
  image: product.image!,
  category: shopCategoryLabel[product.category],
  descriptor: product.altName || product.compoundType,
  size: product.sizes[0].label,
  price: `₹${product.sizes[0].price.toLocaleString("en-IN")}`,
  purity: product.purity?.replace(" (RP-HPLC)", "") || "Batch verified",
}))

const featuredProducts = FEATURED_SLUGS.map((slug) => bySlug(slug)!)

export default function Home() {
  return (
    <>
      <section className="minimal-hero">
        <Image
          className="minimal-hero-image"
          src="/images/editorial/performance-hero.jpg"
          alt="Adult track athlete sprinting in a dark studio"
          fill
          priority
          sizes="100vw"
        />
        <div className="minimal-hero-shade" aria-hidden="true" />
        <div className="container minimal-hero-inner">
          <Reveal>
            <span className="minimal-kicker">Laboratory research · Since 2000</span>
            <h1>Precision in<br />every vial.</h1>
            <p>
              A focused catalogue of documented research compounds. Batch verification first. Nothing extra.
            </p>
            <div className="minimal-actions">
              <Link href="/shop" className="btn primary">Shop compounds</Link>
              <Link href="/coa" className="btn glass">Verify a batch</Link>
            </div>
          </Reveal>
          <div className="minimal-hero-note">
            <span className="signal-dot" aria-hidden="true" />
            Editorial imagery does not depict product use. Research use only.
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Quality standards">
        <div className="container proof-strip-grid">
          <div><strong>≥98%</strong><span>Purity specification</span></div>
          <div><strong>HPLC + MS</strong><span>Batch verified</span></div>
          <div><strong>COA</strong><span>Batch-level record</span></div>
          <div><strong>RUO</strong><span>Laboratory use only</span></div>
        </div>
      </section>

      <section className="minimal-section" id="featured">
        <div className="container">
          <Reveal>
            <div className="minimal-heading-row">
              <div>
                <span className="minimal-kicker">The essentials</span>
                <h2>Choose your research compound.</h2>
              </div>
              <Link href="/shop" className="text-link">View all products <span aria-hidden="true">↗</span></Link>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <HomeProductSpotlight products={spotlightProducts} />
          </Reveal>
        </div>
      </section>

      <section className="minimal-section compact product-edit">
        <div className="container">
          <Reveal>
            <div className="minimal-heading-row">
              <div>
                <span className="minimal-kicker">Selected catalogue</span>
                <h2>Four compounds. One clear path.</h2>
              </div>
            </div>
          </Reveal>
          <div className="minimal-product-grid">
            {featuredProducts.map((product, index) => (
              <Reveal key={product.slug} delay={(index % 4) as 0 | 1 | 2 | 3}>
                <Link href={`/products/${product.slug}`} className="minimal-product-card">
                  <div className="minimal-product-media">
                    <span className="minimal-product-index">0{index + 1}</span>
                    <Image
                      src={product.image!}
                      alt={`${product.name} research vial`}
                      width={620}
                      height={1343}
                      sizes="(max-width: 720px) 75vw, 300px"
                    />
                  </div>
                  <div className="minimal-product-info">
                    <span>{shopCategoryLabel[product.category]}</span>
                    <h3>{product.name}</h3>
                    <div><b>From ₹{product.sizes[0].price.toLocaleString("en-IN")}</b><em aria-hidden="true">↗</em></div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="minimal-category-section">
        <div className="container">
          <Reveal>
            <span className="minimal-kicker">Browse by research area</span>
            <div className="minimal-category-list">
              {CATEGORY_SLUGS.map((slug, index) => {
                const category = categories.find((item) => item.slug === slug)!
                return (
                  <Link key={slug} href={`/categories/${slug}`}>
                    <span>0{index + 1}</span>
                    <strong>{category.name}</strong>
                    <small>{inCategory(slug).length} compounds</small>
                    <em aria-hidden="true">↗</em>
                  </Link>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="minimal-section editorial-section">
        <div className="container editorial-grid">
          <Reveal>
            <div className="editorial-image-wrap">
              <Image
                src="/images/editorial/movement-study.jpg"
                alt="Adult track athlete preparing at starting blocks"
                fill
                sizes="(max-width: 900px) 100vw, 46vw"
              />
              <span>Movement study / 01</span>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="editorial-copy">
              <span className="minimal-kicker">Inspired by discipline</span>
              <h2>Movement asks the question.<br />Research tests it.</h2>
              <p>
                Our editorial imagery celebrates the discipline behind human performance. It does not depict product use. Every catalogue item is supplied strictly for laboratory research.
              </p>
              <div className="minimal-actions">
                <Link href="/library" className="btn primary">Research library</Link>
                <Link href="/research-use-only" className="text-link">Research use policy <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="verification-section">
        <div className="container verification-grid">
          <Reveal>
            <span className="minimal-kicker">Documentation first</span>
            <h2>Verification is the product.</h2>
            <p>Every released batch is connected to the evidence that matters: identity, purity, and batch record.</p>
            <Link href="/coa" className="btn ink">Verify a COA</Link>
          </Reveal>
          <Reveal delay={1}>
            <div className="verification-card" aria-label="Certificate of analysis summary">
              <div><span>01</span><strong>Batch ID</strong><small>Printed on the vial</small></div>
              <div><span>02</span><strong>HPLC purity</strong><small>Area-percent result</small></div>
              <div><span>03</span><strong>MS identity</strong><small>Target mass confirmed</small></div>
              <div className="verification-status"><span className="signal-dot" aria-hidden="true" /> Released</div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="minimal-final">
        <div className="container">
          <Reveal>
            <span className="minimal-kicker">Start with the evidence</span>
            <h2>Research compounds.<br />Precisely documented.</h2>
            <Link href="/shop" className="btn primary">Enter the storefront <span aria-hidden="true">↗</span></Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
