import { NextResponse } from "next/server"
import { bySlug } from "@/lib/data"
import { shipping } from "@/lib/config"

// Order intake endpoint.
// Currently: validates, prices server-side, and returns an order reference.
// TODO (owner): persist orders (database or email notification) and/or create
// a Razorpay order here once gateway credentials are configured.

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { form, items, payMethod } = body || {}
  if (!form?.name || !form?.email || !form?.phone || !form?.address) {
    return NextResponse.json({ error: "Missing required details" }, { status: 400 })
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
  }

  // Server-side pricing — never trust client totals.
  let subtotal = 0
  for (const it of items) {
    const p = bySlug(it.slug)
    const s = p?.sizes.find((z: any) => z.label === it.size)
    const qty = Number(it.qty)
    if (!p || !s || !Number.isFinite(qty) || qty < 1 || qty > 99) {
      return NextResponse.json({ error: "Invalid cart item" }, { status: 400 })
    }
    subtotal += s.price * qty
  }
  const ship = subtotal >= shipping.freeAbove ? 0 : shipping.flatRate
  const total = subtotal + ship

  const orderId = `BTLS-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`

  // Log to server output for now (visible in hosting logs). Replace with
  // durable storage / email once configured.
  console.log("[ORDER]", JSON.stringify({ orderId, total, payMethod, form, items }, null, 0))

  return NextResponse.json({ orderId, subtotal, ship, total })
}
