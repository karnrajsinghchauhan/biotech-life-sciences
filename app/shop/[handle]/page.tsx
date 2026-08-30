import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getProduct, getShopInfo, isShopifyConfigured } from "@/lib/shopify"
import ShopifyBuy from "@/components/ShopifyBuy"
import Reveal from "@/components/Reveal"
import { site } from "@/lib/config"
import { isAnyVariantAvailable } from "@/lib/availability"
import { buildShopifyProductWhatsAppLink } from "@/lib/whatsapp"

export const revalidate = 300

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  if (!isShopifyConfigured()) return {}
  const product = await getProduct(params.handle)
  return product ? { title: product.title, description: product.description.slice(0, 155) } : {}
}

export default async function ShopProductPage({ params }: { params: { handle: string } }) {
  if (!isShopifyConfigured()) notFound()
  const [product, shop] = await Promise.all([getProduct(params.handle), getShopInfo()])
  if (!product) notFound()
  const currency = shop?.paymentSettings.currencyCode ?? "INR"

  return (
    <>
      <div className="container breadcrumb minimal-breadcrumb">
        <Link href="/shop">Shop</Link><span>/</span><strong>{product.title}</strong>
      </div>

      <section className="minimal-product-page">
        <div className="container minimal-product-hero">
          <Reveal>
            <div className="minimal-shopify-visual">
              {product.featuredImage ? (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || `${product.title} research vial`}
                  width={product.featuredImage.width || 620}
                  height={product.featuredImage.height || 1343}
                  priority
                  sizes="(max-width: 900px) 82vw, 46vw"
                />
              ) : <span>Image unavailable</span>}
              <small>Live catalogue / Shopify</small>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="minimal-buy-panel">
              <span className="minimal-kicker">Research compound</span>
              <h1>{product.title}</h1>
              {product.description && <p className="minimal-product-summary">{product.description}</p>}

              <div className="minimal-product-facts" aria-label="Purchase information">
                <span><small>Availability</small>{isAnyVariantAvailable(product.variants) ? "In stock" : "Enquire"}</span>
                <span><small>Cart</small>Persistent</span>
                <span><small>Checkout</small>Shopify secured</span>
              </div>

              <div className="minimal-buy-card">
                <ShopifyBuy variants={product.variants} currency={currency} />
              </div>

              <a
                href={buildShopifyProductWhatsAppLink(product.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn ghost wide whatsapp-btn"
              >
                Order on WhatsApp
              </a>

              <p className="minimal-ruo-notice">{site.disclaimer}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
