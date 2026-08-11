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

/**
 * Normalise a store domain, or return null if the input clearly isn't one.
 *
 * Validates the SHAPE of what was typed before appending .myshopify.com —
 * otherwise any string at all (a pasted shell command, say) would come back
 * looking superficially valid.
 */
function normaliseDomain(input) {
  const raw = String(input || "").trim()
  if (!raw) return null

  // A pasted command or sentence — not a domain.
  if (/[\s&|;'"<>()$`\\]/.test(raw)) return null

  let d = raw.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").toLowerCase()
  if (!d) return null

  // Bare handle → add the suffix.
  if (!d.includes(".")) d = `${d}.myshopify.com`

  // Must be a plain hostname, and specifically a myshopify.com one.
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(d)) return null
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
  // Never throws — a bad domain or offline network returns a result object
  // so the caller can report it cleanly instead of crashing the process.
  try {
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
    if (!j.data?.shop) return { ok: false, detail: "unexpected response from Shopify" }
    return { ok: true, shop: j.data.shop, products: j.data.products.edges.map((e) => e.node) }
  } catch (e) {
    return { ok: false, detail: (e?.cause?.message || e.message || "network error") }
  }
}

/** Read --flag value / --flag=value from argv. */
function arg(name) {
  const i = process.argv.indexOf(`--${name}`)
  if (i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")) {
    return process.argv[i + 1]
  }
  const inline = process.argv.find((a) => a.startsWith(`--${name}=`))
  return inline ? inline.slice(name.length + 3) : null
}

;(async () => {
  console.log("\n── Connect your Shopify store ──────────────────────\n")

  // Non-interactive path: flags or environment. Falls back to prompting.
  const argDomain = arg("domain") || process.env.SHOPIFY_STORE_DOMAIN_INPUT
  const argToken = arg("token") || process.env.SHOPIFY_STOREFRONT_TOKEN_INPUT

  if (!argDomain || !argToken) {
    console.log("  Shopify admin → Settings → Apps and sales channels →")
    console.log("  Develop apps → your app → Storefront API → Install app.\n")
    if (!process.stdin.isTTY) {
      console.log("  ✖ No terminal available for prompts, and no values supplied.\n")
      console.log("    Run it with both values instead:\n")
      console.log("      node scripts/connect-store.mjs \\")
      console.log("        --domain your-store.myshopify.com \\")
      console.log("        --token your_storefront_token\n")
      rl.close()
      process.exit(1)
    }
  }

  const rawDomain = argDomain || (await ask("  Store domain (e.g. my-store.myshopify.com): "))
  const domain = normaliseDomain(rawDomain)
  if (!domain) {
    console.log(`\n  ✖ That isn't a valid store domain:`)
    console.log(`      ${JSON.stringify(String(rawDomain).slice(0, 70))}`)
    console.log(`\n    Expected something like  my-store.myshopify.com`)
    console.log(`    Use the permanent .myshopify.com address from`)
    console.log(`    Settings → Domains — not a custom domain, and not a`)
    console.log(`    pasted shell command.\n`)
    console.log(`    Nothing was written to .env.local.\n`)
    rl.close()
    process.exit(1)
  }
  console.log(`    → ${domain}`)

  const token = argToken || (await askSecret("  Storefront API access token (hidden): "))
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
