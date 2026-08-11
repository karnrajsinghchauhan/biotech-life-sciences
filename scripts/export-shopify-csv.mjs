#!/usr/bin/env node
/**
 * Generate a Shopify product-import CSV from the catalogue.
 *
 *   node scripts/export-shopify-csv.mjs
 *   → writes shopify-products.csv in the project root
 *
 * Why CSV: Shopify's admin importer needs no API token. Upload it at
 * Products → Import. Images are pulled by Shopify from the live site,
 * so the deployment must be publicly reachable (it is).
 *
 * Every product is written as status=draft / published=false, so nothing
 * can sell at the placeholder prices until you review and publish it.
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SITE = process.env.SITE_URL || "https://biotech-life-sciences.vercel.app"
const OUT = path.join(ROOT, "shopify-products.csv")

// ---------- read catalogue ----------
const src = fs.readFileSync(path.join(ROOT, "lib", "data.ts"), "utf8")
const re =
  /\{\s*slug:\s*"([^"]+)",\s*sku:\s*"([^"]+)",\s*code:\s*"([^"]+)",\s*image:\s*"([^"]+)",\s*name:\s*"([^"]+)"([\s\S]*?)\n  \},/g

const products = []
let m
while ((m = re.exec(src))) {
  const [, slug, sku, code, image, name, rest] = m
  products.push({
    slug, sku, code, image, name,
    alt: rest.match(/altName:\s*"([^"]+)"/)?.[1] ?? null,
    type: rest.match(/compoundType:\s*"([^"]+)"/)?.[1] ?? "Peptide",
    overview: rest.match(/overview:\s*"((?:[^"\\]|\\.)*)"/)?.[1]?.replace(/\\"/g, '"') ?? "",
    purity: rest.match(/purity:\s*"([^"]+)"/)?.[1] ?? "≥ 98% (RP-HPLC)",
    storage: rest.match(/storage:\s*"([^"]+)"/)?.[1] ?? "Store at −20 °C, protect from light",
    form: rest.match(/form:\s*"([^"]+)"/)?.[1] ?? "Lyophilized powder",
    sizes: [...rest.matchAll(/\{\s*label:\s*"([^"]+)",\s*price:\s*([\d.]+)\s*\}/g)]
      .map((s) => ({ label: s[1], price: Number(s[2]) })),
  })
}

const RUO =
  "For laboratory research use only. Not for human or veterinary consumption, " +
  "diagnosis, treatment, or prevention of disease."

const bodyHtml = (p) =>
  `<p>${p.overview}</p>` +
  `<p><strong>Research use only.</strong> ${RUO}</p>` +
  `<ul>` +
  `<li><strong>Catalogue number:</strong> ${p.sku}</li>` +
  `<li><strong>Vial code:</strong> ${p.code}</li>` +
  `<li><strong>Compound type:</strong> ${p.type}</li>` +
  `<li><strong>Purity specification:</strong> ${p.purity}</li>` +
  `<li><strong>Form:</strong> ${p.form}</li>` +
  `<li><strong>Storage:</strong> ${p.storage}</li>` +
  `</ul>`

// ---------- CSV ----------
const COLUMNS = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value",
  "Variant SKU", "Variant Inventory Tracker", "Variant Inventory Qty",
  "Variant Inventory Policy", "Variant Fulfillment Service",
  "Variant Price", "Variant Requires Shipping", "Variant Taxable",
  "Image Src", "Image Position", "Image Alt Text",
  "Gift Card", "SEO Title", "SEO Description", "Status",
]

const esc = (v) => {
  const s = v === undefined || v === null ? "" : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const rows = [COLUMNS.join(",")]

for (const p of products) {
  p.sizes.forEach((size, i) => {
    const first = i === 0
    const row = {
      Handle: p.slug,
      Title: first ? p.name : "",
      "Body (HTML)": first ? bodyHtml(p) : "",
      Vendor: first ? "Biotech Life Sciences" : "",
      Type: first ? p.type : "",
      Tags: first ? ["research-use-only", p.code, p.type].join(", ") : "",
      Published: first ? "FALSE" : "",
      "Option1 Name": first ? "Size" : "",
      "Option1 Value": size.label,
      "Variant SKU": `${p.sku}-${size.label.replace(/\s+/g, "")}`,
      "Variant Inventory Tracker": "",          // untracked: always orderable
      "Variant Inventory Qty": "0",
      "Variant Inventory Policy": "continue",
      "Variant Fulfillment Service": "manual",
      "Variant Price": size.price,
      "Variant Requires Shipping": "TRUE",
      "Variant Taxable": "TRUE",
      "Image Src": first ? `${SITE}${p.image}` : "",
      "Image Position": first ? "1" : "",
      "Image Alt Text": first
        ? `${p.name} research vial (${p.code}) — Biotech Life Sciences`
        : "",
      "Gift Card": first ? "FALSE" : "",
      "SEO Title": first ? `${p.name} — Research Compound | Biotech Life Sciences` : "",
      "SEO Description": first ? `${p.name} (${p.code}), ${p.purity}. ${RUO}`.slice(0, 320) : "",
      Status: first ? "draft" : "",
    }
    rows.push(COLUMNS.map((c) => esc(row[c])).join(","))
  })
}

// ---------- sanity check: bigger sizes must not cost less ----------
// A larger vial priced below a smaller one is almost always a typo, and it
// lets a customer buy more product for less money. Refuse to write the file.
const numeric = (label) => {
  const m = label.match(/([\d.]+)/)
  return m ? Number(m[1]) : null
}
const problems = []
for (const p of products) {
  const sized = p.sizes
    .map((s) => ({ ...s, qty: numeric(s.label) }))
    .filter((s) => s.qty !== null)
    .sort((a, b) => a.qty - b.qty)
  for (let i = 1; i < sized.length; i++) {
    if (sized[i].price <= sized[i - 1].price) {
      problems.push(
        `${p.name}: ${sized[i].label} (₹${sized[i].price}) is not more than ` +
        `${sized[i - 1].label} (₹${sized[i - 1].price})`
      )
    }
  }
}
if (problems.length) {
  console.error("\n✖ Refusing to write CSV — inverted pricing detected:\n")
  for (const t of problems) console.error(`    ${t}`)
  console.error("\n  A bigger size must cost more than a smaller one.")
  console.error("  Fix the prices in lib/data.ts and re-run.\n")
  process.exit(1)
}

fs.writeFileSync(OUT, rows.join("\n") + "\n", "utf8")

// ---------- report ----------
const variants = products.reduce((n, p) => n + p.sizes.length, 0)
console.log(`\n✓ Wrote ${path.relative(ROOT, OUT)}`)
console.log(`  ${products.length} products · ${variants} variants · ${rows.length - 1} CSV rows\n`)
for (const p of products) {
  const prices = p.sizes.map((s) => `${s.label} ₹${s.price.toLocaleString("en-IN")}`).join("  ")
  console.log(`  ${p.code.padEnd(9)} ${p.name.padEnd(20)} ${prices}`)
}
console.log(`\n  Images pulled by Shopify from ${SITE}/images/products/`)
console.log(`  All rows: Status=draft, Published=FALSE — nothing sells until you publish.`)
console.log(`\n  ⚠ Prices above are PLACEHOLDERS. Edit lib/data.ts and re-run, or`)
console.log(`    correct them in Shopify after import.\n`)
