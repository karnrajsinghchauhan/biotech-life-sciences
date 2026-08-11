import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getProducts, getShopInfo, isShopifyConfigured } from "@/lib/shopify"
import Reveal from "@/components/Reveal"
import { site } from "@/lib/config"

export const metadata: Metadata = {
  title: "Shop",
  description: "Purchase research compounds directly. Checkout and payments handled securely by Shopify.",
}

// Live storefront backed by Shopify. Revalidates so new products and price
// changes made in Shopify admin appear without a redeploy.
export const revalidate = 300

function money(amount: string, currency: string) {
  const n = Number(amount)
  try {
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency", currency, maximumFractionDigits: currency === "INR" ? 0 : 2,
    }).format(n)
  } catch {
    return `${currency} ${n}`
  }
}

export default async function ShopPage() {
  const configured = isShopifyConfigured()
  const [products, shop] = configured
    ? await Promise.all([getProducts(), getShopInfo()])
    : [[], null]
  const currency = shop?.paymentSettings.currencyCode ?? "INR"

  return (
    <>
      <section className="section tight alt">
        <div className="container">
          <span className="eyebrow">Storefront</span>
          <h1 className="h-section">Shop</h1>
          <p className="lede">
            Products, stock and pricing are managed in Shopify. Checkout and payments are handled
            securely by Shopify Checkout.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          {!configured ? (
            <div className="notice" style={{ maxWidth: 760 }}>
              <b>Shopify is not connected on this deployment.</b> Add{" "}
              <code>SHOPIFY_STORE_DOMAIN</code> and <code>SHOPIFY_STOREFRONT_ACCESS_TOKEN</code>, then
              redeploy. The research catalogue remains browsable at{" "}
              <Link href="/products" style={{ textDecoration: "underline" }}>/products</Link>.
            </div>
          ) : products.length === 0 ? (
            <div className="notice" style={{ maxWidth: 760 }}>
              <b>No products are published in the connected store yet.</b> Once products are added and
              published in Shopify admin they appear here automatically — no redeploy needed. In the
              meantime the full research catalogue is at{" "}
              <Link href="/products" style={{ textDecoration: "underline" }}>/products</Link>, and bulk
              enquiries go through <Link href="/wholesale" style={{ textDecoration: "underline" }}>wholesale</Link>.
            </div>
          ) : (
            <div className="grid-3">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) as 0 | 1 | 2}>
                  <article className="card pcard">
                    <Link href={`/shop/${p.handle}`} className="pcard-media vial-stage" aria-label={p.title}>
                      {p.featuredImage ? (
                        <Image
                          className="vial-img"
                          src={p.featuredImage.url}
                          alt={p.featuredImage.altText || `${p.title} research vial`}
                          width={p.featuredImage.width || 620}
                          height={p.featuredImage.height || 1343}
                          sizes="(max-width: 720px) 60vw, 300px"
                          style={{ height: "84%" }}
                        />
                      ) : (
                        <span className="small" style={{ zIndex: 2 }}>No image</span>
                      )}
                      {!p.availableForSale && <span className="pcard-tag">Sold out</span>}
                    </Link>
                    <div className="pcard-body">
                      <Link href={`/shop/${p.handle}`} className="pcard-name">{p.title}</Link>
                      <p className="pcard-desc">{p.description}</p>
                      <div className="pcard-foot">
                        <div className="pcard-price">
                          <span>from </span>{money(p.priceRange.minVariantPrice.amount, currency)}
                        </div>
                        <Link href={`/shop/${p.handle}`} className="btn primary sm">View</Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          <p className="small" style={{ marginTop: 30, maxWidth: 760 }}>
            {site.disclaimer}
          </p>
        </div>
      </section>
    </>
  )
}
