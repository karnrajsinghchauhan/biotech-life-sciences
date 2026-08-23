import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getProduct, getShopInfo, isShopifyConfigured } from "@/lib/shopify"
import ShopifyBuy from "@/components/ShopifyBuy"
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton"
import Reveal from "@/components/Reveal"
import { site } from "@/lib/config"
import { bySlug } from "@/lib/data"

export const revalidate = 300

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  if (!isShopifyConfigured()) return {}
  const p = await getProduct(params.handle)
  return p ? { title: p.title, description: p.description.slice(0, 155) } : {}
}

export default async function ShopProductPage({ params }: { params: { handle: string } }) {
  if (!isShopifyConfigured()) notFound()
  const [product, shop] = await Promise.all([getProduct(params.handle), getShopInfo()])
  if (!product) notFound()
  const currency = shop?.paymentSettings.currencyCode ?? "INR"

  return (
    <>
      <div className="container breadcrumb">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> /{" "}
        <span style={{ color: "var(--ink)" }}>{product.title}</span>
      </div>

      <section className="section tight">
        <div className="container split">
          <Reveal>
            <div
              className="vial-stage"
              style={{
                minHeight: 520, borderRadius: 20, border: "1px solid var(--line)",
                background: "radial-gradient(120% 90% at 50% 20%, #24272e 0%, #101216 55%, #08090b 100%)",
              }}
            >
              <span className="molecular-layer tr" aria-hidden="true" />
              {product.featuredImage ? (
                <Image
                  className="vial-img"
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || `${product.title} research vial`}
                  width={product.featuredImage.width || 620}
                  height={product.featuredImage.height || 1343}
                  priority
                  sizes="(max-width: 1024px) 70vw, 460px"
                  style={{ height: 470 }}
                />
              ) : (
                <span className="small" style={{ zIndex: 2, alignSelf: "center" }}>No image supplied</span>
              )}
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <h1 style={{ fontSize: "clamp(30px,3.6vw,44px)" }}>{product.title}</h1>
              {product.description && (
                <p style={{ color: "var(--ink-2)", fontSize: 15.5 }}>{product.description}</p>
              )}
              <div className="card" style={{ padding: 22 }}>
                <ShopifyBuy variants={product.variants} currency={currency} />
              </div>
              {bySlug(params.handle) && (
                <WhatsAppOrderButton product={bySlug(params.handle)!} className="btn primary wide" />
              )}
              <div className="notice">{site.disclaimer}</div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
