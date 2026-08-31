import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { products, bySlug, categoryBySlug } from "@/lib/data"
import { coaForProduct, param } from "@/lib/coa"
import Vial from "@/components/Vial"
import Pen from "@/components/Pen"
import ProductViewer from "@/components/ProductViewer"
import ShopifyBuy from "@/components/ShopifyBuy"
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton"
import Reveal from "@/components/Reveal"
import SpecTable from "@/components/SpecTable"
import CoaTable, { type CoaRow } from "@/components/CoaTable"
import RuoNotice from "@/components/RuoNotice"
import TopResearchAreas from "@/components/TopResearchAreas"
import FulfillmentBadges from "@/components/FulfillmentBadges"
import { getProduct, getShopInfo, isShopifyConfigured } from "@/lib/shopify"

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export const revalidate = 300

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = bySlug(params.slug)
  return product
    ? { title: `${product.name} — Research Compound`, description: product.overview.slice(0, 155) }
    : {}
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = bySlug(params.slug)
  if (!product) notFound()

  const configured = isShopifyConfigured()
  const [shopifyProduct, shop] = configured
    ? await Promise.all([getProduct(product.slug), getShopInfo()])
    : [null, null]
  const currency = shop?.paymentSettings.currencyCode ?? "INR"
  const category = categoryBySlug(product.category)!
  const coas = coaForProduct(product.slug)
  const coaRows: CoaRow[] = coas.map((c) => ({
    batch: c.batch,
    testDate: c.testDate,
    purity: param(c, "Purity") ?? "Not reported",
    identity: param(c, "Identity") ?? "Not reported",
    pdf: c.pdf,
  }))

  return (
    <>
      <div className="container breadcrumb minimal-breadcrumb">
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <Link href={`/categories/${category.slug}`}>{category.name}</Link>
        <span>/</span>
        <strong>{product.name}</strong>
      </div>

      <section className="minimal-product-page">
        <div className="container minimal-product-hero">
          <Reveal>
            <div className="minimal-product-visual">
              {product.image ? (
                <ProductViewer
                  src={product.image}
                  alt={`${product.name} research vial${product.code ? ` (${product.code})` : ""} — Biotech Life Sciences`}
                  code={product.code}
                  sku={product.sku}
                  form={product.form}
                />
              ) : (
                <div className="vial-stage minimal-vial-fallback">
                  <div>
                    {product.deviceType === "pen"
                      ? <Pen code={product.code} name={product.name} size={210} />
                      : <Vial code={product.code} name={product.name} size={210} />}
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="minimal-buy-panel">
              <span className="minimal-kicker">{category.name}</span>
              <h1>{product.name}</h1>
              {product.altName && <p className="minimal-product-alias">{product.altName}</p>}
              <p className="minimal-product-summary">{product.overview}</p>

              <div className="minimal-product-facts" aria-label="Essential product facts">
                <span><small>SKU</small>{product.sku}</span>
                <span><small>Purity</small>{product.purity || "Batch verified"}</span>
                <span><small>Form</small>{product.form}</span>
              </div>

              <TopResearchAreas research={product.research} />
              <FulfillmentBadges />

              <div className="minimal-buy-card">
                {shopifyProduct && shopifyProduct.variants.length > 0 ? (
                  <ShopifyBuy variants={shopifyProduct.variants} currency={currency} />
                ) : (
                  <div className="minimal-unlisted">
                    <p>Direct purchase is not yet available for this compound.</p>
                    <Link href={`/wholesale?product=${encodeURIComponent(product.name)}`} className="btn primary wide">
                      Request availability
                    </Link>
                  </div>
                )}
              </div>

              <WhatsAppOrderButton product={product} size={product.sizes[0]} className="btn ghost wide" />

              <RuoNotice />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="minimal-product-evidence">
        <div className="container minimal-product-evidence-grid">
          <Reveal>
            <div>
              <span className="minimal-kicker">Research context</span>
              <h2>What researchers study.</h2>
              <ul>
                {product.research.slice(0, 4).map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p>Research areas are provided as scientific context, not as efficacy or safety claims.</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="minimal-document-card">
              <span className="signal-dot" aria-hidden="true" />
              <small>Batch documentation</small>
              <h3>{coas.length > 0 ? `${coas.length} released batch${coas.length === 1 ? "" : "es"}` : "Supplied with order"}</h3>
              <p>Use the batch number printed on the vial to confirm identity and purity documentation.</p>
              <Link href="/coa" className="btn primary">Verify a COA <span aria-hidden="true">↗</span></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="minimal-product-page" style={{ paddingTop: 0 }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
          <SpecTable product={product} />
          <CoaTable coas={coaRows} />
        </div>
      </section>
    </>
  )
}
