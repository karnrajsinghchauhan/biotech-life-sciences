#!/usr/bin/env node
/**
 * Check which Shopify store this project is pointed at, and whether the
 * tokens in .env.local actually work.
 *
 *   node scripts/verify-shopify.mjs
 *
 * Prints only non-secret facts (store name, domain, product count).
 * Token values are never printed — only whether they are present and valid.
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const API_VERSION = "2025-01"

const envPath = path.join(ROOT, ".env.local")
const env = fs.existsSync(envPath)
  ? Object.fromEntries(
      fs.readFileSync(envPath, "utf8")
        .split("\n")
        .filter((l) => l.trim() && !l.startsWith("#"))
        .map((l) => {
          const i = l.indexOf("=")
          return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")]
        })
    )
  : {}

const DOMAIN = (env.SHOPIFY_STORE_DOMAIN || "").replace(/^https?:\/\//, "")
const STOREFRONT = env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
const ADMIN = env.SHOPIFY_ADMIN_ACCESS_TOKEN

const mark = (ok) => (ok ? "✓" : "✖")
const VERCEL_PROVISIONED = /^vercel-store-/

// Diagnostic: which keys appear, how often, and which line wins.
// Prints key names and line numbers only — never values.
function keyDiagnostics() {
  if (!fs.existsSync(envPath)) return []
  const lines = fs.readFileSync(envPath, "utf8").split("\n")
  const seen = new Map()
  lines.forEach((l, i) => {
    if (!l.trim() || l.startsWith("#")) return
    const eq = l.indexOf("=")
    if (eq < 1) return
    const key = l.slice(0, eq).trim()
    if (!/^[A-Z0-9_]+$/.test(key)) return
    if (!seen.has(key)) seen.set(key, [])
    seen.get(key).push(i + 1)
  })
  return [...seen.entries()]
}

console.log("\n── Shopify connection ──────────────────────────────\n")
console.log(`  .env.local          ${mark(fs.existsSync(envPath))} ${fs.existsSync(envPath) ? "found" : "MISSING"}`)
console.log(`  STORE_DOMAIN        ${mark(!!DOMAIN)} ${DOMAIN || "not set"}`)
console.log(`  STOREFRONT token    ${mark(!!STOREFRONT)} ${STOREFRONT ? "present" : "not set"}`)
console.log(`  ADMIN token         ${mark(!!ADMIN)} ${ADMIN ? "present" : "not set (needed only for seeding)"}`)

const diag = keyDiagnostics()
console.log(`\n  Keys found in .env.local (${diag.length}):`)
for (const [key, lineNums] of diag) {
  const dup = lineNums.length > 1 ? `  ⚠ ${lineNums.length}× on lines ${lineNums.join(", ")} — last wins` : ``
  console.log(`    ${key.padEnd(34)} line ${lineNums[lineNums.length - 1]}${dup}`)
}
if (!diag.some(([k]) => k === "SHOPIFY_ADMIN_ACCESS_TOKEN")) {
  console.log(`\n  → SHOPIFY_ADMIN_ACCESS_TOKEN is absent from this file entirely.`)
}

if (DOMAIN && VERCEL_PROVISIONED.test(DOMAIN)) {
  console.log(
    "\n  ⚠ This is the Vercel-provisioned store, not your own Shopify account.\n" +
    "    Replace SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in\n" +
    "    .env.local with your store's values to switch over."
  )
}

async function storefrontCheck() {
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT,
    },
    body: JSON.stringify({
      query: `{ shop { name paymentSettings { currencyCode } }
               products(first: 250) { edges { node { title handle status: availableForSale } } } }`,
    }),
  })
  if (!res.ok) return { ok: false, detail: `HTTP ${res.status}` }
  const j = await res.json()
  if (j.errors) return { ok: false, detail: j.errors.map((e) => e.message).join("; ") }
  return {
    ok: true,
    shop: j.data.shop,
    products: j.data.products.edges.map((e) => e.node),
  }
}

async function adminCheck() {
  const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": ADMIN },
    body: JSON.stringify({ query: `{ shop { name myshopifyDomain currencyCode } }` }),
  })
  const text = await res.text()
  if (!res.ok) return { ok: false, detail: `HTTP ${res.status} ${text.slice(0, 120)}` }
  const j = JSON.parse(text)
  if (j.errors) return { ok: false, detail: JSON.stringify(j.errors).slice(0, 200) }
  return { ok: true, shop: j.data.shop }
}

;(async () => {
  if (!DOMAIN || !STOREFRONT) {
    console.log("\n  Cannot test: set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN first.\n")
    process.exit(1)
  }

  console.log("\n── Live checks ─────────────────────────────────────\n")
  try {
    const sf = await storefrontCheck()
    if (sf.ok) {
      console.log(`  Storefront API      ✓ connected`)
      console.log(`    store             ${sf.shop.name}`)
      console.log(`    currency          ${sf.shop.paymentSettings.currencyCode}`)
      console.log(`    products visible   ${sf.products.length}`)
      if (sf.products.length === 0) {
        console.log(`    ⚠ no products — add them in Shopify admin, or run:`)
        console.log(`      node scripts/seed-shopify.mjs           (dry run)`)
        console.log(`      node scripts/seed-shopify.mjs --commit  (creates drafts)`)
      } else {
        for (const p of sf.products.slice(0, 12)) {
          console.log(`      · ${p.title}${p.status ? "" : "  (unavailable)"}`)
        }
      }
    } else {
      console.log(`  Storefront API      ✖ ${sf.detail}`)
      console.log(`    Check the token has unauthenticated_read_product_listings`)
      console.log(`    and unauthenticated_write_checkouts scopes.`)
    }
  } catch (e) {
    console.log(`  Storefront API      ✖ ${e.message}`)
  }

  if (ADMIN) {
    try {
      const ad = await adminCheck()
      console.log(
        ad.ok
          ? `  Admin API           ✓ connected (${ad.shop.name}, ${ad.shop.currencyCode})`
          : `  Admin API           ✖ ${ad.detail}`
      )
      if (!ad.ok) console.log(`    Check scopes: write_products, write_files.`)
    } catch (e) {
      console.log(`  Admin API           ✖ ${e.message}`)
    }
  }
  console.log("")
})()
