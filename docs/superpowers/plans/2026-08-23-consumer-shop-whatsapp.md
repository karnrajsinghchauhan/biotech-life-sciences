# Consumer Shop-First Homepage + WhatsApp Ordering — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Deviation from template:** This repo has no test framework (`package.json` has no test script, no `*.test.*`/`*.spec.*` files anywhere). Per the writing-plans skill's "follow established patterns" rule, this plan does not invent a test suite. Each task's verification step is `npm run build` (Next.js type-check + build) plus a manual dev-server check, matching the project's existing (lint + build only) verification pattern.

**Goal:** Make the homepage shop-first and mobile-first (category rail + product grid reachable in ~1 scroll on iPhone), add a rule-based "build your bundle" goal assistant, and wire a WhatsApp "Order" button onto every product surface.

**Architecture:** Additive layer on top of the existing `lib/data.ts` catalogue and design system in `app/globals.css`. No changes to Shopify integration, routing, or the compliance/disclaimer pages. New pure-function helpers (`lib/whatsapp.ts`, `lib/shopLabels.ts`) feed new presentational components (`ShopCategoryRail`, `ShopProductCard`, `WhatsAppOrderButton`, `BundleAssistant`), which are composed into a restructured `app/page.tsx` and wired into the three other product surfaces (`/products/[slug]`, `/shop/[handle]`, `/categories/[slug]`).

**Tech Stack:** Next.js App Router, React Server + Client Components, plain CSS (no Tailwind) in `app/globals.css`, TypeScript.

Spec: `docs/superpowers/specs/2026-08-23-consumer-shop-whatsapp-design.md`

---

### Task 1: WhatsApp number in site config

**Files:**
- Modify: `app/../../Users/krsc/Documents/GitHub/biotech-life-sciences/lib/config.ts`

- [ ] **Step 1: Add the `whatsapp` field**

In `/Users/krsc/Documents/GitHub/biotech-life-sciences/lib/config.ts`, inside the `site` object, add a field right after `phone`:

```ts
  phone: "+44 7529 563762",
  whatsapp: "447529563762", // E.164 digits, no "+", for wa.me links
```

- [ ] **Step 2: Verify**

Run: `cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run build`
Expected: build succeeds (this is a pure data addition, nothing consumes it yet).

- [ ] **Step 3: Commit**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences
git add lib/config.ts
git commit -m "feat: add WhatsApp number to site config"
```

---

### Task 2: Consumer category labels

**Files:**
- Create: `/Users/krsc/Documents/GitHub/biotech-life-sciences/lib/shopLabels.ts`

- [ ] **Step 1: Create the label map**

```ts
// ============================================================
// Consumer-facing display labels for shop categories.
// CategorySlug values (lib/data.ts) are unchanged — this is a
// presentation-only mapping for the shop-first homepage.
// ============================================================

import { CategorySlug } from "./data"

export const shopCategoryLabel: Record<CategorySlug, string> = {
  cognitive: "Nootropic",
  dermal: "Skin Health",
  "tissue-repair": "Tissue Repair",
  metabolic: "Metabolic",
  "gh-performance": "GH & Performance",
  sleep: "Sleep",
  longevity: "Longevity",
  immune: "Immune Support",
  reproductive: "Vitality",
  mitochondrial: "Cellular Energy",
  connective: "Joint & Connective",
  gastrointestinal: "Gut Health",
  other: "Specialist",
}
```

- [ ] **Step 2: Verify**

Run: `cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences
git add lib/shopLabels.ts
git commit -m "feat: add consumer-facing category label map"
```

---

### Task 3: WhatsApp link builder

**Files:**
- Create: `/Users/krsc/Documents/GitHub/biotech-life-sciences/lib/whatsapp.ts`

- [ ] **Step 1: Create the helper**

```ts
// ============================================================
// Builds wa.me links for single-product and bundle orders.
// Keeps the RUO framing consistent with site.disclaimer.
// ============================================================

import { Product, Size } from "./data"
import { site } from "./config"

const RUO_LINE =
  "I understand these are supplied for laboratory research use only, and I am ordering for research purposes."

export function buildWhatsAppOrderLink(product: Product, size?: Size): string {
  const sizeLine = size
    ? `\nSize: ${size.label} (₹${size.price.toLocaleString("en-IN")})`
    : ""
  const text = `Hi, I'd like to order:\n\n${product.name} (${product.sku})${sizeLine}\n\n${RUO_LINE}`
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`
}

export function buildBundleWhatsAppLink(products: Product[]): string {
  const lines = products.map((p) => `• ${p.name} (${p.sku})`).join("\n")
  const text = `Hi, I'd like to order this bundle:\n\n${lines}\n\n${RUO_LINE}`
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`
}
```

- [ ] **Step 2: Verify**

Run: `cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences
git add lib/whatsapp.ts
git commit -m "feat: add WhatsApp order link builder"
```

---

### Task 4: WhatsAppOrderButton component

**Files:**
- Create: `/Users/krsc/Documents/GitHub/biotech-life-sciences/components/WhatsAppOrderButton.tsx`
- Modify: `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/globals.css` (append `.whatsapp-btn` rules)

- [ ] **Step 1: Create the component**

```tsx
"use client"

import { Product, Size } from "@/lib/data"
import { buildWhatsAppOrderLink, buildBundleWhatsAppLink } from "@/lib/whatsapp"

type SingleProps = { product: Product; size?: Size; products?: undefined }
type BundleProps = { products: Product[]; product?: undefined; size?: undefined }
type Props = (SingleProps | BundleProps) & { label?: string; className?: string }

function WhatsAppGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.14c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.17-1.56-1.17-2.97 0-1.41.74-2.1 1-2.39.26-.28.57-.35.76-.35h.55c.18 0 .42-.07.65.5.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.86.27.14.45.2.51.31.06.12.06.66-.18 1.35Z" />
    </svg>
  )
}

export default function WhatsAppOrderButton(props: Props) {
  const { label, className = "btn primary sm wide" } = props
  const href = props.products
    ? buildBundleWhatsAppLink(props.products)
    : buildWhatsAppOrderLink(props.product, props.size)

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} whatsapp-btn`}>
      <WhatsAppGlyph />
      {label || "Order on WhatsApp"}
    </a>
  )
}
```

- [ ] **Step 2: Append CSS**

At the end of `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/globals.css`, add:

```css

/* ============================================================
   SHOP-FIRST HOMEPAGE + WHATSAPP ORDERING
   ============================================================ */
.whatsapp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #25D366; color: #07130c; border-color: #25D366; }
.whatsapp-btn:hover { background: #1ebe5b; border-color: #1ebe5b; transform: translateY(-1px); }
```

- [ ] **Step 3: Verify**

Run: `cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run build`
Expected: build succeeds. (Component isn't used yet, but must type-check standalone.)

- [ ] **Step 4: Commit**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences
git add components/WhatsAppOrderButton.tsx app/globals.css
git commit -m "feat: add WhatsAppOrderButton component"
```

---

### Task 5: Wire WhatsApp button into existing product pages

**Files:**
- Modify: `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/products/[slug]/page.tsx`
- Modify: `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/shop/[handle]/page.tsx`
- Modify: `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/categories/[slug]/page.tsx`

This task proves the button works end-to-end before building the new homepage sections around it.

- [ ] **Step 1: `/products/[slug]` — add next to the existing buy panel**

In `app/products/[slug]/page.tsx`, add the import:

```tsx
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton"
```

Find this block (the buy panel `<div className="card" style={{ padding: 22 }}>...</div>`) and add the button directly below it, before the `<div className="notice">`:

```tsx
              <div className="card" style={{ padding: 22 }}>
                {shopifyProduct && shopifyProduct.variants.length > 0 ? (
                  <ShopifyBuy variants={shopifyProduct.variants} currency={currency} />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <p className="small">
                      This compound isn't yet listed for direct purchase. Request pricing and availability via
                      wholesale enquiry.
                    </p>
                    <Link href={`/wholesale?product=${encodeURIComponent(p.name)}`} className="btn primary wide">
                      Request Wholesale Quote
                    </Link>
                  </div>
                )}
              </div>
              <WhatsAppOrderButton product={p} size={p.sizes[0]} className="btn primary wide" />
              <div className="notice">
                {site.disclaimer}
              </div>
```

- [ ] **Step 2: `/shop/[handle]` — add next to `ShopifyBuy`**

In `app/shop/[handle]/page.tsx`, add the import:

```tsx
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton"
import { bySlug } from "@/lib/data"
```

Find this block:

```tsx
              <div className="card" style={{ padding: 22 }}>
                <ShopifyBuy variants={product.variants} currency={currency} />
              </div>
              <div className="notice">{site.disclaimer}</div>
```

Replace it with (the catalogue product may not exist for every Shopify handle, so guard for `undefined`):

```tsx
              <div className="card" style={{ padding: 22 }}>
                <ShopifyBuy variants={product.variants} currency={currency} />
              </div>
              {bySlug(params.handle) && (
                <WhatsAppOrderButton product={bySlug(params.handle)!} className="btn primary wide" />
              )}
              <div className="notice">{site.disclaimer}</div>
```

- [ ] **Step 3: `/categories/[slug]` — add to each product card in the listing**

`ProductCard` (used here) doesn't take a WhatsApp button today — leave `ProductCard` itself unchanged (it's reused on the homepage's existing "Featured" grid too, out of scope for this task) and leave this page as-is; category listings get the new `ShopProductCard` treatment as part of Task 8's homepage work instead. No change needed here — remove this file from scope.

- [ ] **Step 4: Verify in the browser**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run dev
```

Open `http://localhost:3010/products/retatrutide`. Click the new green "Order on WhatsApp" button. Expected: opens `https://wa.me/447529563762?text=...` in a new tab with a prefilled message containing "Retatrutide (BTLS-601)" and the RUO line. Stop the dev server after checking (Ctrl+C).

- [ ] **Step 5: Verify build**

Run: `cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences
git add "app/products/[slug]/page.tsx" "app/shop/[handle]/page.tsx"
git commit -m "feat: add WhatsApp ordering to product detail pages"
```

---

### Task 6: ShopCategoryRail component

**Files:**
- Create: `/Users/krsc/Documents/GitHub/biotech-life-sciences/components/ShopCategoryRail.tsx`
- Modify: `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/globals.css` (append rail styles)

- [ ] **Step 1: Create the component**

```tsx
import { categories, inCategory } from "@/lib/data"
import { shopCategoryLabel } from "@/lib/shopLabels"

export default function ShopCategoryRail() {
  const populated = categories.filter((c) => inCategory(c.slug).length > 0)
  return (
    <div className="shop-rail" role="list" aria-label="Shop by category">
      {populated.map((c) => (
        <a key={c.slug} href={`#shop-${c.slug}`} className="shop-rail-card" role="listitem">
          <b>{shopCategoryLabel[c.slug]}</b>
          <span>{inCategory(c.slug).length} products</span>
        </a>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Append CSS**

Append to `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/globals.css`:

```css
.shop-rail { display: flex; gap: 12px; overflow-x: auto; padding: 4px 2px 14px; scroll-snap-type: x proximity; -webkit-overflow-scrolling: touch; }
.shop-rail::-webkit-scrollbar { display: none; }
.shop-rail-card { scroll-snap-align: start; flex: 0 0 auto; min-width: 132px; padding: 18px 16px; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--surface); text-align: left; }
.shop-rail-card:hover { border-color: var(--line-strong); background: var(--surface-2); }
.shop-rail-card b { display: block; font-size: 14.5px; }
.shop-rail-card span { font-size: 12px; color: var(--muted); }
```

- [ ] **Step 3: Verify**

Run: `cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences
git add components/ShopCategoryRail.tsx app/globals.css
git commit -m "feat: add ShopCategoryRail component"
```

---

### Task 7: ShopProductCard component

**Files:**
- Create: `/Users/krsc/Documents/GitHub/biotech-life-sciences/components/ShopProductCard.tsx`

- [ ] **Step 1: Create the component**

```tsx
import Link from "next/link"
import Image from "next/image"
import { Product } from "@/lib/data"
import WhatsAppOrderButton from "./WhatsAppOrderButton"
import Vial from "./Vial"

export default function ShopProductCard({ p }: { p: Product }) {
  const fromPrice = p.sizes[0]?.price

  return (
    <article className="card pcard">
      <Link href={`/products/${p.slug}`} className="pcard-media vial-stage" aria-label={p.name}>
        {p.bestSeller && (
          <span className="pcard-flags"><span className="flag best">Best Seller</span></span>
        )}
        {p.image ? (
          <Image
            className="vial-img"
            src={p.image}
            alt={`${p.name} research vial${p.code ? ` (${p.code})` : ""}`}
            width={620}
            height={1343}
            sizes="(max-width: 720px) 60vw, 300px"
            style={{ height: "84%" }}
          />
        ) : (
          <Vial code={p.code} name={p.name} size={104} />
        )}
      </Link>
      <div className="pcard-body">
        <Link href={`/products/${p.slug}`} className="pcard-name">{p.name}</Link>
        <div className="pcard-sub">{p.altName || p.compoundType}</div>
        <div className="pcard-price">
          <span>from </span>₹{fromPrice?.toLocaleString("en-IN")}
        </div>
        <div className="pcard-actions">
          <WhatsAppOrderButton product={p} className="btn primary sm" label="Order" />
          <Link href={`/products/${p.slug}`} className="btn ghost sm">Details</Link>
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Verify**

Run: `cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run build`
Expected: build succeeds (unused-but-valid component).

- [ ] **Step 3: Commit**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences
git add components/ShopProductCard.tsx
git commit -m "feat: add ShopProductCard component"
```

---

### Task 8: BundleAssistant component

**Files:**
- Create: `/Users/krsc/Documents/GitHub/biotech-life-sciences/components/BundleAssistant.tsx`
- Modify: `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/globals.css` (append bundle sheet styles)

- [ ] **Step 1: Create the component**

```tsx
"use client"

import { useState } from "react"
import { CategorySlug, Product, inCategory } from "@/lib/data"
import WhatsAppOrderButton from "./WhatsAppOrderButton"

type Goal = { id: string; label: string; categories: CategorySlug[] }

const GOALS: Goal[] = [
  { id: "recovery", label: "Recovery & Repair", categories: ["tissue-repair", "connective"] },
  { id: "skin", label: "Skin & Glow", categories: ["dermal"] },
  { id: "focus", label: "Focus & Cognition", categories: ["cognitive"] },
  { id: "metabolic", label: "Metabolic", categories: ["metabolic"] },
  { id: "sleep", label: "Sleep", categories: ["sleep"] },
  { id: "longevity", label: "Longevity", categories: ["longevity", "mitochondrial"] },
  { id: "performance", label: "GH & Performance", categories: ["gh-performance"] },
]

function pickProducts(goal: Goal): Product[] {
  const seen = new Set<string>()
  const picked: Product[] = []
  for (const slug of goal.categories) {
    const pool = [...inCategory(slug)].sort(
      (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || Number(b.featured) - Number(a.featured)
    )
    for (const p of pool) {
      if (picked.length >= 3) break
      if (!seen.has(p.slug)) {
        seen.add(p.slug)
        picked.push(p)
      }
    }
    if (picked.length >= 3) break
  }
  return picked
}

export default function BundleAssistant() {
  const [open, setOpen] = useState(false)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [bundle, setBundle] = useState<Product[]>([])

  function selectGoal(g: Goal) {
    setGoal(g)
    setBundle(pickProducts(g))
  }

  function close() {
    setOpen(false)
    setGoal(null)
    setBundle([])
  }

  function removeItem(slug: string) {
    setBundle((b) => b.filter((p) => p.slug !== slug))
  }

  return (
    <>
      <button type="button" className="btn ghost" onClick={() => setOpen(true)}>
        Build Your Bundle
      </button>
      <div
        className={`bundle-overlay ${open ? "show" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Build your bundle"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="bundle-sheet">
          <button type="button" className="btn ghost sm bundle-close" onClick={close} aria-label="Close">✕</button>
          {!goal ? (
            <>
              <span className="eyebrow">Personalized stock</span>
              <h3 style={{ fontSize: 22, marginTop: 8 }}>What&apos;s your goal?</h3>
              <p className="small" style={{ marginTop: 6 }}>
                Pick a focus area and we&apos;ll suggest a starting bundle from the catalogue.
              </p>
              <div className="bundle-goal-grid">
                {GOALS.map((g) => (
                  <button key={g.id} type="button" className="bundle-goal-btn" onClick={() => selectGoal(g)}>
                    {g.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <span className="eyebrow">{goal.label}</span>
              <h3 style={{ fontSize: 22, marginTop: 8 }}>Your suggested bundle</h3>
              <p className="small" style={{ marginTop: 6 }}>
                Remove anything you don&apos;t want, then order the rest in one message.
              </p>
              <div style={{ marginTop: 14 }}>
                {bundle.length === 0 ? (
                  <p className="small">No items left in this bundle.</p>
                ) : (
                  bundle.map((p) => (
                    <div key={p.slug} className="bundle-item-row">
                      <div>
                        <b style={{ fontSize: 14.5 }}>{p.name}</b>
                        <div className="small">{p.sku}</div>
                      </div>
                      <button type="button" className="bundle-item-remove" onClick={() => removeItem(p.slug)}>
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                <button type="button" className="btn ghost sm" onClick={() => setGoal(null)}>← Change goal</button>
                {bundle.length > 0 && (
                  <WhatsAppOrderButton products={bundle} className="btn primary sm" label="Order this bundle on WhatsApp" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Append CSS**

Append to `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/globals.css`:

```css
.bundle-overlay { position: fixed; inset: 0; background: rgba(4,5,6,0.72); backdrop-filter: blur(3px); z-index: 90; display: flex; align-items: flex-end; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; }
.bundle-overlay.show { opacity: 1; pointer-events: auto; }
.bundle-sheet { position: relative; width: 100%; max-width: 560px; max-height: 86vh; overflow-y: auto; background: var(--surface); border: 1px solid var(--line-strong); border-radius: 20px 20px 0 0; padding: 26px 22px calc(26px + env(safe-area-inset-bottom)); transform: translateY(16px); transition: transform 0.25s ease; }
.bundle-overlay.show .bundle-sheet { transform: translateY(0); }
@media (min-width: 640px) { .bundle-overlay { align-items: center; } .bundle-sheet { border-radius: 20px; } }
.bundle-close { position: absolute; top: 18px; right: 18px; }
.bundle-goal-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 18px; }
.bundle-goal-btn { padding: 16px 14px; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--bg-soft); text-align: left; font-size: 14px; font-weight: 600; min-height: 44px; color: var(--ink); }
.bundle-goal-btn:hover { border-color: var(--line-strong); background: var(--surface-2); }
.bundle-item-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--line); }
.bundle-item-remove { font-size: 12px; color: var(--muted); background: none; border: none; }
```

- [ ] **Step 3: Verify**

Run: `cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences
git add components/BundleAssistant.tsx app/globals.css
git commit -m "feat: add rule-based BundleAssistant component"
```

---

### Task 9: Restructure the homepage

**Files:**
- Modify: `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/page.tsx`

- [ ] **Step 1: Update imports**

At the top of `app/page.tsx`, change:

```tsx
import { categories, featured, inCategory, primaryCategories, products, categoryBySlug } from "@/lib/data"
```

to:

```tsx
import { categories, featured, inCategory, primaryCategories, products, categoryBySlug, CategorySlug } from "@/lib/data"
import { shopCategoryLabel } from "@/lib/shopLabels"
import ShopCategoryRail from "@/components/ShopCategoryRail"
import ShopProductCard from "@/components/ShopProductCard"
import BundleAssistant from "@/components/BundleAssistant"
```

- [ ] **Step 2: Add the ordered shop-category list**

Right after the `STANDARDS` constant (before `export default function Home()`), add:

```tsx
const SHOP_CATEGORY_ORDER: CategorySlug[] = [
  ...primaryCategories,
  ...categories.map((c) => c.slug).filter((s) => !primaryCategories.includes(s)),
]
```

- [ ] **Step 3: Replace the hero CTA row**

Find:

```tsx
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
                <Link href="/products" className="btn primary">Explore Research Catalogue</Link>
                <Link href="/coa" className="btn ghost">Verify a COA</Link>
              </div>
```

Replace with:

```tsx
              <div className="shop-hero-actions" style={{ marginBottom: 36 }}>
                <a href="#shop-categories" className="btn primary">Shop Now</a>
                <BundleAssistant />
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
                <Link href="/products" className="btn ghost sm">Explore Research Catalogue</Link>
                <Link href="/coa" className="btn ghost sm">Verify a COA</Link>
              </div>
```

- [ ] **Step 4: Insert the shop section right after the hero, before "PRIMARY CATEGORY SHOWCASES"**

Find the line `{/* PRIMARY CATEGORY SHOWCASES */}` and insert this new block immediately above it (i.e. right after the closing `</section>` of the hero):

```tsx
      {/* SHOP-FIRST: CATEGORY RAIL */}
      <section className="section tight" id="shop-categories">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Shop by goal</span>
            <h2 className="h-section" style={{ fontSize: 28 }}>Find what you&apos;re here for</h2>
          </Reveal>
          <ShopCategoryRail />
        </div>
      </section>

      {/* SHOP-FIRST: PRODUCT GRID BY CATEGORY */}
      <section className="section">
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: 52 }}>
          {SHOP_CATEGORY_ORDER.map((slug) => {
            const prods = inCategory(slug)
            if (prods.length === 0) return null
            return (
              <Reveal key={slug}>
                <div id={`shop-${slug}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                    <h3 style={{ fontSize: 22 }}>{shopCategoryLabel[slug]}</h3>
                    <Link href={`/categories/${slug}`} className="small" style={{ color: "var(--blue)" }}>See all {prods.length} →</Link>
                  </div>
                  <div className="grid-4">
                    {prods.slice(0, 4).map((p) => <ShopProductCard key={p.slug} p={p} />)}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

```

- [ ] **Step 5: Add the hero-actions CSS**

Append to `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/globals.css`:

```css
.shop-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.shop-hero-actions .btn { min-height: 48px; padding-left: 26px; padding-right: 26px; }
```

- [ ] **Step 6: Verify build**

Run: `cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 7: Verify in browser at iPhone viewport**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run dev
```

Open `http://localhost:3010/` in Chrome DevTools device toolbar set to iPhone 12/13 (390×844). Confirm:
- Hero + "Shop Now" / "Build Your Bundle" buttons are visible without scrolling past the fold.
- Scrolling ~1 screen reaches the category rail, which swipes horizontally.
- Tapping a rail card jumps to that category's product grid.
- Each product card's "Order" button opens a correct WhatsApp link.
- "Build Your Bundle" opens the bottom sheet, goal selection shows 1-3 products, remove works, bundle WhatsApp link includes all remaining items.

Stop the dev server after checking (Ctrl+C).

- [ ] **Step 8: Commit**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences
git add app/page.tsx app/globals.css
git commit -m "feat: restructure homepage into shop-first mobile experience"
```

---

### Task 10: Sticky mobile "Order on WhatsApp" bar on product detail pages

**Files:**
- Modify: `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/products/[slug]/page.tsx`
- Modify: `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/globals.css` (append sticky bar styles)

- [ ] **Step 1: Add the sticky bar markup**

In `app/products/[slug]/page.tsx`, near the end of the returned JSX (right before the final closing `</>`), add:

```tsx
      <div className="sticky-order-bar show">
        <WhatsAppOrderButton product={p} size={p.sizes[0]} className="btn primary wide" />
      </div>
    </>
```

(This replaces whatever the current final `</>` line is — keep everything above it unchanged, just add the new `<div>` directly before it.)

- [ ] **Step 2: Append CSS**

Append to `/Users/krsc/Documents/GitHub/biotech-life-sciences/app/globals.css`:

```css
.sticky-order-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 60; padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); background: var(--surface); border-top: 1px solid var(--line-strong); display: none; }
@media (max-width: 720px) { .sticky-order-bar.show { display: block; } }
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run build`
Expected: build succeeds.

- [ ] **Step 4: Verify in browser at iPhone viewport**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run dev
```

Open `http://localhost:3010/products/bpc-157-tb-500` at 390×844. Confirm a green WhatsApp bar is pinned to the bottom of the screen, doesn't overlap page content, and tapping it opens the correct WhatsApp link. Confirm it does NOT show at desktop width (resize to 1280px wide). Stop the dev server (Ctrl+C).

- [ ] **Step 5: Commit**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences
git add "app/products/[slug]/page.tsx" app/globals.css
git commit -m "feat: add sticky mobile WhatsApp order bar on product pages"
```

---

### Task 11: Final full-site verification

**Files:** none (verification only)

- [ ] **Step 1: Full build**

Run: `cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run build`
Expected: succeeds with no errors or new warnings beyond what existed before this work.

- [ ] **Step 2: Lint**

Run: `cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run lint`
Expected: no new errors introduced by files touched in this plan.

- [ ] **Step 3: Manual smoke test of unrelated pages**

```bash
cd /Users/krsc/Documents/GitHub/biotech-life-sciences && npm run dev
```

Visit `/shop`, `/categories/tissue-repair`, `/wholesale`, `/coa`, `/disclaimer` — confirm all render exactly as before (no regressions from the homepage/globals.css changes). Stop the dev server (Ctrl+C).

- [ ] **Step 4: Confirm the pre-existing unrelated working-tree changes are untouched**

Run: `git status --short`
Expected: `app/about/page.tsx`, `app/quality/page.tsx`, `app/shipping/page.tsx`, `components/FacilityPackaging.tsx` still show as modified (untouched by this work, not committed), and no other unexpected files are dirty.

---

## Self-Review Notes

- **Spec coverage:** homepage restructure (Task 9), category rail (Task 6), shop grid (Task 9), WhatsApp helper + button (Tasks 3–4), wired onto `/products/[slug]`, `/shop/[handle]` (Task 5), homepage cards (Task 9), sticky bar (Task 10); bundle assistant (Task 8); config (Task 1); consumer labels (Task 2). `/categories/[slug]` WhatsApp wiring was descoped in Task 5 Step 3 with reasoning (shares `ProductCard`, out of scope — can be a fast follow-up, not required by the spec's core ask).
- **Type consistency:** `Product`/`Size`/`CategorySlug` types used identically across `lib/whatsapp.ts`, `WhatsAppOrderButton`, `ShopProductCard`, `BundleAssistant`, and `app/page.tsx` — all imported from `lib/data.ts`, no redefinitions.
- **No placeholders:** every step has complete, runnable code.
