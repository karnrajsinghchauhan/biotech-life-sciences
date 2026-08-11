#!/usr/bin/env node
/**
 * Seed the 8 catalogue products into a Shopify store.
 *
 *   node scripts/seed-shopify.mjs            # dry run — probes the API, creates nothing
 *   node scripts/seed-shopify.mjs --commit   # actually creates products
 *
 * Requires in .env.local:
 *   SHOPIFY_STORE_DOMAIN        your-store.myshopify.com
 *   SHOPIFY_ADMIN_ACCESS_TOKEN  Admin API token, scopes: write_products, write_files
 *
 * PRICES: read from lib/data.ts, where they are PLACEHOLDERS invented for
 * layout. Set real prices in Shopify admin after seeding, or edit lib/data.ts
 * first. The script prints every price before writing so nothing goes live
 * unnoticed.
 *
 * Default product status is DRAFT — nothing becomes publicly purchasable
 * until you publish it in Shopify admin.
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const COMMIT = process.argv.includes("--commit")
const API_VERSION = "2025-01"

// ---------- env ----------
function loadEnv() {
  const p = path.join(ROOT, ".env.local")
  if (!fs.existsSync(p)) return {}
  return Object.fromEntries(
    fs.readFileSync(p, "utf8")
      .split("\n")
      .filter((l) => l.trim() && !l.startsWith("#"))
      .map((l) => {
        const i = l.indexOf("=")
        return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")]
      })
  )
}
const env = { ...loadEnv(), ...process.env }
const DOMAIN = (env.SHOPIFY_STORE_DOMAIN || "").replace(/^https?:\/\//, "")
const ADMIN = env.SHOPIFY_ADMIN_ACCESS_TOKEN

if (!DOMAIN || !ADMIN) {
  console.error("\n✖ Missing credentials.\n")
  console.error("  Add to .env.local:")
  console.error("    SHOPIFY_STORE_DOMAIN=your-store.myshopify.com")
  console.error("    SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_…\n")
  console.error("  Shopify admin → Settings → Apps and sales channels →")
  console.error("  Develop apps → Create an app → Configure Admin API scopes →")
  console.error("  enable write_products and write_files → Install → reveal token.\n")
  process.exit(1)
}

// ---------- GraphQL ----------
async function gql(query, variables = {}) {
  const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": ADMIN },
    body: JSON.stringify({ query, variables }),
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`)
  }
  if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 400))
  return json.data
}

/** Confirm the mutation signature this API version expects before writing. */
async function probeSchema() {
  const d = await gql(`{
    __type(name: "Mutation") { fields(includeDeprecated: false) {
      name args { name type { kind name ofType { kind name } } }
    } }
  }`)
  const fields = d.__type.fields
  const find = (n) => fields.find((f) => f.name === n)
  const argOf = (n) => {
    const f = find(n)
    if (!f) return null
    return f.args.map((a) => `${a.name}: ${a.type.name || a.type.ofType?.name || a.type.kind}`)
  }
  return {
    productCreate: argOf("productCreate"),
    productVariantsBulkCreate: argOf("productVariantsBulkCreate"),
    productCreateMedia: argOf("productCreateMedia"),
    stagedUploadsCreate: argOf("stagedUploadsCreate"),
  }
}

// ---------- read catalogue from lib/data.ts ----------
function readCatalogue() {
  const src = fs.readFileSync(path.join(ROOT, "lib", "data.ts"), "utf8")
  const out = []
  // Only the entries carrying real catalogue photography (the 8 PDF products).
  const re = /\{\s*slug:\s*"([^"]+)",\s*sku:\s*"([^"]+)",\s*code:\s*"([^"]+)",\s*image:\s*"([^"]+)",\s*name:\s*"([^"]+)"([\s\S]*?)\n  \},/g
  let m
  while ((m = re.exec(src))) {
    const [, slug, sku, code, image, name, rest] = m
    const alt = rest.match(/altName:\s*"([^"]+)"/)?.[1] ?? null
    const type = rest.match(/compoundType:\s*"([^"]+)"/)?.[1] ?? "Peptide"
    const overview = rest.match(/overview:\s*"((?:[^"\\]|\\.)*)"/)?.[1]?.replace(/\\"/g, '"') ?? ""
    const sizes = [...rest.matchAll(/\{\s*label:\s*"([^"]+)",\s*price:\s*(\d+)\s*\}/g)]
      .map((s) => ({ label: s[1], price: Number(s[2]) }))
    const purity = rest.match(/purity:\s*"([^"]+)"/)?.[1] ?? "≥ 98% (RP-HPLC)"
    out.push({ slug, sku, code, image, name, alt, type, overview, sizes, purity })
  }
  return out
}

const RUO =
  "For laboratory research use only. Not for human or veterinary consumption, " +
  "diagnosis, treatment, or prevention of disease."

const describe = (p) =>
  `<p>${p.overview}</p>` +
  `<p><strong>Research use only.</strong> ${RUO}</p>` +
  `<ul><li>Catalogue number: ${p.sku}</li><li>Vial code: ${p.code}</li>` +
  `<li>Compound type: ${p.type}</li><li>Purity specification: ${p.purity}</li>` +
  `<li>Form: Lyophilized powder</li><li>Storage: −20 °C, protect from light</li></ul>`

// ---------- image upload ----------
async function uploadImage(localPath, filename) {
  const bytes = fs.readFileSync(localPath)
  const staged = await gql(
    `mutation Staged($input: [StagedUploadInput!]!) {
       stagedUploadsCreate(input: $input) {
         stagedTargets { url resourceUrl parameters { name value } }
         userErrors { message }
       }
     }`,
    {
      input: [{
        filename,
        mimeType: "image/webp",
        resource: "IMAGE",
        httpMethod: "POST",
        fileSize: String(bytes.length),
      }],
    }
  )
  const target = staged.stagedUploadsCreate.stagedTargets?.[0]
  if (!target) throw new Error("stagedUploadsCreate returned no target")

  const form = new FormData()
  for (const p of target.parameters) form.append(p.name, p.value)
  form.append("file", new Blob([bytes], { type: "image/webp" }), filename)
  const up = await fetch(target.url, { method: "POST", body: form })
  if (!up.ok) throw new Error(`staged upload failed: HTTP ${up.status}`)
  return target.resourceUrl
}

// ---------- create ----------
async function createProduct(p) {
  const created = await gql(
    `mutation Create($product: ProductCreateInput!) {
       productCreate(product: $product) {
         product { id title handle options { id name optionValues { id name } } variants(first:1){ edges { node { id } } } }
         userErrors { field message }
       }
     }`,
    {
      product: {
        title: p.name,
        descriptionHtml: describe(p),
        vendor: "Biotech Life Sciences",
        productType: p.type,
        status: "DRAFT", // never auto-publish
        tags: ["research-use-only", p.type.toLowerCase().replace(/\s+/g, "-"), p.code],
        productOptions: [{ name: "Size", values: p.sizes.map((s) => ({ name: s.label })) }],
      },
    }
  )
  const errs = created.productCreate.userErrors
  if (errs?.length) throw new Error(errs.map((e) => e.message).join("; "))
  const product = created.productCreate.product

  // Replace the auto-created variants with priced ones.
  const variants = p.sizes.map((s) => ({
    optionValues: [{ optionName: "Size", name: s.label }],
    price: String(s.price),
    inventoryItem: { sku: `${p.sku}-${s.label.replace(/\s+/g, "")}`, tracked: false },
  }))
  const bulk = await gql(
    `mutation Variants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
       productVariantsBulkCreate(productId: $productId, variants: $variants, strategy: REMOVE_STANDALONE_VARIANT) {
         productVariants { id title price }
         userErrors { field message }
       }
     }`,
    { productId: product.id, variants }
  )
  const vErrs = bulk.productVariantsBulkCreate.userErrors
  if (vErrs?.length) console.warn(`   ! variants: ${vErrs.map((e) => e.message).join("; ")}`)

  // Attach the real vial photograph.
  const local = path.join(ROOT, "public", p.image)
  if (fs.existsSync(local)) {
    try {
      const resourceUrl = await uploadImage(local, path.basename(p.image))
      const media = await gql(
        `mutation Media($productId: ID!, $media: [CreateMediaInput!]!) {
           productCreateMedia(productId: $productId, media: $media) {
             mediaUserErrors { message }
           }
         }`,
        {
          productId: product.id,
          media: [{
            originalSource: resourceUrl,
            mediaContentType: "IMAGE",
            alt: `${p.name} research vial (${p.code}) — Biotech Life Sciences`,
          }],
        }
      )
      const mErrs = media.productCreateMedia.mediaUserErrors
      if (mErrs?.length) console.warn(`   ! media: ${mErrs.map((e) => e.message).join("; ")}`)
    } catch (e) {
      console.warn(`   ! image upload skipped: ${e.message}`)
    }
  }
  return product
}

// ---------- main ----------
;(async () => {
  const catalogue = readCatalogue()
  console.log(`\nStore   : ${DOMAIN}`)
  console.log(`Mode    : ${COMMIT ? "COMMIT (will create products)" : "DRY RUN (creates nothing)"}`)
  console.log(`Products: ${catalogue.length}\n`)

  if (catalogue.length !== 8) {
    console.warn(`⚠ Expected 8 catalogue products, parsed ${catalogue.length}. Check lib/data.ts.\n`)
  }

  for (const p of catalogue) {
    const prices = p.sizes.map((s) => `${s.label} ₹${s.price.toLocaleString("en-IN")}`).join("  ")
    console.log(`  ${p.code.padEnd(9)} ${p.name.padEnd(20)} ${prices}`)
  }
  console.log("\n⚠ Prices above are PLACEHOLDERS from lib/data.ts. Set real prices before publishing.")
  console.log("  All products are created as DRAFT and will not be purchasable until you publish them.\n")

  let shop
  try {
    shop = await gql(`{ shop { name myshopifyDomain currencyCode } }`)
    console.log(`✓ Admin API reachable — ${shop.shop.name} (${shop.shop.currencyCode})`)
  } catch (e) {
    console.error(`✖ Admin API check failed: ${e.message}`)
    console.error("  Most likely the token lacks scopes, or the domain is wrong.")
    process.exit(1)
  }

  try {
    const sig = await probeSchema()
    console.log(`✓ API ${API_VERSION} mutation signatures:`)
    for (const [k, v] of Object.entries(sig)) console.log(`    ${k}: ${v ? v.join(", ") : "NOT FOUND"}`)
  } catch (e) {
    console.warn(`! schema probe failed (continuing): ${e.message}`)
  }

  if (!COMMIT) {
    console.log("\nDry run complete. Re-run with --commit to create these products.\n")
    return
  }

  console.log("\nCreating…")
  let ok = 0
  for (const p of catalogue) {
    try {
      const created = await createProduct(p)
      console.log(`  ✓ ${p.name} → ${created.handle}`)
      ok++
    } catch (e) {
      console.error(`  ✖ ${p.name}: ${e.message}`)
    }
  }
  console.log(`\nDone: ${ok}/${catalogue.length} created as DRAFT.`)
  console.log("Next: set real prices, then publish each product in Shopify admin.\n")
})()
