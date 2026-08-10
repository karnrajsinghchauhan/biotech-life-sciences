import { NextResponse } from "next/server"
import { insertServer, isServiceConfigured } from "@/lib/supabase"
import { appendInquiry, isSheetsConfigured } from "@/lib/sheets"

// Inquiry intake: contact, wholesale and custom-compound requests.
// Order of operations is deliberate — Supabase is the source of truth and is
// written first; the Google Sheets mirror is best-effort and never blocks the
// visitor's success state.

export const runtime = "nodejs"

const MAX = { name: 120, email: 200, company: 160, country: 80, product: 400, message: 4000 }

// Coarse in-memory rate limit. Resets on cold start, which is fine — it exists
// to blunt casual spam, not to be an authoritative quota.
const hits = new Map<string, number[]>()
const WINDOW_MS = 60_000
const LIMIT = 5

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > LIMIT
}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : ""

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  // Honeypot: a hidden field real people never fill in. Return success so a
  // bot cannot distinguish rejection from acceptance.
  if (typeof body?.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true })
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a minute and try again." },
      { status: 429 }
    )
  }

  const name = clean(body?.name, MAX.name)
  const email = clean(body?.email, MAX.email)
  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
  }

  const rawType = clean(body?.type, 24) || "contact"
  const type = ["contact", "wholesale", "custom_request"].includes(rawType) ? rawType : "contact"

  const row = {
    type,
    name,
    email,
    company: clean(body?.company, MAX.company) || null,
    country: clean(body?.country, MAX.country) || null,
    product: clean(body?.products ?? body?.product, MAX.product) || null,
    quantity: clean(body?.quantity, 120) || null,
    message: clean(body?.message, MAX.message) || null,
    order_ref: clean(body?.order, 80) || null,
    source_ip: ip.slice(0, 64),
  }

  let stored = false
  let storeError: string | null = null
  if (isServiceConfigured()) {
    const res = await insertServer("inquiries", row)
    stored = res.ok
    if (!res.ok) storeError = res.error
  }

  // Best-effort mirror to Google Sheets.
  let synced = false
  if (isSheetsConfigured()) {
    synced = await appendInquiry({
      timestamp: new Date().toISOString(),
      type,
      name,
      email,
      company: row.company ?? "",
      country: row.country ?? "",
      product: row.product ?? "",
      message: row.message ?? "",
    })
  }

  // Until a backend is provisioned, keep a server-log trail so no enquiry is
  // silently lost while the site is live.
  if (!stored) {
    console.log("[INQUIRY]", JSON.stringify({ ...row, storeError, backend: "unconfigured" }))
  }

  return NextResponse.json({ ok: true, stored, synced })
}
