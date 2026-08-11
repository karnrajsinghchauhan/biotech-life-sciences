// ============================================================
// SHOPIFY STOREFRONT API CLIENT  (server-only)
//
// Provisioned through the Vercel Marketplace integration, which
// supplies SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.
// Neither carries a NEXT_PUBLIC_ prefix — every call in this file
// runs on the server, so the token never reaches the browser.
//
// Shopify owns catalog, cart, checkout and payments. This module is
// the only place that talks to it.
// ============================================================

import "server-only"

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "")
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
const API_VERSION = "2025-01"

export const isShopifyConfigured = () => Boolean(DOMAIN && TOKEN)

type GqlResult<T> = { data?: T; errors?: { message: string }[] }

async function shopify<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate: number | false = 300
): Promise<T | null> {
  if (!isShopifyConfigured()) return null
  try {
    const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN as string,
      },
      body: JSON.stringify({ query, variables }),
      ...(revalidate === false ? { cache: "no-store" as const } : { next: { revalidate } }),
    })
    if (!res.ok) {
      console.error("[shopify] HTTP", res.status)
      return null
    }
    const json = (await res.json()) as GqlResult<T>
    if (json.errors?.length) {
      console.error("[shopify] GraphQL", json.errors.map((e) => e.message).join("; "))
      return null
    }
    return json.data ?? null
  } catch (e) {
    console.error("[shopify] network", (e as Error).message)
    return null
  }
}

// ---------- types ----------
export type ShopifyMoney = { amount: string; currencyCode: string }

export type ShopifyVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: ShopifyMoney
  sku: string | null
}

export type ShopifyProduct = {
  id: string
  handle: string
  title: string
  description: string
  availableForSale: boolean
  featuredImage: { url: string; altText: string | null; width: number; height: number } | null
  priceRange: { minVariantPrice: ShopifyMoney }
  variants: ShopifyVariant[]
}

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  availableForSale
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } }
  variants(first: 20) {
    edges { node { id title availableForSale sku price { amount currencyCode } } }
  }
`

type RawProduct = Omit<ShopifyProduct, "variants"> & {
  variants: { edges: { node: ShopifyVariant }[] }
}

const flatten = (p: RawProduct): ShopifyProduct => ({
  ...p,
  variants: p.variants.edges.map((e) => e.node),
})

// ---------- catalog ----------
export async function getShopInfo() {
  const d = await shopify<{ shop: { name: string; paymentSettings: { currencyCode: string } } }>(
    `{ shop { name paymentSettings { currencyCode } } }`
  )
  return d?.shop ?? null
}

export async function getProducts(first = 100): Promise<ShopifyProduct[]> {
  const d = await shopify<{ products: { edges: { node: RawProduct }[] } }>(
    `query Products($first: Int!) { products(first: $first) { edges { node { ${PRODUCT_FIELDS} } } } }`,
    { first }
  )
  return d?.products.edges.map((e) => flatten(e.node)) ?? []
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const d = await shopify<{ product: RawProduct | null }>(
    `query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
    { handle }
  )
  return d?.product ? flatten(d.product) : null
}

// ---------- cart ----------
export type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { subtotalAmount: ShopifyMoney; totalAmount: ShopifyMoney }
  lines: {
    id: string
    quantity: number
    merchandise: {
      id: string
      title: string
      product: { title: string; handle: string; featuredImage: { url: string } | null }
      price: ShopifyMoney
    }
  }[]
}

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
  lines(first: 50) {
    edges { node {
      id quantity
      merchandise { ... on ProductVariant {
        id title price { amount currencyCode }
        product { title handle featuredImage { url } }
      } }
    } }
  }
`

type RawCart = Omit<ShopifyCart, "lines"> & { lines: { edges: { node: ShopifyCart["lines"][0] }[] } }
const flattenCart = (c: RawCart): ShopifyCart => ({ ...c, lines: c.lines.edges.map((e) => e.node) })

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[] = []
): Promise<ShopifyCart | null> {
  const d = await shopify<{ cartCreate: { cart: RawCart | null; userErrors: { message: string }[] } }>(
    `mutation CartCreate($lines: [CartLineInput!]) {
       cartCreate(input: { lines: $lines }) { cart { ${CART_FIELDS} } userErrors { message } }
     }`,
    { lines },
    false
  )
  return d?.cartCreate.cart ? flattenCart(d.cartCreate.cart) : null
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const d = await shopify<{ cart: RawCart | null }>(
    `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`,
    { id: cartId },
    false
  )
  return d?.cart ? flattenCart(d.cart) : null
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart | null> {
  const d = await shopify<{ cartLinesAdd: { cart: RawCart | null } }>(
    `mutation CartAdd($cartId: ID!, $lines: [CartLineInput!]!) {
       cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
     }`,
    { cartId, lines },
    false
  )
  return d?.cartLinesAdd.cart ? flattenCart(d.cartLinesAdd.cart) : null
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart | null> {
  if (quantity <= 0) return removeCartLine(cartId, lineId)
  const d = await shopify<{ cartLinesUpdate: { cart: RawCart | null } }>(
    `mutation CartUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
       cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
     }`,
    { cartId, lines: [{ id: lineId, quantity }] },
    false
  )
  return d?.cartLinesUpdate.cart ? flattenCart(d.cartLinesUpdate.cart) : null
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart | null> {
  const d = await shopify<{ cartLinesRemove: { cart: RawCart | null } }>(
    `mutation CartRemove($cartId: ID!, $lineIds: [ID!]!) {
       cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } }
     }`,
    { cartId, lineIds: [lineId] },
    false
  )
  return d?.cartLinesRemove.cart ? flattenCart(d.cartLinesRemove.cart) : null
}
