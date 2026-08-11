#!/usr/bin/env node
/**
 * Point the site at your own Shopify store — interactively.
 *
 *   node scripts/connect-store.mjs
 *
 * Prompts for the store domain and Storefront token, normalises them,
 * writes them into .env.local (replacing any previous values rather than
 * appending duplicates), then immediately verifies the connection and
 * lists what the store actually returns.
 *
 * The token is not echoed while typing and is never printed back.
 */

import fs from "node:fs"
import path from "node:path"
import readline from "node:readline"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const ENV = path.join(ROOT, ".env.local")
const API_VERSION = "2025-01"

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((res) => rl.question(q, (a) => res(a.trim())))

/** Prompt without echoing what is typed. */
function askSecret(q) {
  return new Promise((res) => {
    process.stdout.write(q)
    const onData = (ch) => {
      const s = ch.toString()
      if (s === "\n" || s === "\r" || s === "") {
        process.stdin.removeListener("data", onData)
      }
    }
    process.stdin.on("data", onData)
    const originalWrite = rl._writeToOutput?.bind(rl)
    rl._writeToOutput = function (str) {
      if (str.includes(q)) originalWrite?.(str)
      // otherwise: swallow, so the token never appears on screen
    }
    rl.question("", (a) => {
      rl._writeToOutput = originalWrite
      process.stdout.write("\n")
      res(a.trim())
    })
  })
}

function normaliseDomain(input) {
  let d = input.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").trim().toLowerCase()
  if (d && !d.includes(".")) d = `${d}.myshopify.com`
  return d
}

/** Replace a key in .env.local, or append it if absent. Never duplicates. */
function upsertEnv(updates) {
  const lines = fs.existsSync(ENV) ? fs.readFileSync(ENV, "utf8").split("\n") : []
  const out = []
  const applied = new Set()
  for (const line of lines) {
    const eq = line.indexOf("=")
    const key = eq > 0 ? line.slice(0, eq).trim() : null
    if (key && key in updates) {
      if (!applied.has(key)) {
        out.push(`${key}=${updates[key]}`)
        applied.add(key)
      }
      // drop any further duplicates of this key
      continue
    }
    out.push(line)
  }
  for (const [k, v] of Object.entries(updates)) {
    if (!applied.has(k)) out.push(`${k}=${v}`)
  }
  fs.writeFileSync(ENV, out.join("\n").replace(/\n{3,}/g, "\n\n"), "utf8")
}

async function check(domain, token) {
  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({
      query: `{ shop { name paymentSettings { currencyCode } }
               products(first: 50) { edges { node { title handle availableForSale
                 variants(first: 5) { edges { node { title price { amount } } } } } } } }`,
    }),
  })
  if (!res.ok) return { ok: false, detail: `HTTP ${res.status}` }
  const j = await res.json()
  if (j.errors) return { ok: false, detail: j.errors.map((e) => e.message).join("; ") }
  return { ok: true, shop: j.data.shop, products: j.data.products.edges.map((e) => e.node) }
}

;(async () => {
  console.log("\n── Connect your Shopify store ──────────────────────\n")
  console.log("  Shopify admin → Settings → Apps and sales channels →")
  console.log("  Develop apps → your app → Storefront API → Install app.\n")

  const rawDomain = await ask("  Store domain (e.g. my-store.myshopify.com): ")
  const domain = normaliseDomain(rawDomain)
  if (!domain.endsWith(".myshopify.com")) {
    console.log(`\n  ✖ "${domain}" doesn't look like a myshopify.com domain.`)
    console.log(`    Use the permanent one from Settings → Domains, not a custom domain.\n`)
    rl.close()
    process.exit(1)
  }
  console.log(`    → ${domain}`)

  const token = await askSecret("  Storefront API access token (hidden): ")
  if (!token) {
    console.log("\n  ✖ No token entered.\n")
    rl.close()
    process.exit(1)
  }

  console.log("\n  Testing…")
  const result = await check(domain, token)
  if (!result.ok) {
    console.log(`\n  ✖ Connection failed: ${result.detail}`)
    console.log("    · 401/403 → the app may not be Installed, or the token is wrong")
    console.log("    · Check scopes: unauthenticated_read_product_listings,")
    console.log("      unauthenticated_write_checkouts")
    console.log("\n  Nothing was written to .env.local.\n")
    rl.close()
    process.exit(1)
  }

  upsertEnv({
    SHOPIFY_STORE_DOMAIN: domain,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: token,
  })

  console.log(`\n  ✓ Connected — ${result.shop.name} (${result.shop.paymentSettings.currencyCode})`)
  console.log(`  ✓ Saved to .env.local (replaced previous values, no duplicates)`)
  console.log(`\n  Products visible to the storefront: ${result.products.length}`)
  for (const p of result.products.slice(0, 15)) {
    const v = p.variants.edges.length
    console.log(`    · ${p.title}  (${v} variant${v === 1 ? "" : "s"})${p.availableForSale ? "" : "  — not available"}`)
  }
  if (result.products.length === 0) {
    console.log("    ⚠ none — imported products are DRAFT until you publish them.")
    console.log("      Shopify admin → Products → select all → Actions → Publish,")
    console.log("      and make sure the Online Store sales channel is enabled.")
  }

  console.log(`\n  Next — push the same values to production:\n`)
  console.log(`    vercel env rm SHOPIFY_STORE_DOMAIN production --yes`)
  console.log(`    vercel env rm SHOPIFY_STOREFRONT_ACCESS_TOKEN production --yes`)
  console.log(`    printf '%s' '${domain}' | vercel env add SHOPIFY_STORE_DOMAIN production`)
  console.log(`    vercel env add SHOPIFY_STOREFRONT_ACCESS_TOKEN production   # paste the token`)
  console.log(`    vercel deploy --prod --yes\n`)

  rl.close()
})()
