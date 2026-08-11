import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  isShopifyConfigured, createCart, getCart, addCartLines, updateCartLine, removeCartLine,
} from "@/lib/shopify"

// Server-side cart operations. The Storefront token stays on the server —
// the browser only ever sees cart contents and the checkout URL.
// The cart id lives in an httpOnly cookie so it survives reloads.

export const runtime = "nodejs"
const COOKIE = "btls_cart_id"
const COOKIE_OPTS = {
  httpOnly: true as const,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 14, // Shopify carts expire after ~10 days idle
}

function guard() {
  if (!isShopifyConfigured()) {
    return NextResponse.json(
      { error: "Shopify is not configured on this deployment." },
      { status: 503 }
    )
  }
  return null
}

/** Current cart, or null. */
export async function GET() {
  const blocked = guard()
  if (blocked) return blocked

  const id = cookies().get(COOKIE)?.value
  if (!id) return NextResponse.json({ cart: null })

  const cart = await getCart(id)
  return NextResponse.json({ cart })
}

/** Add a variant, creating the cart on first add. */
export async function POST(req: Request) {
  const blocked = guard()
  if (blocked) return blocked

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const merchandiseId = typeof body?.variantId === "string" ? body.variantId : ""
  const quantity = Number.isInteger(body?.quantity) ? Math.min(Math.max(body.quantity, 1), 99) : 1
  if (!merchandiseId.startsWith("gid://shopify/ProductVariant/")) {
    return NextResponse.json({ error: "Invalid variant" }, { status: 400 })
  }

  const existing = cookies().get(COOKIE)?.value
  let cart = existing ? await addCartLines(existing, [{ merchandiseId, quantity }]) : null

  // No cart yet, or the stored one expired on Shopify's side — start a new one.
  if (!cart) cart = await createCart([{ merchandiseId, quantity }])
  if (!cart) return NextResponse.json({ error: "Could not update cart" }, { status: 502 })

  const res = NextResponse.json({ cart })
  res.cookies.set(COOKIE, cart.id, COOKIE_OPTS)
  return res
}

/** Change a line quantity (0 removes it). */
export async function PATCH(req: Request) {
  const blocked = guard()
  if (blocked) return blocked

  const id = cookies().get(COOKIE)?.value
  if (!id) return NextResponse.json({ error: "No cart" }, { status: 404 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
  const lineId = typeof body?.lineId === "string" ? body.lineId : ""
  const quantity = Number.isInteger(body?.quantity) ? Math.min(Math.max(body.quantity, 0), 99) : 0
  if (!lineId) return NextResponse.json({ error: "Invalid line" }, { status: 400 })

  const cart = await updateCartLine(id, lineId, quantity)
  if (!cart) return NextResponse.json({ error: "Could not update cart" }, { status: 502 })
  return NextResponse.json({ cart })
}

/** Remove a line. */
export async function DELETE(req: Request) {
  const blocked = guard()
  if (blocked) return blocked

  const id = cookies().get(COOKIE)?.value
  if (!id) return NextResponse.json({ error: "No cart" }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const lineId = searchParams.get("lineId") || ""
  if (!lineId) return NextResponse.json({ error: "Invalid line" }, { status: 400 })

  const cart = await removeCartLine(id, lineId)
  if (!cart) return NextResponse.json({ error: "Could not update cart" }, { status: 502 })
  return NextResponse.json({ cart })
}
