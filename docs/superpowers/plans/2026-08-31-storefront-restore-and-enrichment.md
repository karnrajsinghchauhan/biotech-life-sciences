# Storefront Restore & Enrichment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the reviewed "minimal editorial" redesign into `master` with its audit-flagged bugs fixed, rewrite the About Us page on verified facts, and add a peptide-education diagram system to the Research Library plus a glowing trust/visual system — all validated by real tests, not placeholders.

**Architecture:** Work happens on branch `review/redesign-diff` (worktree at `/tmp/btls-review`), which already has the redesign patch applied and committed. Every fix and addition is a small, single-responsibility file (components, pure-logic modules, data modules) so it can be unit/component-tested with Vitest + React Testing Library, which this repo does not yet have. Server-only page files (`app/**/page.tsx`) stay thin — they import and compose tested presentational components and data modules rather than holding logic or copy inline.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, plain CSS (`app/globals.css`), Shopify Storefront API. Adding: Vitest, @testing-library/react, @testing-library/jest-dom, jsdom.

---

## Ground rules carried from the design spec (`docs/superpowers/specs/2026-08-31-storefront-restore-and-enrichment-design.md`)

- No copied copy or pricing from any reference site.
- Facts stated as fact are limited to what was confirmed this session: a real Oxford facility used for **QC, repackaging and storage** (not synthesis — partners still do that); testing that genuinely covers **HPLC purity + MS identity + heavy metals + endotoxins/residual solvents**; a **free bacteriostatic water vial**, a **48-hour dispatch guarantee**, and **order tracking** (via the Shopify order-status page, not a bespoke dashboard) as real fulfillment facts.
- "Trusted By" uses institution categories, not named clients or logos.

---

## Phase 0 — Test Harness

### Task 1: Add Vitest + React Testing Library

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Test: `tests/smoke.test.tsx`

- [ ] **Step 1: Install dependencies**

Run: `cd /tmp/btls-review && npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`

- [ ] **Step 2: Add the test script to `package.json`**

Modify the `"scripts"` block:

```json
{
  "scripts": {
    "dev": "next dev -p 3010",
    "build": "next build",
    "start": "next start -p 3010",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
})
```

- [ ] **Step 4: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest"
```

- [ ] **Step 5: Write a smoke test**

```tsx
// tests/smoke.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

function Hello() {
  return <p>harness works</p>
}

describe("test harness", () => {
  it("renders with RTL and jest-dom matchers", () => {
    render(<Hello />)
    expect(screen.getByText("harness works")).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run it**

Run: `npm test`
Expected: `tests/smoke.test.tsx` passes (1 test, 1 file).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts tests/smoke.test.tsx
git commit -m "chore: add Vitest + React Testing Library harness"
```

---

## Phase 1 — Restore & Audit

### Task 2: Fix the `inert` accessibility bug (CR-01)

React 18's `react-dom` doesn't recognize the `inert` prop — it's silently stripped at runtime even though it typechecks (Next pulls in `react/experimental` types). The closed cart drawer and the mobile menu both stay keyboard-focusable while invisible.

**Files:**
- Modify: `components/CartDrawer.tsx:104-112`
- Modify: `components/Header.tsx:114`
- Modify: `app/globals.css` (add a `visibility` fallback near the `.drawer` rule)
- Test: `components/CartDrawer.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/CartDrawer.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import CartDrawer from "./CartDrawer"

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ cart: null }),
  }) as unknown as typeof fetch
})

describe("CartDrawer accessibility", () => {
  it("marks the drawer inert via a real DOM attribute when closed", () => {
    render(<CartDrawer open={false} onClose={() => {}} onCountChange={() => {}} />)
    const aside = document.getElementById("cart-drawer")!
    expect(aside.hasAttribute("inert")).toBe(true)
  })

  it("removes the inert attribute when open", () => {
    render(<CartDrawer open={true} onClose={() => {}} onCountChange={() => {}} />)
    const aside = document.getElementById("cart-drawer")!
    expect(aside.hasAttribute("inert")).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test to see it fail**

Run: `npm test -- CartDrawer`
Expected: FAIL — `aside.hasAttribute("inert")` is `false` even when `open={false}`, because React's `inert={!open}` prop never reaches the DOM.

- [ ] **Step 3: Fix it with an imperative ref**

In `components/CartDrawer.tsx`, add `useRef` to the import and set the attribute imperatively:

```tsx
"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { ShopifyCart } from "@/lib/shopify"
```

Then, inside the component, add a ref and an effect right after the existing `useEffect` for `open` (around line 59):

```tsx
  const asideRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = asideRef.current
    if (!el) return
    if (open) el.removeAttribute("inert")
    else el.setAttribute("inert", "")
  }, [open])
```

Update the `<aside>` element (was line 104-112) to use the ref and drop the `inert` prop:

```tsx
      <aside
        ref={asideRef}
        id="cart-drawer"
        className={`drawer cart-drawer ${open ? "show" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        aria-hidden={!open}
      >
```

- [ ] **Step 4: Run the test to see it pass**

Run: `npm test -- CartDrawer`
Expected: PASS (2 tests).

- [ ] **Step 5: Apply the same fix to the mobile menu**

In `components/Header.tsx`, add a ref for the mobile menu. Add `useRef` to the React import (line 5):

```tsx
import { useEffect, useRef, useState } from "react"
```

Add the ref and effect inside `Header()`, after the existing `[mobile, cartOpen]` effect (around line 52):

```tsx
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = mobileMenuRef.current
    if (!el) return
    if (mobile) el.removeAttribute("inert")
    else el.setAttribute("inert", "")
  }, [mobile])
```

Update the mobile menu `<div>` (was line 114):

```tsx
      <div ref={mobileMenuRef} className={`mobile-menu ${mobile ? "show" : ""}`} aria-hidden={!mobile} inert={!mobile ? true : undefined}>
```

Wait — drop the JSX `inert` prop entirely here too, same as the drawer; it does nothing and only the imperative ref matters:

```tsx
      <div ref={mobileMenuRef} className={`mobile-menu ${mobile ? "show" : ""}`} aria-hidden={!mobile}>
```

- [ ] **Step 6: Add the CSS fallback**

In `app/globals.css`, find the `.mobile-menu` rule (around line 700) and add a visibility toggle so the fix works even before hydration/JS runs:

```css
.mobile-menu { visibility: hidden; transition: opacity 220ms ease, transform 260ms ease, visibility 0s 260ms; }
.mobile-menu.show { visibility: visible; transition: opacity 220ms ease, transform 260ms ease, visibility 0s; }
```

(Add these two lines immediately after the existing `.mobile-menu { ... }` block rather than replacing it — the existing rule keeps its `opacity`/`transform`/`pointer-events` declarations.)

- [ ] **Step 7: Add a matching Header test**

```tsx
// components/Header.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import Header from "./Header"

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ cart: null }),
  }) as unknown as typeof fetch
})

describe("Header mobile menu accessibility", () => {
  it("is inert when closed", () => {
    render(<Header />)
    const menu = screen.getByRole("link", { name: /shop/i }).closest(".mobile-menu")
    expect(menu?.hasAttribute("inert")).toBe(true)
  })
})
```

- [ ] **Step 8: Run both test files**

Run: `npm test -- Header CartDrawer`
Expected: PASS (3 tests total).

- [ ] **Step 9: Verify the build still passes**

Run: `npx tsc --noEmit && npm run build`
Expected: both exit 0.

- [ ] **Step 10: Commit**

```bash
git add components/CartDrawer.tsx components/Header.tsx app/globals.css components/CartDrawer.test.tsx components/Header.test.tsx
git commit -m "fix: apply inert imperatively so the closed cart drawer and mobile menu are actually unreachable by keyboard"
```

---

### Task 3: Fix the cart quantity race condition (CR-03)

`busyLine` only tracks one in-flight mutation at a time, so clicking `+` on two different cart lines back-to-back can silently drop one update.

**Files:**
- Modify: `components/CartDrawer.tsx`
- Test: `components/CartDrawer.test.tsx` (extend)

- [ ] **Step 1: Write the failing test**

Add to `components/CartDrawer.test.tsx`:

```tsx
describe("CartDrawer concurrent mutations", () => {
  it("ignores a stale response superseded by a newer mutation on the same line", async () => {
    const cartV1 = {
      id: "c1", checkoutUrl: "#", totalQuantity: 1,
      cost: { totalAmount: { amount: "10", currencyCode: "INR" } },
      lines: [{
        id: "line-a", quantity: 1,
        merchandise: {
          title: "10mg", price: { amount: "10", currencyCode: "INR" },
          product: { title: "Test Compound", handle: "test", featuredImage: null },
        },
      }],
    }
    const cartAfterFirstClick = { ...cartV1, totalQuantity: 2, lines: [{ ...cartV1.lines[0], quantity: 2 }] }
    const cartAfterSecondClick = { ...cartV1, totalQuantity: 3, lines: [{ ...cartV1.lines[0], quantity: 3 }] }

    let patchCall = 0
    global.fetch = vi.fn(async (url: string, init?: RequestInit) => {
      if (init?.method === "PATCH") {
        patchCall += 1
        const thisCall = patchCall
        // First PATCH resolves LAST (simulates the out-of-order network response
        // this bug depends on), second PATCH resolves FIRST.
        const delayMs = thisCall === 1 ? 30 : 0
        await new Promise((r) => setTimeout(r, delayMs))
        const cart = thisCall === 1 ? cartAfterFirstClick : cartAfterSecondClick
        return { ok: true, json: async () => ({ cart }) }
      }
      return { ok: true, json: async () => ({ cart: cartV1 }) }
    }) as unknown as typeof fetch

    const onCountChange = vi.fn()
    render(<CartDrawer open={true} onClose={() => {}} onCountChange={onCountChange} />)

    const increment = await screen.findByLabelText(/increase test compound quantity/i)
    increment.click()
    increment.click()

    await new Promise((r) => setTimeout(r, 50))

    // The later click's result (quantity 3) must win, not the earlier click's
    // stale response (quantity 2) arriving after it.
    expect(await screen.findByText("3")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- CartDrawer`
Expected: FAIL — the displayed quantity ends up `2`, not `3`, because the first (slower) request's stale response overwrites the second.

- [ ] **Step 3: Implement the fix**

In `components/CartDrawer.tsx`, replace the `busyLine`/`updateLine`/`removeLine` trio with a sequenced mutation helper. Replace this block (was lines 29, 61-97):

```tsx
  const [busyLine, setBusyLine] = useState("")
```

with:

```tsx
  const [pendingCount, setPendingCount] = useState(0)
  const mutationSeq = useRef(0)
```

Replace `updateLine` and `removeLine` (was lines 61-97) with a shared `mutate` helper plus two thin wrappers:

```tsx
  const mutate = async (run: () => Promise<Response>) => {
    const seq = ++mutationSeq.current
    setPendingCount((n) => n + 1)
    setError("")
    try {
      const res = await run()
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not update your cart")
      if (seq !== mutationSeq.current) return // a newer mutation already superseded this response
      const next = data.cart as ShopifyCart
      setCart(next)
      onCountChange(next.totalQuantity)
    } catch (e) {
      if (seq === mutationSeq.current) setError((e as Error).message)
    } finally {
      setPendingCount((n) => n - 1)
    }
  }

  const updateLine = (lineId: string, quantity: number) =>
    mutate(() =>
      fetch("/api/shopify/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId, quantity }),
      })
    )

  const removeLine = (lineId: string) =>
    mutate(() => fetch(`/api/shopify/cart?lineId=${encodeURIComponent(lineId)}`, { method: "DELETE" }))
```

- [ ] **Step 4: Disable all line controls while any mutation is pending**

In the render, replace every use of `busyLine === line.id` / `lineBusy` (was lines 140, 154-163) so all lines lock together, not just the clicked one:

```tsx
              {cart.lines.map((line) => {
                const anyPending = pendingCount > 0
                return (
                  <div className="cart-row" key={line.id}>
                    <div className="cart-thumb">
                      {line.merchandise.product.featuredImage ? (
                        <img src={line.merchandise.product.featuredImage.url} alt="" width={62} height={62} />
                      ) : <span className="small">RUO</span>}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Link href={`/shop/${line.merchandise.product.handle}`} onClick={onClose} style={{ fontWeight: 700, display: "block" }}>
                        {line.merchandise.product.title}
                      </Link>
                      <div className="small" style={{ marginTop: 2 }}>{line.merchandise.title}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 10 }}>
                        <div className="qty" aria-label={`Quantity for ${line.merchandise.product.title}`}>
                          <button type="button" aria-label={`Decrease ${line.merchandise.product.title} quantity`} disabled={anyPending} onClick={() => updateLine(line.id, line.quantity - 1)}>−</button>
                          <span aria-live="polite">{line.quantity}</span>
                          <button type="button" aria-label={`Increase ${line.merchandise.product.title} quantity`} disabled={anyPending} onClick={() => updateLine(line.id, line.quantity + 1)}>+</button>
                        </div>
                        <strong>{money(line.merchandise.price.amount, line.merchandise.price.currencyCode)}</strong>
                      </div>
                      <button type="button" className="cart-remove" disabled={anyPending} onClick={() => removeLine(line.id)}>
                        {anyPending ? "Updating…" : "Remove"}
                      </button>
                    </div>
                  </div>
                )
              })}
```

- [ ] **Step 5: Run the test to confirm it passes**

Run: `npm test -- CartDrawer`
Expected: PASS.

- [ ] **Step 6: Verify build**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add components/CartDrawer.tsx components/CartDrawer.test.tsx
git commit -m "fix: sequence cart mutations so a slower stale response can't overwrite a newer one"
```

---

### Task 4: Fix the "Live stock" claim (CR-02)

**Files:**
- Create: `lib/availability.ts`
- Modify: `app/shop/[handle]/page.tsx:55`
- Test: `lib/availability.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// lib/availability.test.ts
import { describe, it, expect } from "vitest"
import { isAnyVariantAvailable } from "./availability"

describe("isAnyVariantAvailable", () => {
  it("is true when at least one variant is available", () => {
    expect(isAnyVariantAvailable([{ availableForSale: false }, { availableForSale: true }])).toBe(true)
  })
  it("is false when no variant is available", () => {
    expect(isAnyVariantAvailable([{ availableForSale: false }, { availableForSale: false }])).toBe(false)
  })
  it("is false for an empty variant list", () => {
    expect(isAnyVariantAvailable([])).toBe(false)
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npm test -- availability`
Expected: FAIL — `lib/availability.ts` doesn't exist yet.

- [ ] **Step 3: Implement**

```ts
// lib/availability.ts
export type VariantAvailability = { availableForSale: boolean }

/** True if at least one variant in the list can currently be sold. */
export function isAnyVariantAvailable(variants: VariantAvailability[]): boolean {
  return variants.some((v) => v.availableForSale)
}
```

- [ ] **Step 4: Run it to see it pass**

Run: `npm test -- availability`
Expected: PASS (3 tests).

- [ ] **Step 5: Use it on the Shopify PDP**

In `app/shop/[handle]/page.tsx`, add the import near the top:

```tsx
import { isAnyVariantAvailable } from "@/lib/availability"
```

Replace the hardcoded line (was line 55, inside the `minimal-product-facts` block):

```tsx
                <span><small>Availability</small>Live stock</span>
```

with:

```tsx
                <span><small>Availability</small>{isAnyVariantAvailable(product.variants) ? "In stock" : "Enquire"}</span>
```

- [ ] **Step 6: Verify the build**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add lib/availability.ts lib/availability.test.ts app/shop/[handle]/page.tsx
git commit -m "fix: derive Availability from real variant data instead of a hardcoded claim"
```

---

### Task 5: Render cart errors as a banner, not a full replacement (CR-07)

**Files:**
- Modify: `components/CartDrawer.tsx`
- Test: `components/CartDrawer.test.tsx` (extend)

- [ ] **Step 1: Write the failing test**

Add to `components/CartDrawer.test.tsx`:

```tsx
describe("CartDrawer error handling", () => {
  it("shows an error banner above the cart, not instead of it", async () => {
    const cart = {
      id: "c1", checkoutUrl: "#", totalQuantity: 1,
      cost: { totalAmount: { amount: "10", currencyCode: "INR" } },
      lines: [{
        id: "line-a", quantity: 1,
        merchandise: {
          title: "10mg", price: { amount: "10", currencyCode: "INR" },
          product: { title: "Test Compound", handle: "test", featuredImage: null },
        },
      }],
    }
    let call = 0
    global.fetch = vi.fn(async (_url: string, init?: RequestInit) => {
      call += 1
      if (init?.method === "PATCH") return { ok: false, json: async () => ({ error: "Network error" }) }
      return { ok: true, json: async () => ({ cart }) }
    }) as unknown as typeof fetch

    render(<CartDrawer open={true} onClose={() => {}} onCountChange={() => {}} />)
    const increment = await screen.findByLabelText(/increase test compound quantity/i)
    increment.click()

    expect(await screen.findByRole("alert")).toHaveTextContent("Network error")
    // The cart line must still be visible — the error is additive, not a replacement.
    expect(screen.getByText("Test Compound")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- CartDrawer`
Expected: FAIL — `screen.getByText("Test Compound")` throws because the error branch currently replaces the whole cart body.

- [ ] **Step 3: Fix the render branch**

In `components/CartDrawer.tsx`, replace the `drawer-body` conditional (was lines 124-134) so the error is a banner above the list, not a `case` in the same ternary:

```tsx
        <div className="drawer-body">
          {error && <div className="notice" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
          {loading ? (
            <p className="small" role="status" aria-live="polite">Loading your cart…</p>
          ) : !cart || cart.lines.length === 0 ? (
            <div style={{ padding: "32px 0" }}>
              <p style={{ fontWeight: 700, fontSize: 18 }}>Your cart is empty.</p>
              <p className="small" style={{ marginTop: 8 }}>Choose a research compound to begin. Your selection will stay available as you move around the site.</p>
              <Link href="/shop" className="btn primary" style={{ marginTop: 18 }} onClick={onClose}>Browse the storefront</Link>
            </div>
          ) : (
```

The closing of that same conditional (was line 169, `)}` before the final `</div>` of `drawer-body`) stays as-is — only the branching logic above it changes; the "has items" JSX block is untouched.

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npm test -- CartDrawer`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/CartDrawer.tsx components/CartDrawer.test.tsx
git commit -m "fix: show cart errors as a banner above the cart instead of replacing it"
```

---

### Task 6: Restore WhatsApp ordering (CR-05)

**Files:**
- Modify: `components/ShopProductCard.tsx`
- Modify: `app/products/[slug]/page.tsx`
- Modify: `app/shop/[handle]/page.tsx`
- Test: `components/WhatsAppOrderButton.test.tsx`

- [ ] **Step 1: Confirm the component still exists**

Run: `test -f components/WhatsAppOrderButton.tsx && echo "exists" || echo "MISSING — stop and recreate from git history before continuing"`
Expected: `exists` (the redesign patch removed its *usages*, not the file itself).

- [ ] **Step 2: Write a test for it (none existed before)**

```tsx
// components/WhatsAppOrderButton.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import WhatsAppOrderButton from "./WhatsAppOrderButton"
import { products } from "@/lib/data"

describe("WhatsAppOrderButton", () => {
  it("links to wa.me with the product name in the message", () => {
    const product = products[0]
    render(<WhatsAppOrderButton product={product} className="btn primary" label="Order" />)
    const link = screen.getByRole("link", { name: /order/i })
    expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"))
    expect(decodeURIComponent(link.getAttribute("href") || "")).toContain(product.name)
  })
})
```

- [ ] **Step 3: Run it**

Run: `npm test -- WhatsAppOrderButton`
Expected: PASS (this component's behavior didn't change — this test just gives it regression coverage it never had).

- [ ] **Step 4: Restore the import and usage in `ShopProductCard.tsx`**

Add the import (near the other imports, after the `Vial`/`Pen` imports):

```tsx
import WhatsAppOrderButton from "./WhatsAppOrderButton"
```

In the `pcard-actions` block, restore the WhatsApp button alongside the "View product & buy" link:

```tsx
        <div className="pcard-actions">
          <WhatsAppOrderButton product={p} className="btn primary sm" label="Order" />
          <Link href={productHref} className="btn ghost sm">Details</Link>
        </div>
```

- [ ] **Step 5: Restore it on the PDP (`app/products/[slug]/page.tsx`)**

Add the import:

```tsx
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton"
```

Add the button inside `minimal-buy-panel`, right after the `minimal-buy-card` block (after the closing `</div>` that follows the `ShopifyBuy`/`minimal-unlisted` conditional, before `minimal-ruo-notice`):

```tsx
              <WhatsAppOrderButton product={product} size={product.sizes[0]} className="btn ghost wide" />

              <p className="minimal-ruo-notice">{site.disclaimer}</p>
```

- [ ] **Step 6: Restore it on the Shopify-backed PDP (`app/shop/[handle]/page.tsx`)**

This route is a live Shopify catalog view — its `product` comes from `getProduct(params.handle)` in `lib/shopify.ts` and has no relationship to `lib/data.ts`'s local `Product`/slug scheme (confirmed: nothing in the codebase maps a Shopify `handle` to a local `slug`, and Shopify auto-generates handles from the store's own product titles). `WhatsAppOrderButton` is strictly typed to a local `Product`, so it can't be reused here without fabricating a fake `Product` object. Add a small dedicated link builder instead, working directly off the real Shopify product title already in scope.

In `lib/whatsapp.ts`, add a new exported function alongside the existing three (after `buildGeneralWhatsAppLink`):

```ts
export function buildShopifyProductWhatsAppLink(title: string): string {
  const text = `Hi, I'd like to order:\n\n${title}\n\n${RUO_LINE}`
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`
}
```

Add a test for it — this module had no test coverage before, so this is new regression coverage, not a behavior change:

```ts
// lib/whatsapp.test.ts
import { describe, it, expect } from "vitest"
import { buildShopifyProductWhatsAppLink } from "./whatsapp"

describe("buildShopifyProductWhatsAppLink", () => {
  it("builds a wa.me link containing the given product title", () => {
    const href = buildShopifyProductWhatsAppLink("Test Compound 10mg")
    expect(href).toContain("wa.me")
    expect(decodeURIComponent(href)).toContain("Test Compound 10mg")
  })
})
```

Run: `npm test -- whatsapp` — expect PASS (this one has no red step; it's a small pure function, not meaningfully falsifiable before it exists in a way worth a separate fail-first cycle).

In `app/shop/[handle]/page.tsx`, add the import:

```tsx
import { buildShopifyProductWhatsAppLink } from "@/lib/whatsapp"
```

Add the link after the `minimal-buy-card` block, before `minimal-ruo-notice`, styled to match `WhatsAppOrderButton`'s own markup so it's visually identical:

```tsx
              <a
                href={buildShopifyProductWhatsAppLink(product.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn ghost wide whatsapp-btn"
              >
                Order on WhatsApp
              </a>

              <p className="minimal-ruo-notice">{site.disclaimer}</p>
```

- [ ] **Step 7: Verify the build**

Run: `npx tsc --noEmit && npm run build`
Expected: both exit 0.

- [ ] **Step 8: Commit**

```bash
git add components/ShopProductCard.tsx app/products/\[slug\]/page.tsx app/shop/\[handle\]/page.tsx components/WhatsAppOrderButton.test.tsx lib/whatsapp.ts lib/whatsapp.test.ts
git commit -m "fix: restore WhatsApp ordering on product cards and both PDP variants"
```

---

### Task 7: Restore navigation, footer links, and sitemap entries (CR-04)

**Files:**
- Modify: `components/Footer.tsx:5-18`
- Modify: `app/sitemap.ts:10-13`
- Test: `components/Footer.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/Footer.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Footer from "./Footer"

describe("Footer links", () => {
  const expectedHrefs = ["/shop", "/coa", "/library", "/wholesale", "/about", "/faq", "/calculator", "/quality",
    "/research-use-only", "/shipping", "/returns", "/privacy", "/terms", "/disclaimer"]

  it("links to every page that has no other way to be reached", () => {
    render(<Footer />)
    for (const href of expectedHrefs) {
      expect(screen.getByRole("link", { name: new RegExp("^", "") }).ownerDocument.querySelector(`a[href="${href}"]`)).not.toBeNull()
    }
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- Footer`
Expected: FAIL — `/about`, `/faq`, `/calculator`, `/quality`, `/disclaimer` aren't in the footer yet.

- [ ] **Step 3: Restore the missing links**

In `components/Footer.tsx`, replace the `PRIMARY` and `LEGAL` arrays (was lines 5-18):

```tsx
const PRIMARY = [
  ["Shop", "/shop"],
  ["Verify a COA", "/coa"],
  ["Research library", "/library"],
  ["Wholesale", "/wholesale"],
  ["About us", "/about"],
  ["FAQ", "/faq"],
  ["Dilution calculator", "/calculator"],
  ["Our standards", "/quality"],
]

const LEGAL = [
  ["Research use only", "/research-use-only"],
  ["Shipping", "/shipping"],
  ["Returns", "/returns"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Disclaimer", "/disclaimer"],
]
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npm test -- Footer`
Expected: PASS.

- [ ] **Step 5: Add `/shop` and `/calculator` to the sitemap**

In `app/sitemap.ts`, replace the `stat` array (was lines 10-13):

```ts
  const stat = [
    "", "/shop", "/products", "/categories", "/coa", "/batch-reports", "/library",
    "/about", "/quality", "/wholesale", "/contact", "/faq", "/calculator", "/shipping",
    "/returns", "/privacy", "/terms", "/disclaimer", "/research-use-only",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : p === "/shop" || p === "/products" ? 0.9 : 0.6,
  }))
```

- [ ] **Step 6: Verify the build**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add components/Footer.tsx app/sitemap.ts components/Footer.test.tsx
git commit -m "fix: restore footer links to /about, /faq, /calculator, /quality, /disclaimer and add /shop, /calculator to the sitemap"
```

---

### Task 8: Restore the COA and spec tables on the product page (CR-06)

**Files:**
- Create: `components/SpecTable.tsx`
- Create: `components/CoaTable.tsx`
- Modify: `app/products/[slug]/page.tsx`
- Test: `components/SpecTable.test.tsx`
- Test: `components/CoaTable.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// components/SpecTable.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import SpecTable from "./SpecTable"
import { bySlug } from "@/lib/data"

describe("SpecTable", () => {
  it("shows storage and stability details for a product that has them", () => {
    const product = bySlug("retatrutide")!
    render(<SpecTable product={product} />)
    expect(screen.getByText(product.storage)).toBeInTheDocument()
    expect(screen.getByText(product.sku)).toBeInTheDocument()
  })
})
```

```tsx
// components/CoaTable.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import CoaTable from "./CoaTable"

const sampleCoas = [
  { batch: "BTLS-24-0091", testDate: "2026-06-01", purity: "99.1%", identity: "Confirmed", pdf: "/coa/sample.pdf" },
]

describe("CoaTable", () => {
  it("lists batch, purity and a PDF link when batches exist", () => {
    render(<CoaTable coas={sampleCoas} />)
    expect(screen.getByText("BTLS-24-0091")).toBeInTheDocument()
    expect(screen.getByText("99.1%")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /view pdf/i })).toHaveAttribute("href", "/coa/sample.pdf")
  })

  it("shows a documented fallback when no batches exist yet", () => {
    render(<CoaTable coas={[]} />)
    expect(screen.getByText(/verified independently/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run them to confirm they fail**

Run: `npm test -- SpecTable CoaTable`
Expected: FAIL — neither component exists yet.

- [ ] **Step 3: Implement `SpecTable.tsx`**

```tsx
// components/SpecTable.tsx
import type { Product } from "@/lib/data"

export default function SpecTable({ product }: { product: Product }) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)", fontWeight: 650, fontSize: 14.5 }}>
        Specifications
      </div>
      <table className="spec-table">
        <tbody>
          <tr><td>Product</td><td>{product.name}</td></tr>
          <tr><td>SKU</td><td className="mono">{product.sku}</td></tr>
          {product.code && <tr><td>Vial code</td><td className="mono">{product.code}</td></tr>}
          <tr><td>Compound type</td><td>{product.compoundType}</td></tr>
          {product.purity && <tr><td>Purity</td><td>{product.purity}</td></tr>}
          <tr><td>Form</td><td>{product.form}</td></tr>
          <tr><td>Storage</td><td>{product.storage}</td></tr>
          {product.stability && <tr><td>Stability</td><td>{product.stability}</td></tr>}
          {product.solubility && <tr><td>Solubility</td><td>{product.solubility}</td></tr>}
          <tr><td>Sizes</td><td>{product.sizes.map((s) => s.label).join(" · ")}</td></tr>
          <tr><td>Grade</td><td>Research grade — RUO</td></tr>
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 4: Implement `CoaTable.tsx`**

```tsx
// components/CoaTable.tsx
import Link from "next/link"

export type CoaRow = { batch: string; testDate: string; purity: string; identity: string; pdf?: string }

export default function CoaTable({ coas }: { coas: CoaRow[] }) {
  if (coas.length === 0) {
    return (
      <div className="notice blue" style={{ maxWidth: 720 }}>
        Batch documents for current lots are supplied with your order and can be verified independently on the{" "}
        <Link href="/coa" style={{ textDecoration: "underline" }}>COA Verification page</Link> using the batch
        number printed on the vial.
      </div>
    )
  }
  return (
    <div className="card" style={{ overflow: "auto" }}>
      <table className="param-table" style={{ minWidth: 680 }}>
        <thead>
          <tr><th>Batch</th><th>Test date</th><th>Purity</th><th>Identity</th><th>Report</th></tr>
        </thead>
        <tbody>
          {coas.map((c) => (
            <tr key={c.batch}>
              <td className="mono">{c.batch}</td>
              <td>{c.testDate}</td>
              <td>{c.purity}</td>
              <td>{c.identity}</td>
              <td>{c.pdf ? <a href={c.pdf} style={{ color: "var(--blue)", fontWeight: 600 }}>View PDF →</a> : <span className="not-reported">Not uploaded</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 5: Run the tests to confirm they pass**

Run: `npm test -- SpecTable CoaTable`
Expected: PASS (3 tests).

- [ ] **Step 6: Wire both into the product page**

`lib/coa.ts` exports `coaForProduct(slug): CoaRecord[]` (filtered to `status === "Released"`), and `param(record, name): string | null` for reading a named `TestParameter`'s result — this registry ships empty by design (see the file's header comment: never fabricate a lab result), so `CoaTable`'s empty-state fallback from Task 8 Step 4 is what actually renders until real batches are added.

In `app/products/[slug]/page.tsx`, add imports:

```tsx
import SpecTable from "@/components/SpecTable"
import CoaTable, { type CoaRow } from "@/components/CoaTable"
```

Replace the existing `coaForProduct`-only import with:

```tsx
import { coaForProduct, param } from "@/lib/coa"
```

Then build the rows just above the `return`, from the page's existing `coas` variable (`coaForProduct(product.slug)`):

```tsx
  const coaRows: CoaRow[] = coas.map((c) => ({
    batch: c.batch,
    testDate: c.testDate,
    purity: param(c, "Purity") ?? "Not reported",
    identity: param(c, "Identity") ?? "Not reported",
    pdf: c.pdf,
  }))
```

Add both components into the JSX as a new section, right after the closing `</section>` of `minimal-product-evidence` (was line 127) and before the final closing `</>`:

```tsx
      <section className="minimal-product-page" style={{ paddingTop: 0 }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
          <SpecTable product={product} />
          <CoaTable coas={coaRows} />
        </div>
      </section>
```

- [ ] **Step 7: Verify the build**

Run: `npx tsc --noEmit && npm run build`
Expected: both exit 0.

- [ ] **Step 8: Commit**

```bash
git add components/SpecTable.tsx components/CoaTable.tsx components/SpecTable.test.tsx components/CoaTable.test.tsx app/products/\[slug\]/page.tsx
git commit -m "fix: restore the spec table and per-batch COA table on the product page"
```

---

### Task 9: Restore RUO disclaimer prominence via a shared component (CR-08)

**Files:**
- Create: `components/RuoNotice.tsx`
- Modify: `app/products/[slug]/page.tsx`
- Modify: `app/shop/[handle]/page.tsx`
- Test: `components/RuoNotice.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/RuoNotice.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import RuoNotice from "./RuoNotice"
import { site } from "@/lib/config"

describe("RuoNotice", () => {
  it("renders the disclaimer with the highlighted notice styling, not a muted caption", () => {
    render(<RuoNotice />)
    const el = screen.getByText(site.disclaimer)
    expect(el).toHaveClass("notice")
    expect(el).not.toHaveClass("minimal-ruo-notice")
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- RuoNotice`
Expected: FAIL — component doesn't exist.

- [ ] **Step 3: Implement**

```tsx
// components/RuoNotice.tsx
import { site } from "@/lib/config"

/** The RUO disclaimer, always rendered with the highlighted `.notice` treatment —
 *  never demoted to a muted caption. Used on every page that sells a compound. */
export default function RuoNotice() {
  return <p className="notice">{site.disclaimer}</p>
}
```

- [ ] **Step 4: Run it to confirm it passes**

Run: `npm test -- RuoNotice`
Expected: PASS.

- [ ] **Step 5: Use it on both PDP variants**

In `app/products/[slug]/page.tsx`, add the import and replace the muted paragraph (was line 99, now shifted by Task 6's addition — search for `minimal-ruo-notice`):

```tsx
import RuoNotice from "@/components/RuoNotice"
```

```tsx
              <RuoNotice />
```

(replacing `<p className="minimal-ruo-notice">{site.disclaimer}</p>`; the now-unused `site` import can stay since `RuoNotice` itself imports it, but check whether `site` is still used elsewhere in this file before removing the import — it is, for `site.disclaimer` is no longer referenced directly here, so remove `import { site } from "@/lib/config"` only if nothing else in the file uses `site`).

Run: `grep -n "site\." app/products/\[slug\]/page.tsx`
If the only remaining match is inside `RuoNotice`'s own file, remove the now-unused `site` import from the page.

Do the same in `app/shop/[handle]/page.tsx` (replace `<p className="minimal-ruo-notice">{site.disclaimer}</p>` with `<RuoNotice />`, add the import, drop the now-unused `site` import if nothing else in that file uses it).

- [ ] **Step 6: Verify the build**

Run: `npx tsc --noEmit`
Expected: exit 0 (a leftover unused import would fail Next's lint step in `next build`, not `tsc`, so also run `npm run build`).

- [ ] **Step 7: Commit**

```bash
git add components/RuoNotice.tsx components/RuoNotice.test.tsx app/products/\[slug\]/page.tsx app/shop/\[handle\]/page.tsx
git commit -m "fix: restore highlighted RUO disclaimer styling on both product page variants"
```

---

### Task 10: Restore the cookie banner rationale comment (CR-09)

**Files:**
- Modify: `components/CookieConsent.tsx`

- [ ] **Step 1: Add the comment back**

In `components/CookieConsent.tsx`, insert this comment block above `const STORAGE_KEY` (was line 6):

```tsx
// This site currently sets exactly one cookie — `btls_cart_id`, strictly
// necessary to keep your Shopify cart working across page loads (see
// app/api/shopify/cart/route.ts). There is no analytics or advertising
// script anywhere on the site. If that ever changes, this banner's copy
// and consent flow must be revisited before shipping the new script —
// don't just add a script tag and leave this banner as-is.

const STORAGE_KEY = "btls_cookie_ack"
```

- [ ] **Step 2: Verify nothing else changed**

Run: `git diff components/CookieConsent.tsx`
Expected: only the comment block is added; the JSX/copy from the redesign stays as-is.

- [ ] **Step 3: Commit**

```bash
git add components/CookieConsent.tsx
git commit -m "docs: restore the guardrail comment explaining the cookie banner's one-cookie scope"
```

---

### Task 11: Fix contrast failures on micro-labels (CR-10)

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Raise the five flagged opacities**

In `app/globals.css`, make these exact replacements:

Line 897 (`.minimal-product-index`): change `color: rgba(255,255,255,0.34);` to `color: rgba(255,255,255,0.62);`

Line 888 (`.spotlight-code`): change `color: rgba(255,255,255,0.38);` to `color: rgba(255,255,255,0.62);`

Line 935 (`.verification-card span`): change `color: rgba(255,255,255,0.44);` to `color: rgba(255,255,255,0.64);`

Line 1056 (`.minimal-document-card > small`): change `color: rgba(255,255,255,0.42);` to `color: rgba(255,255,255,0.62);`

Line 1084 (`.minimal-shopify-visual > small`): change `color: rgba(255,255,255,0.36);` to `color: rgba(255,255,255,0.62);`

Line 849 (`.minimal-hero-note`) — this one carries the "Editorial imagery… Research use only" disclaimer specifically, raise it further: change `color: rgba(255,255,255,0.46);` to `color: rgba(255,255,255,0.75);`

- [ ] **Step 2: Verify the changes landed**

Run: `grep -n "rgba(255,255,255,0.34)\|rgba(255,255,255,0.38)\|rgba(255,255,255,0.44)\|rgba(255,255,255,0.42)\|rgba(255,255,255,0.36)\|rgba(255,255,255,0.46)" app/globals.css`
Expected: no matches remain at those six selectors (a global grep may still find `0.46` etc. used elsewhere for unrelated selectors — confirm by line number that the six flagged lines specifically changed, not just that the old values are gone everywhere).

- [ ] **Step 3: Verify the build**

Run: `npx tsc --noEmit`
Expected: exit 0 (CSS changes don't affect TypeScript, this just confirms nothing else broke).

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "fix: raise micro-label opacity on 6 selectors to pass WCAG AA contrast"
```

---

### Task 12: Fix the `priority` conflict on the below-the-fold spotlight image (CR-11)

**Files:**
- Modify: `components/HomeProductSpotlight.tsx`

- [ ] **Step 1: Remove the conflicting `priority` prop**

In `components/HomeProductSpotlight.tsx`, find the `<Image>` inside the spotlight media link (currently has `priority={active === 0}`) and delete that prop entirely — `next/image` defaults to `loading="lazy"`, which is correct since this component sits below `.minimal-hero` and `.proof-strip`.

Also fix the hardcoded `/ 04` next to it (flagged as a minor issue in the same area) so it doesn't desync if `FEATURED_SLUGS` ever changes length:

```tsx
          <span className="spotlight-code" aria-hidden="true">{String(active + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span>
```

- [ ] **Step 2: Verify**

Run: `grep -n "priority={active" components/HomeProductSpotlight.tsx`
Expected: no matches.

- [ ] **Step 3: Verify the build**

Run: `npx tsc --noEmit && npm run build`
Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add components/HomeProductSpotlight.tsx
git commit -m "fix: stop the spotlight image from competing with the real hero LCP, fix hardcoded slide count"
```

---

### Task 13: De-duplicate CSS tokens and remove the announcement bar cleanly (CR-12)

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Remove the second `:root` block and fold its tokens into the first**

In `app/globals.css`, the redesign added a second `:root { --mint: #9df5d0; --mint-deep: #62dca9; ... }` block around line 807. The existing `--teal: #9fe8d5` (line 32) is nearly identical to `--mint` — they're the same color used twice under different names.

Delete the `--mint`/`--mint-deep` declarations from the second `:root` block, and replace every use of `var(--mint)` in the file with `var(--teal)`:

Run: `grep -rln "var(--mint)" app/globals.css`

For each matching line, replace `var(--mint)` with `var(--teal)`. Also replace the two raw hex references to the mint value if any remain (`#9df5d0`, `#62dca9`) with `var(--teal)`.

Keep `--ink-dark`, `--bone`, `--ease-out`, `--ease-in-out` in the second `:root` block — those don't duplicate anything in the first block.

- [ ] **Step 2: Remove the duplicate `.header`, `.header-inner`, `.nav a`, `.btn.primary` overrides**

These selectors are declared once near the top of the file (around lines 119-135) and re-declared in the second block (around lines 817-830) purely to win by source order. Merge the later declarations' actually-different properties into the original rule and delete the later duplicate block entirely.

Run: `grep -n "^\.header \|^\.header-inner\|^\.nav a\|^\.btn\.primary" app/globals.css`

For each selector that appears twice, keep only the first occurrence, adding any property from the second occurrence that the first doesn't already have (e.g. `.header`'s `background: rgba(7, 9, 8, 0.7)` becomes the base declaration if the original didn't already set a background). Delete the second occurrence.

- [ ] **Step 3: Remove `.annbar { display: none }` and delete `<AnnouncementBar />` from the layout instead**

In `app/globals.css`, delete this line (was line 816):

```css
.annbar { display: none; }
```

In `app/layout.tsx`, remove the import and usage:

```tsx
import AnnouncementBar from "@/components/AnnouncementBar"
```

and the JSX line:

```tsx
<AnnouncementBar />
```

(both currently at lines 5 and 84 respectively). The component file `components/AnnouncementBar.tsx` stays in the repo — it's just no longer rendered, matching the minimal redesign's intent of dropping the promotional strip rather than hiding it via a CSS override that leaves it hydrating invisibly.

- [ ] **Step 4: Delete now-dead legacy CSS**

Run: `for cls in hero-centered hero-grid-centered hero-vials-solo hero-stat purity-badge showcase-media sticky-order-bar footer-grid catcard promo-banner trust-emoji shop-rail-card bundle-goal-btn param-table; do echo "--- .$cls ---"; grep -rln "\"$cls\"\|className=\"[^\"]*\b$cls\b" app components 2>/dev/null; done`

For each class name that has **zero** matches outside `app/globals.css` itself, delete its rule block from `app/globals.css`. Note: `param-table` is now used again by `CoaTable.tsx` from Task 8 — confirm it still has a real consumer before deleting; if Task 8 was already done, `param-table` should show a match in `components/CoaTable.tsx` and must be **kept**.

- [ ] **Step 5: Verify the build**

Run: `npx tsc --noEmit && npm run build`
Expected: both exit 0, and the build output no longer references `AnnouncementBar`.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "refactor: de-duplicate CSS tokens, remove the announcement bar cleanly, delete dead legacy classes"
```

---

### Task 14: Content-structure audit — orphaned link sweep

**Files:**
- No file changes expected; this task is a verification pass that either confirms Tasks 6/7 closed every gap, or surfaces a new one to fix.

- [ ] **Step 1: Re-run the orphaned-page check from the original audit**

Run:
```bash
for route in /about /faq /calculator /quality /disclaimer /shop; do
  echo "--- $route ---"
  grep -rn "href=\"$route\"\|href={\`$route" app components | grep -v "\.test\.tsx"
done
```
Expected: every route now has at least one match (from the Footer restoration in Task 7).

- [ ] **Step 2: Check for broken product/category references**

Run: `npx tsx -e "
import { products, categories, categoryBySlug } from './lib/data'
const bad = products.filter(p => !categoryBySlug(p.category))
console.log(bad.length === 0 ? 'OK: every product category resolves' : 'BROKEN: ' + JSON.stringify(bad.map(p => p.slug)))
"`
Expected: `OK: every product category resolves`. (If `tsx` isn't installed, run `npm install -D tsx` first — it's a dev-only script runner, not a runtime dependency.)

- [ ] **Step 3: Check for orphaned imports across the diagram/article system built in later phases**

This step is a placeholder to re-run once Phase 3 is complete — skip it now and return to it as the first step of Task 32 (final validation).

- [ ] **Step 4: Commit (only if Step 1 or 2 required a fix)**

If no fixes were needed, there's nothing to commit for this task — move on to Phase 2.

---

## Phase 2 — About Us + Visual Trust System

### Task 15: Extract About Us content into a typed, tested data module

**Files:**
- Create: `lib/about.ts`
- Test: `lib/about.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// lib/about.test.ts
import { describe, it, expect } from "vitest"
import { aboutContent } from "./about"

const bannedPhrases = [
  "world's leading", "world leading", "50+ countries", "25+ years",
]

describe("about page content", () => {
  it("never contains a superlative or unverifiable stat this project has already agreed to remove", () => {
    const allText = JSON.stringify(aboutContent).toLowerCase()
    for (const phrase of bannedPhrases) {
      expect(allText).not.toContain(phrase.toLowerCase())
    }
  })

  it("describes the Oxford facility as QC/repackaging/storage, never as where synthesis happens", () => {
    const text = aboutContent.facilityParagraph.toLowerCase()
    expect(text).toContain("oxford")
    expect(text).toMatch(/quality.?check|qc|repackag|storag/)
    expect(text).not.toMatch(/synthesi[sz]e|manufactur(e|ing) (the|our) (peptide|compound)/)
  })

  it("states the real testing scope, including the two newly-confirmed panels", () => {
    const text = aboutContent.testingParagraph.toLowerCase()
    expect(text).toContain("hplc")
    expect(text).toMatch(/mass spectrometry|\bms\b/)
    expect(text).toContain("heavy metal")
    expect(text).toMatch(/endotoxin|residual solvent/)
  })

  it("only uses stats that are actually derivable from the codebase", () => {
    const labels = aboutContent.stats.map((s) => s.label.toLowerCase())
    expect(labels.some((l) => l.includes("countries"))).toBe(false)
    expect(labels.some((l) => l.includes("years of excellence"))).toBe(false)
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- lib/about`
Expected: FAIL — `lib/about.ts` doesn't exist.

- [ ] **Step 3: Implement `lib/about.ts`**

```ts
// lib/about.ts
import { site } from "./config"
import { products } from "./data"

export type AboutStat = { value: string; label: string }
export type AboutValue = { title: string; body: string }

export const aboutContent = {
  heroLead:
    `Biotech Life Sciences has supplied documented research peptides since ${site.founded}, from ` +
    `${site.location}. Every batch that reaches a researcher is traceable back through a Certificate ` +
    `of Analysis to the partner that made it and the checks it passed before release.`,

  sourcingParagraph:
    "We don't operate the synthesis line. Every compound is made by an audited, vetted manufacturing " +
    "partner and characterized before it's accepted into our catalogue — we build trust through the " +
    "documentation that follows each batch, not through claiming a factory we don't run.",

  facilityParagraph:
    "What we do operate is our own facility in Oxford. Every batch that clears a partner's release is " +
    "received, quality-checked against its own Certificate of Analysis, repackaged and labeled for " +
    "dispatch, and stored there until it ships — the synthesis happens with our partners, the final " +
    "check and everything after it happens with us.",

  testingParagraph:
    "Purity and identity are confirmed by RP-HPLC and mass spectrometry on every released batch, the " +
    "same as any credible research supplier. Beyond that baseline, batches are also screened for heavy " +
    "metals and for endotoxins and residual solvents — the panel most suppliers stop short of, and the " +
    "one that actually determines whether a research material is safe to bring into a lab at all.",

  stats: [
    { value: String(site.founded), label: "Supplying research peptides since" },
    { value: `${products.length}+`, label: "Research compounds in the catalogue" },
    { value: "Oxford", label: `Own facility, ${site.location}` },
  ] satisfies AboutStat[],

  values: [
    {
      title: "Documentation before claims",
      body: "A batch number that doesn't resolve to a real Certificate of Analysis is treated as a defect, not a formality.",
    },
    {
      title: "Vetted partners, audited",
      body: "Manufacturing partners are checked against GMP-adjacent process standards before a single batch is accepted.",
    },
    {
      title: "The check that's ours",
      body: "Synthesis happens with our partners. QC, repackaging, storage and dispatch happen at our own Oxford facility.",
    },
  ] satisfies AboutValue[],
}
```

- [ ] **Step 4: Run it to confirm it passes**

Run: `npm test -- lib/about`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/about.ts lib/about.test.ts
git commit -m "feat: add tested About Us content module with verified-only facts"
```

---

### Task 16: Rewrite the About Us page

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Rewrite the page to consume `lib/about.ts`**

Replace the entire contents of `app/about/page.tsx`:

```tsx
import type { Metadata } from "next"
import Link from "next/link"
import Reveal from "@/components/Reveal"
import WhyTrustUs from "@/components/WhyTrustUs"
import TrustedByBand from "@/components/TrustedByBand"
import { site } from "@/lib/config"
import { aboutContent } from "@/lib/about"

export const metadata: Metadata = {
  title: "About",
  description: "Biotech Life Sciences — a UK-based research peptide supplier founded in 2000, operating its own Oxford QC and dispatch facility.",
}

export default function AboutPage() {
  return (
    <>
      <section className="section alt">
        <div className="container split center">
          <Reveal>
            <span className="eyebrow">About us</span>
            <h1 className="h-section">Documentation first, always.</h1>
            <p style={{ color: "var(--ink-2)", fontSize: 16, marginBottom: 14 }}>{aboutContent.heroLead}</p>
            <p style={{ color: "var(--ink-2)", fontSize: 16 }}>{aboutContent.sourcingParagraph}</p>
          </Reveal>
          <Reveal delay={1}>
            <div className="grid-2" style={{ gap: 14 }}>
              {aboutContent.stats.map((s) => (
                <div key={s.label} className="card" style={{ padding: "26px 22px", textAlign: "center" }}>
                  <b style={{ fontSize: 26, letterSpacing: "-0.02em" }}>{s.value}</b>
                  <div className="small" style={{ marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Our Oxford facility</span>
            <h2 className="h-section">The check that's ours</h2>
            <p className="lede">{aboutContent.facilityParagraph}</p>
          </Reveal>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Testing</span>
            <h2 className="h-section">Beyond purity and identity</h2>
            <p className="lede">{aboutContent.testingParagraph}</p>
          </Reveal>
        </div>
      </section>

      <WhyTrustUs />

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">What we stand for</span>
            <div className="grid-3" style={{ marginTop: 24 }}>
              {aboutContent.values.map((v, i) => (
                <div key={v.title} className="card" style={{ padding: 26, height: "100%" }}>
                  <span className="mono" style={{ color: "var(--teal)", fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ fontSize: 18, margin: "10px 0 8px" }}>{v.title}</h3>
                  <p className="small">{v.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <TrustedByBand />

      <section className="section">
        <div className="container" style={{ textAlign: "center", maxWidth: 720 }}>
          <Reveal>
            <h2 className="h-section">We support research worldwide</h2>
            <p className="lede" style={{ margin: "0 auto 26px" }}>{site.disclaimer}</p>
            <Link href="/contact" className="btn primary">Get in touch</Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
```

Note: this task references `WhyTrustUs` and `TrustedByBand`, built in Tasks 18 and 20. Complete this task's file edit now, but don't run `next build` until those components exist — `tsc --noEmit` will also fail on the missing imports until then. That's expected; move directly to Task 17.

- [ ] **Step 2: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: rewrite About Us page on verified-only facts, wire in trust components (build completes once Tasks 18/20 land)"
```

---

### Task 17: Add glow/gradient brand tokens and enlarge the logo

**Files:**
- Modify: `app/globals.css`
- Modify: `components/Header.tsx`

- [ ] **Step 1: Add the glow gradient tokens**

In `app/globals.css`, in the first `:root` block (after the existing `--teal-soft` declaration, around line 33), add:

```css
  /* glow — a distinct teal→indigo pair used sparingly for the logo and trust surfaces */
  --glow-a: var(--teal);
  --glow-b: #6c7fff;
  --glow-gradient: linear-gradient(135deg, var(--glow-a) 0%, var(--glow-b) 100%);
```

- [ ] **Step 2: Add the glow logo treatment**

In `app/globals.css`, find the `.logo` rule (line 132) and add a new rule immediately after it:

```css
.logo img {
  filter:
    drop-shadow(0 0 6px rgba(159, 232, 213, 0.55))
    drop-shadow(0 0 16px rgba(108, 127, 255, 0.35));
  transition: filter 200ms ease;
}
.logo:hover img {
  filter:
    drop-shadow(0 0 10px rgba(159, 232, 213, 0.75))
    drop-shadow(0 0 22px rgba(108, 127, 255, 0.5));
}
@media (prefers-reduced-motion: reduce) {
  .logo img { transition: none; }
}
```

- [ ] **Step 3: Enlarge the logo**

In `components/Header.tsx`, in the `Logo()` function, change the rendered height (was line 26):

```tsx
        style={{ width: "auto", height: 30 }}
```

to:

```tsx
        style={{ width: "auto", height: 40 }}
```

- [ ] **Step 4: Verify the build**

Run: `npx tsc --noEmit`
Expected: still fails at this point only because of Task 16's `WhyTrustUs`/`TrustedByBand` imports — confirm the *only* errors are those two missing modules, nothing CSS-related broke anything TypeScript checks.

Run: `grep -c "Cannot find module" <(npx tsc --noEmit 2>&1)`
Expected: `2` (exactly the two components not yet built).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css components/Header.tsx
git commit -m "feat: add glow gradient tokens, apply glow to the logo, increase logo size"
```

---

### Task 18: Build the `WhyTrustUs` component

**Files:**
- Create: `components/WhyTrustUs.tsx`
- Test: `components/WhyTrustUs.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/WhyTrustUs.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import WhyTrustUs from "./WhyTrustUs"

describe("WhyTrustUs", () => {
  it("states the three real, verified trust facts", () => {
    render(<WhyTrustUs />)
    expect(screen.getByText(/oxford/i)).toBeInTheDocument()
    expect(screen.getByText(/heavy metal/i)).toBeInTheDocument()
    expect(screen.getByText(/certificate of analysis|coa/i)).toBeInTheDocument()
  })

  it("does not claim we operate the synthesis line", () => {
    render(<WhyTrustUs />)
    expect(screen.queryByText(/we synthesize|our synthesis/i)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- WhyTrustUs`
Expected: FAIL — component doesn't exist.

- [ ] **Step 3: Implement**

```tsx
// components/WhyTrustUs.tsx
import Reveal from "./Reveal"

const REASONS = [
  {
    title: "Our own Oxford facility",
    body: "Every released batch is received, quality-checked, repackaged and stored at our facility in Oxford before it ships.",
  },
  {
    title: "Testing beyond the baseline",
    body: "HPLC purity and mass-spectrometry identity on every batch, plus heavy-metal and endotoxin/residual-solvent screening.",
  },
  {
    title: "A COA for every batch",
    body: "Batch number, purity and identity — checkable independently on the COA Verification page, not just asserted on this one.",
  },
]

export default function WhyTrustUs() {
  return (
    <section className="section alt why-trust-us">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Why trust us</span>
          <h2 className="h-section">What actually backs that up</h2>
        </Reveal>
        <div className="grid-3" style={{ marginTop: 26 }}>
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) as 0 | 1 | 2}>
              <div className="card why-trust-card" style={{ padding: 26, height: "100%" }}>
                <span className="why-trust-icon" aria-hidden="true" />
                <h3 style={{ fontSize: 17, margin: "14px 0 8px" }}>{r.title}</h3>
                <p className="small">{r.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Add its glow-tile CSS**

In `app/globals.css`, append at the end of the file:

```css
.why-trust-card { position: relative; overflow: hidden; }
.why-trust-icon {
  display: block; width: 34px; height: 34px; border-radius: 10px;
  background: var(--glow-gradient);
  box-shadow: 0 0 0 1px var(--line), 0 0 18px rgba(159, 232, 213, 0.35);
}
```

- [ ] **Step 5: Run the test to confirm it passes**

Run: `npm test -- WhyTrustUs`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add components/WhyTrustUs.tsx components/WhyTrustUs.test.tsx app/globals.css
git commit -m "feat: add WhyTrustUs section with glow-tile cards, grounded in verified facts"
```

---

### Task 19: Build the `TopResearchAreas` component for the PDP

**Files:**
- Create: `components/TopResearchAreas.tsx`
- Modify: `app/products/[slug]/page.tsx`
- Test: `components/TopResearchAreas.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/TopResearchAreas.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import TopResearchAreas from "./TopResearchAreas"

describe("TopResearchAreas", () => {
  it("shows at most the first 3 research areas from the product's real data", () => {
    render(<TopResearchAreas research={["Area A", "Area B", "Area C", "Area D", "Area E"]} />)
    expect(screen.getByText("Area A")).toBeInTheDocument()
    expect(screen.getByText("Area B")).toBeInTheDocument()
    expect(screen.getByText("Area C")).toBeInTheDocument()
    expect(screen.queryByText("Area D")).not.toBeInTheDocument()
  })

  it("numbers each area 01/02/03", () => {
    render(<TopResearchAreas research={["Only one area"]} />)
    expect(screen.getByText("01")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- TopResearchAreas`
Expected: FAIL — component doesn't exist.

- [ ] **Step 3: Implement**

```tsx
// components/TopResearchAreas.tsx
export default function TopResearchAreas({ research }: { research: string[] }) {
  const top3 = research.slice(0, 3)
  return (
    <div className="top-research-areas">
      <span className="minimal-kicker">Top research areas</span>
      <ol>
        {top3.map((area, i) => (
          <li key={area}>
            <span className="top-research-num">{String(i + 1).padStart(2, "0")}</span>
            <span>{area}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
```

- [ ] **Step 4: Add its CSS**

Append to `app/globals.css`:

```css
.top-research-areas { margin: 22px 0; }
.top-research-areas ol { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
.top-research-areas li { display: flex; align-items: baseline; gap: 12px; font-size: 14px; color: var(--ink-2); }
.top-research-num {
  font-family: var(--mono); font-size: 11px; font-weight: 600;
  background: var(--glow-gradient); -webkit-background-clip: text; background-clip: text; color: transparent;
}
```

- [ ] **Step 5: Run the test to confirm it passes**

Run: `npm test -- TopResearchAreas`
Expected: PASS (2 tests).

- [ ] **Step 6: Wire it into the product page**

In `app/products/[slug]/page.tsx`, add the import:

```tsx
import TopResearchAreas from "@/components/TopResearchAreas"
```

Place it inside `minimal-buy-panel`, right after the `minimal-product-facts` block and before `minimal-buy-card`:

```tsx
              <TopResearchAreas research={product.research} />

              <div className="minimal-buy-card">
```

- [ ] **Step 7: Verify the build**

Run: `npx tsc --noEmit`

- [ ] **Step 8: Commit**

```bash
git add components/TopResearchAreas.tsx components/TopResearchAreas.test.tsx app/globals.css app/products/\[slug\]/page.tsx
git commit -m "feat: add TopResearchAreas to the PDP, sourced from real product.research data"
```

---

### Task 20: Build the `TrustedByBand` component (categories, not fabricated logos)

**Files:**
- Create: `components/TrustedByBand.tsx`
- Test: `components/TrustedByBand.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/TrustedByBand.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import TrustedByBand from "./TrustedByBand"

describe("TrustedByBand", () => {
  it("lists real institution categories, not named clients", () => {
    render(<TrustedByBand />)
    expect(screen.getByText(/research laboratories/i)).toBeInTheDocument()
    expect(screen.getByText(/universities/i)).toBeInTheDocument()
    expect(screen.getByText(/biotechnology companies/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- TrustedByBand`
Expected: FAIL — component doesn't exist.

- [ ] **Step 3: Implement**

```tsx
// components/TrustedByBand.tsx
const CATEGORIES = [
  "Research laboratories",
  "Universities & academic institutions",
  "Biotechnology companies",
  "Contract research organizations",
  "Research distributors",
]

export default function TrustedByBand() {
  return (
    <div className="trusted-by-band">
      <span className="minimal-kicker">Trusted by</span>
      <div className="trusted-by-chips">
        {CATEGORIES.map((c) => (
          <span key={c} className="trusted-by-chip">{c}</span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Add its CSS**

Append to `app/globals.css`:

```css
.trusted-by-band { padding: 40px 0; display: flex; flex-direction: column; gap: 14px; align-items: center; text-align: center; }
.trusted-by-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.trusted-by-chip {
  font-size: 12.5px; padding: 8px 16px; border-radius: 999px;
  border: 1px solid var(--glow-a); background: rgba(159, 232, 213, 0.06); color: var(--ink-2);
}
```

- [ ] **Step 5: Run the test to confirm it passes**

Run: `npm test -- TrustedByBand`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/TrustedByBand.tsx components/TrustedByBand.test.tsx app/globals.css
git commit -m "feat: add TrustedByBand using institution categories, never fabricated client names"
```

---

### Task 21: Build `FulfillmentBadges` and wire into the PDP and cart

**Files:**
- Create: `components/FulfillmentBadges.tsx`
- Modify: `app/products/[slug]/page.tsx`
- Modify: `components/CartDrawer.tsx`
- Test: `components/FulfillmentBadges.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/FulfillmentBadges.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import FulfillmentBadges from "./FulfillmentBadges"

describe("FulfillmentBadges", () => {
  it("states the three real fulfillment facts, and links tracking to the order-status flow", () => {
    render(<FulfillmentBadges />)
    expect(screen.getByText(/bacteriostatic water/i)).toBeInTheDocument()
    expect(screen.getByText(/48.hour/i)).toBeInTheDocument()
    const trackingLink = screen.getByRole("link", { name: /track your order/i })
    expect(trackingLink).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- FulfillmentBadges`
Expected: FAIL — component doesn't exist.

- [ ] **Step 3: Implement**

Order tracking is real Shopify order-status functionality reached from the confirmation email, not a bespoke dashboard this codebase builds — so the badge links out to Shopify's own flow via the storefront domain rather than a page that doesn't exist yet.

```tsx
// components/FulfillmentBadges.tsx
import { site } from "@/lib/config"

export default function FulfillmentBadges() {
  return (
    <div className="fulfillment-badges" role="list" aria-label="Fulfillment details">
      <span role="listitem" className="fulfillment-badge">
        <span className="fulfillment-badge-dot" aria-hidden="true" />
        Free bacteriostatic water vial included
      </span>
      <span role="listitem" className="fulfillment-badge">
        <span className="fulfillment-badge-dot" aria-hidden="true" />
        48-hour dispatch guarantee
      </span>
      <a role="listitem" className="fulfillment-badge fulfillment-badge-link" href={`${site.url}/account/orders`}>
        <span className="fulfillment-badge-dot" aria-hidden="true" />
        Track your order
      </a>
    </div>
  )
}
```

- [ ] **Step 4: Add its CSS**

Append to `app/globals.css`:

```css
.fulfillment-badges { display: flex; flex-wrap: wrap; gap: 10px 18px; margin: 16px 0; }
.fulfillment-badge { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; color: var(--ink-2); }
.fulfillment-badge-link { text-decoration: underline; text-underline-offset: 3px; }
.fulfillment-badge-dot {
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
  background: var(--glow-gradient); box-shadow: 0 0 8px rgba(159, 232, 213, 0.6);
}
```

- [ ] **Step 5: Run the test to confirm it passes**

Run: `npm test -- FulfillmentBadges`
Expected: PASS.

- [ ] **Step 6: Wire into the PDP**

In `app/products/[slug]/page.tsx`, import and place it right after `TopResearchAreas` and before `minimal-buy-card`:

```tsx
import FulfillmentBadges from "@/components/FulfillmentBadges"
```

```tsx
              <TopResearchAreas research={product.research} />
              <FulfillmentBadges />

              <div className="minimal-buy-card">
```

- [ ] **Step 7: Wire into the cart drawer footer**

In `components/CartDrawer.tsx`, import it and place it inside `drawer-foot`, between the total and the checkout button:

```tsx
import FulfillmentBadges from "./FulfillmentBadges"
```

```tsx
        {hasItems && cart && (
          <div className="drawer-foot">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 15, marginBottom: 14 }}>
              <span className="small">Estimated total</span>
              <strong>{money(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}</strong>
            </div>
            <FulfillmentBadges />
            <a href={cart.checkoutUrl} className="btn primary wide">Checkout securely with Shopify →</a>
            <p className="small" style={{ marginTop: 10 }}>Payment, delivery options and tax are handled securely by Shopify Checkout.</p>
          </div>
        )}
```

- [ ] **Step 8: Verify the build**

Run: `npx tsc --noEmit && npm run build`
Expected: both exit 0 — Phase 2 is now fully wired, so this should be a genuinely clean build.

- [ ] **Step 9: Commit**

```bash
git add components/FulfillmentBadges.tsx components/FulfillmentBadges.test.tsx app/globals.css app/products/\[slug\]/page.tsx components/CartDrawer.tsx
git commit -m "feat: add FulfillmentBadges to PDP and cart, real fulfillment facts only"
```

---

## Phase 3 — Diagram System + New Articles

### Task 22: Build the `DiagramFrame` shared wrapper

**Files:**
- Create: `components/diagrams/DiagramFrame.tsx`
- Test: `components/diagrams/DiagramFrame.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/diagrams/DiagramFrame.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import DiagramFrame from "./DiagramFrame"

describe("DiagramFrame", () => {
  it("renders a labeled caption and its children", () => {
    render(
      <DiagramFrame title="Test Diagram" caption="A caption explaining the figure.">
        <svg role="img"><title>inner</title></svg>
      </DiagramFrame>
    )
    expect(screen.getByText("Test Diagram")).toBeInTheDocument()
    expect(screen.getByText("A caption explaining the figure.")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- DiagramFrame`
Expected: FAIL — component doesn't exist.

- [ ] **Step 3: Implement**

```tsx
// components/diagrams/DiagramFrame.tsx
import type { ReactNode } from "react"

export default function DiagramFrame({
  title,
  caption,
  children,
}: {
  title: string
  caption: string
  children: ReactNode
}) {
  return (
    <figure className="diagram-frame">
      <span className="diagram-frame-label">{title}</span>
      <div className="diagram-frame-body">{children}</div>
      <figcaption className="diagram-frame-caption">{caption}</figcaption>
    </figure>
  )
}
```

- [ ] **Step 4: Add its CSS**

Append to `app/globals.css`:

```css
.diagram-frame {
  margin: 28px 0; padding: 22px; border: 1px solid var(--line); border-radius: var(--radius);
  background: var(--surface);
}
.diagram-frame-label {
  display: block; font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--teal); margin-bottom: 14px;
}
.diagram-frame-body { display: flex; justify-content: center; overflow-x: auto; }
.diagram-frame-caption { margin-top: 14px; font-size: 12.5px; color: var(--muted); text-align: center; }
```

- [ ] **Step 5: Run the test to confirm it passes**

Run: `npm test -- DiagramFrame`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/diagrams/DiagramFrame.tsx components/diagrams/DiagramFrame.test.tsx app/globals.css
git commit -m "feat: add DiagramFrame, the shared chrome for the peptide-education diagram system"
```

---

### Task 23: Build `PeptideChainDiagram`

**Files:**
- Create: `components/diagrams/PeptideChainDiagram.tsx`
- Test: `components/diagrams/PeptideChainDiagram.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/diagrams/PeptideChainDiagram.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import PeptideChainDiagram from "./PeptideChainDiagram"

describe("PeptideChainDiagram", () => {
  it("labels the N-terminus, C-terminus, and a peptide bond", () => {
    render(<PeptideChainDiagram />)
    expect(screen.getByText("N-terminus")).toBeInTheDocument()
    expect(screen.getByText("C-terminus")).toBeInTheDocument()
    expect(screen.getByText("Peptide bond")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- PeptideChainDiagram`
Expected: FAIL.

- [ ] **Step 3: Implement**

```tsx
// components/diagrams/PeptideChainDiagram.tsx
import DiagramFrame from "./DiagramFrame"

const RESIDUE_X = [40, 100, 160, 220, 280, 340]

export default function PeptideChainDiagram() {
  return (
    <DiagramFrame
      title="Peptide chain structure"
      caption="A short peptide: amino-acid residues linked end-to-end by peptide bonds."
    >
      <svg width="400" height="140" viewBox="0 0 400 140" role="img" aria-labelledby="pcd-title pcd-desc">
        <title id="pcd-title">Diagram of a peptide chain</title>
        <desc id="pcd-desc">
          Six connected circles represent amino-acid residues in a chain, from the N-terminus on the left
          to the C-terminus on the right, joined by peptide bonds.
        </desc>

        {RESIDUE_X.slice(0, -1).map((x, i) => (
          <line key={`bond-${i}`} x1={x} y1={70} x2={RESIDUE_X[i + 1]} y2={70} stroke="var(--line-strong)" strokeWidth={2} />
        ))}

        {RESIDUE_X.map((x, i) => (
          <circle key={`residue-${i}`} cx={x} cy={70} r={16} fill={i % 2 === 0 ? "var(--glow-a)" : "var(--glow-b)"} opacity={0.85} />
        ))}

        <line x1={160} y1={54} x2={160} y2={30} stroke="var(--muted)" strokeWidth={1} />
        <text x="160" y="22" textAnchor="middle" fontSize="11" fill="var(--ink-2)">Peptide bond</text>

        <text x="40" y="110" textAnchor="middle" fontSize="11" fill="var(--muted)">N-terminus</text>
        <text x="340" y="110" textAnchor="middle" fontSize="11" fill="var(--muted)">C-terminus</text>
      </svg>
    </DiagramFrame>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npm test -- PeptideChainDiagram`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/diagrams/PeptideChainDiagram.tsx components/diagrams/PeptideChainDiagram.test.tsx
git commit -m "feat: add PeptideChainDiagram for the peptide-fundamentals article"
```

---

### Task 24: Build `ChromatogramDiagram` (dataviz-informed)

This is a real data visualization — a single trace, no comparison series — so per the dataviz skill: one hue, no legend (the title names the series), thin 2px line, direct labels on the two real peaks instead of a number on every point, recessive axis.

**Files:**
- Create: `components/diagrams/ChromatogramDiagram.tsx`
- Test: `components/diagrams/ChromatogramDiagram.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/diagrams/ChromatogramDiagram.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import ChromatogramDiagram from "./ChromatogramDiagram"

describe("ChromatogramDiagram", () => {
  it("labels the main peak with a purity figure and the axes with real units", () => {
    render(<ChromatogramDiagram />)
    expect(screen.getByText(/98\.\d%/)).toBeInTheDocument()
    expect(screen.getByText(/retention time/i)).toBeInTheDocument()
    expect(screen.getByText(/absorbance/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- ChromatogramDiagram`
Expected: FAIL.

- [ ] **Step 3: Implement**

```tsx
// components/diagrams/ChromatogramDiagram.tsx
import DiagramFrame from "./DiagramFrame"

const TRACE_PATH =
  "M 20,150 L 60,148 L 90,146 L 120,140 L 150,60 L 165,20 L 180,60 L 210,144 " +
  "L 260,142 L 280,130 L 290,110 L 300,130 L 320,143 L 380,146"

export default function ChromatogramDiagram() {
  return (
    <DiagramFrame
      title="HPLC chromatogram (illustrative)"
      caption="A worked example: one dominant peak at 98.6% area-percent, one minor peak in the impurity range."
    >
      <svg width="400" height="200" viewBox="0 0 400 200" role="img" aria-labelledby="chrom-title chrom-desc">
        <title id="chrom-title">Illustrative HPLC chromatogram</title>
        <desc id="chrom-desc">
          A line trace of UV absorbance over retention time, showing one dominant peak labeled 98.6 percent
          and one small labeled minor peak, on axes for retention time in minutes and absorbance at 220 nanometers.
        </desc>

        <line x1="20" y1="160" x2="380" y2="160" stroke="var(--line-strong)" strokeWidth={1} />
        <line x1="20" y1="20" x2="20" y2="160" stroke="var(--line-strong)" strokeWidth={1} />

        <path d={TRACE_PATH} fill="none" stroke="var(--glow-a)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        <circle cx="165" cy="20" r="3" fill="var(--glow-a)" />
        <text x="165" y="12" textAnchor="middle" fontSize="11" fill="var(--ink)">98.6%</text>

        <circle cx="290" cy="110" r="3" fill="var(--glow-a)" />
        <text x="290" y="102" textAnchor="middle" fontSize="10" fill="var(--muted)">1.1%</text>

        <text x="200" y="185" textAnchor="middle" fontSize="11" fill="var(--muted)">Retention time (min)</text>
        <text x="12" y="90" textAnchor="middle" fontSize="11" fill="var(--muted)" transform="rotate(-90 12 90)">Absorbance (220 nm)</text>
      </svg>
    </DiagramFrame>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npm test -- ChromatogramDiagram`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/diagrams/ChromatogramDiagram.tsx components/diagrams/ChromatogramDiagram.test.tsx
git commit -m "feat: add ChromatogramDiagram for the HPLC article, single-hue single-series per dataviz guidance"
```

---

### Task 25: Build `MassSpecDiagram` (dataviz-informed)

Same reasoning as Task 24: single series, one hue, direct-labeled dominant peak only, recessive axis.

**Files:**
- Create: `components/diagrams/MassSpecDiagram.tsx`
- Test: `components/diagrams/MassSpecDiagram.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/diagrams/MassSpecDiagram.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import MassSpecDiagram from "./MassSpecDiagram"

describe("MassSpecDiagram", () => {
  it("labels the m/z axis and the relative intensity axis", () => {
    render(<MassSpecDiagram />)
    expect(screen.getByText(/m\/z/)).toBeInTheDocument()
    expect(screen.getByText(/relative intensity/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- MassSpecDiagram`
Expected: FAIL.

- [ ] **Step 3: Implement**

```tsx
// components/diagrams/MassSpecDiagram.tsx
import DiagramFrame from "./DiagramFrame"

const BARS = [
  { x: 60, h: 14 }, { x: 100, h: 22 }, { x: 140, h: 40 }, { x: 180, h: 150 },
  { x: 220, h: 55 }, { x: 260, h: 18 }, { x: 300, h: 10 }, { x: 340, h: 6 },
]

export default function MassSpecDiagram() {
  return (
    <DiagramFrame
      title="ESI-MS spectrum (illustrative)"
      caption="A worked example: the tallest peak is the observed molecular mass, matching the theoretical sequence mass."
    >
      <svg width="400" height="200" viewBox="0 0 400 200" role="img" aria-labelledby="ms-title ms-desc">
        <title id="ms-title">Illustrative mass spectrum</title>
        <desc id="ms-desc">
          A stick plot of relative intensity against mass-to-charge ratio, with one dominant labeled peak
          representing the observed molecular mass, on axes for m/z and relative intensity as a percentage.
        </desc>

        <line x1="20" y1="170" x2="380" y2="170" stroke="var(--line-strong)" strokeWidth={1} />
        <line x1="20" y1="20" x2="20" y2="170" stroke="var(--line-strong)" strokeWidth={1} />

        {BARS.map((b) => (
          <rect key={b.x} x={b.x - 4} y={170 - b.h} width={8} height={b.h} rx={2} fill="var(--glow-a)" opacity={b.h === 150 ? 1 : 0.55} />
        ))}

        <text x="180" y="10" textAnchor="middle" fontSize="11" fill="var(--ink)">Observed: 1418.6 Da</text>

        <text x="200" y="192" textAnchor="middle" fontSize="11" fill="var(--muted)">m/z</text>
        <text x="12" y="95" textAnchor="middle" fontSize="11" fill="var(--muted)" transform="rotate(-90 12 95)">Relative intensity (%)</text>
      </svg>
    </DiagramFrame>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npm test -- MassSpecDiagram`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/diagrams/MassSpecDiagram.tsx components/diagrams/MassSpecDiagram.test.tsx
git commit -m "feat: add MassSpecDiagram for the mass-spectrometry article"
```

---

### Task 26: Build `CoaAnatomyDiagram`

**Files:**
- Create: `components/diagrams/CoaAnatomyDiagram.tsx`
- Test: `components/diagrams/CoaAnatomyDiagram.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/diagrams/CoaAnatomyDiagram.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import CoaAnatomyDiagram from "./CoaAnatomyDiagram"

describe("CoaAnatomyDiagram", () => {
  it("annotates the five fields a real COA must carry", () => {
    render(<CoaAnatomyDiagram />)
    for (const label of ["Batch number", "Purity (RP-HPLC)", "Identity (MS)", "Test date", "Issuing lab"]) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- CoaAnatomyDiagram`
Expected: FAIL.

- [ ] **Step 3: Implement**

```tsx
// components/diagrams/CoaAnatomyDiagram.tsx
import DiagramFrame from "./DiagramFrame"

const FIELDS = [
  { label: "Batch number", y: 40 },
  { label: "Purity (RP-HPLC)", y: 80 },
  { label: "Identity (MS)", y: 120 },
  { label: "Test date", y: 160 },
  { label: "Issuing lab", y: 200 },
]

export default function CoaAnatomyDiagram() {
  return (
    <DiagramFrame
      title="Anatomy of a Certificate of Analysis"
      caption="The five fields worth checking on any COA before trusting the batch it describes."
    >
      <svg width="360" height="240" viewBox="0 0 360 240" role="img" aria-labelledby="coa-title coa-desc">
        <title id="coa-title">Diagram of a Certificate of Analysis document</title>
        <desc id="coa-desc">
          A document outline with five annotated fields called out by leader lines: batch number, purity by
          RP-HPLC, identity by mass spectrometry, test date, and issuing laboratory.
        </desc>

        <rect x="40" y="20" width="140" height="200" rx="4" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth={1} />
        {FIELDS.map((f) => (
          <rect key={f.label} x="56" y={f.y - 8} width="108" height="10" rx="2" fill="var(--line-strong)" />
        ))}

        {FIELDS.map((f) => (
          <g key={f.label}>
            <line x1="180" y1={f.y - 3} x2="220" y2={f.y - 3} stroke="var(--glow-a)" strokeWidth={1} />
            <text x="226" y={f.y} fontSize="12" fill="var(--ink-2)">{f.label}</text>
          </g>
        ))}
      </svg>
    </DiagramFrame>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npm test -- CoaAnatomyDiagram`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/diagrams/CoaAnatomyDiagram.tsx components/diagrams/CoaAnatomyDiagram.test.tsx
git commit -m "feat: add CoaAnatomyDiagram for the how-to-read-a-COA article"
```

---

### Task 27: Build `DilutionDiagram`

**Files:**
- Create: `components/diagrams/DilutionDiagram.tsx`
- Test: `components/diagrams/DilutionDiagram.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/diagrams/DilutionDiagram.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import DilutionDiagram from "./DilutionDiagram"

describe("DilutionDiagram", () => {
  it("shows the worked reconstitution math end to end", () => {
    render(<DilutionDiagram />)
    expect(screen.getByText("10 mg")).toBeInTheDocument()
    expect(screen.getByText("2 mL")).toBeInTheDocument()
    expect(screen.getByText("5 mg/mL")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- DilutionDiagram`
Expected: FAIL.

- [ ] **Step 3: Implement**

```tsx
// components/diagrams/DilutionDiagram.tsx
import DiagramFrame from "./DiagramFrame"

export default function DilutionDiagram() {
  return (
    <DiagramFrame
      title="Reconstitution arithmetic"
      caption="Peptide mass ÷ diluent volume = solution concentration. Laboratory arithmetic only — not a dosing instruction."
    >
      <svg width="400" height="140" viewBox="0 0 400 140" role="img" aria-labelledby="dil-title dil-desc">
        <title id="dil-title">Diagram of reconstitution arithmetic</title>
        <desc id="dil-desc">
          A vial containing 10 milligrams of peptide, combined with 2 milliliters of diluent, equals a
          resulting concentration of 5 milligrams per milliliter.
        </desc>

        <rect x="20" y="40" width="50" height="60" rx="6" fill="var(--glow-a)" opacity={0.25} stroke="var(--glow-a)" strokeWidth={1.5} />
        <text x="45" y="120" textAnchor="middle" fontSize="12" fill="var(--ink)">10 mg</text>

        <text x="100" y="76" textAnchor="middle" fontSize="20" fill="var(--muted)">+</text>

        <rect x="130" y="40" width="50" height="60" rx="6" fill="var(--glow-b)" opacity={0.25} stroke="var(--glow-b)" strokeWidth={1.5} />
        <text x="155" y="120" textAnchor="middle" fontSize="12" fill="var(--ink)">2 mL</text>

        <text x="210" y="76" textAnchor="middle" fontSize="20" fill="var(--muted)">=</text>

        <rect x="240" y="30" width="140" height="80" rx="8" fill="var(--surface-2)" stroke="var(--line-strong)" strokeWidth={1} />
        <text x="310" y="65" textAnchor="middle" fontSize="16" fontWeight={600} fill="var(--ink)">5 mg/mL</text>
        <text x="310" y="85" textAnchor="middle" fontSize="10" fill="var(--muted)">resulting concentration</text>
      </svg>
    </DiagramFrame>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npm test -- DilutionDiagram`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/diagrams/DilutionDiagram.tsx components/diagrams/DilutionDiagram.test.tsx
git commit -m "feat: add DilutionDiagram for the new Reconstitution Math article"
```

---

### Task 28: Build `EvidenceLevelDiagram`

**Files:**
- Create: `components/diagrams/EvidenceLevelDiagram.tsx`
- Test: `components/diagrams/EvidenceLevelDiagram.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/diagrams/EvidenceLevelDiagram.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import EvidenceLevelDiagram from "./EvidenceLevelDiagram"
import { evidenceLevels } from "@/lib/evidence"

describe("EvidenceLevelDiagram", () => {
  it("shows all 5 real evidence levels from lib/evidence.ts, in strongest-to-weakest order", () => {
    render(<EvidenceLevelDiagram />)
    for (const level of Object.values(evidenceLevels)) {
      expect(screen.getByText(level.label)).toBeInTheDocument()
    }
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- EvidenceLevelDiagram`
Expected: FAIL.

- [ ] **Step 3: Implement**

```tsx
// components/diagrams/EvidenceLevelDiagram.tsx
import DiagramFrame from "./DiagramFrame"
import { evidenceLevels, type EvidenceLevel } from "@/lib/evidence"

const ORDER: EvidenceLevel[] = ["established", "clinical", "investigational", "preclinical", "limited"]

export default function EvidenceLevelDiagram() {
  return (
    <DiagramFrame
      title="Evidence-level scale"
      caption="The same vocabulary used on every research-application badge across the catalogue, strongest to weakest."
    >
      <svg width="440" height="120" viewBox="0 0 440 120" role="img" aria-labelledby="ev-title ev-desc">
        <title id="ev-title">Diagram of the evidence-level scale</title>
        <desc id="ev-desc">
          Five rungs from strongest to weakest evidence: established, clinical, investigational, preclinical,
          and limited, each with its definition.
        </desc>
        {ORDER.map((key, i) => {
          const x = 20 + i * 84
          const def = evidenceLevels[key]
          return (
            <g key={key}>
              <rect x={x} y={20} width={68} height={10} rx={5} fill="var(--glow-a)" opacity={1 - i * 0.16} />
              <text x={x + 34} y={50} textAnchor="middle" fontSize="11" fontWeight={600} fill="var(--ink)">{def.label}</text>
              <foreignObject x={x - 6} y={58} width="80" height="55">
                <div style={{ fontSize: 9.5, color: "var(--muted)", lineHeight: 1.35, textAlign: "center" }}>{def.definition}</div>
              </foreignObject>
            </g>
          )
        })}
      </svg>
    </DiagramFrame>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npm test -- EvidenceLevelDiagram`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/diagrams/EvidenceLevelDiagram.tsx components/diagrams/EvidenceLevelDiagram.test.tsx
git commit -m "feat: add EvidenceLevelDiagram sourced from the real evidenceLevels taxonomy"
```

---

### Task 29: Build `BioregulatorClassDiagram`

**Files:**
- Create: `components/diagrams/BioregulatorClassDiagram.tsx`
- Test: `components/diagrams/BioregulatorClassDiagram.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/diagrams/BioregulatorClassDiagram.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import BioregulatorClassDiagram from "./BioregulatorClassDiagram"
import { bySlug } from "@/lib/data"

describe("BioregulatorClassDiagram", () => {
  it("names all 6 real bioregulator products from the catalogue, not invented ones", () => {
    render(<BioregulatorClassDiagram />)
    for (const slug of ["epitalon", "pinealon", "cartalax", "chonluten", "cortagen", "pancregen"]) {
      const product = bySlug(slug)
      expect(product).toBeDefined()
      expect(screen.getByText(product!.name)).toBeInTheDocument()
    }
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- BioregulatorClassDiagram`
Expected: FAIL.

- [ ] **Step 3: Implement**

```tsx
// components/diagrams/BioregulatorClassDiagram.tsx
import DiagramFrame from "./DiagramFrame"
import { bySlug } from "@/lib/data"

const SLUGS = ["epitalon", "pinealon", "cartalax", "chonluten", "cortagen", "pancregen"]
const ANGLES = [270, 330, 30, 90, 150, 210] // degrees, evenly spaced around the hub

export default function BioregulatorClassDiagram() {
  const cx = 200, cy = 150, r = 100

  return (
    <DiagramFrame
      title="Peptide bioregulator class"
      caption="Six catalogue compounds sharing a research lineage — see the Bioregulators article for sourcing context."
    >
      <svg width="400" height="300" viewBox="0 0 400 300" role="img" aria-labelledby="bio-title bio-desc">
        <title id="bio-title">Diagram of the peptide bioregulator compound class</title>
        <desc id="bio-desc">
          A central hub labeled Peptide Bioregulators connects to six satellite nodes: Epitalon, Pinealon,
          Cartalax, Chonluten, Cortagen, and Pancregen.
        </desc>

        {SLUGS.map((slug, i) => {
          const angle = (ANGLES[i] * Math.PI) / 180
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          const product = bySlug(slug)!
          return <line key={`line-${slug}`} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line-strong)" strokeWidth={1} />
        })}

        <circle cx={cx} cy={cy} r={44} fill="var(--glow-gradient)" opacity={0.9} />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fontWeight={600} fill="var(--ink-dark)">Peptide</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fontWeight={600} fill="var(--ink-dark)">Bioregulators</text>

        {SLUGS.map((slug, i) => {
          const angle = (ANGLES[i] * Math.PI) / 180
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          const product = bySlug(slug)!
          return (
            <g key={slug}>
              <circle cx={x} cy={y} r={22} fill="var(--surface-2)" stroke="var(--glow-a)" strokeWidth={1.5} />
              <text x={x} y={y + 38} textAnchor="middle" fontSize="11" fill="var(--ink-2)">{product.name}</text>
            </g>
          )
        })}
      </svg>
    </DiagramFrame>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npm test -- BioregulatorClassDiagram`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/diagrams/BioregulatorClassDiagram.tsx components/diagrams/BioregulatorClassDiagram.test.tsx
git commit -m "feat: add BioregulatorClassDiagram naming only real catalogue products"
```

---

### Task 30: Wire diagrams into the `Article` type and article page

**Files:**
- Create: `components/diagrams/index.ts`
- Modify: `lib/library.ts`
- Modify: `app/library/[slug]/page.tsx`
- Test: `lib/library.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// lib/library.test.ts
import { describe, it, expect } from "vitest"
import { articles } from "./library"
import { DIAGRAM_COMPONENTS } from "@/components/diagrams"

describe("library article diagrams", () => {
  it("every article's diagram key, if set, resolves to a real component", () => {
    for (const a of articles) {
      if (a.diagram) {
        expect(DIAGRAM_COMPONENTS[a.diagram]).toBeDefined()
      }
    }
  })

  it("the 4 core technical articles each have a diagram assigned", () => {
    const withDiagram = ["what-are-research-peptides", "how-to-read-a-coa", "understanding-hplc", "understanding-mass-spectrometry"]
    for (const slug of withDiagram) {
      const article = articles.find((a) => a.slug === slug)
      expect(article?.diagram).toBeTruthy()
    }
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- lib/library`
Expected: FAIL — `components/diagrams/index.ts` doesn't exist yet and no article has a `diagram` field.

- [ ] **Step 3: Create the diagram registry**

```ts
// components/diagrams/index.ts
import type { ComponentType } from "react"
import PeptideChainDiagram from "./PeptideChainDiagram"
import ChromatogramDiagram from "./ChromatogramDiagram"
import MassSpecDiagram from "./MassSpecDiagram"
import CoaAnatomyDiagram from "./CoaAnatomyDiagram"
import DilutionDiagram from "./DilutionDiagram"
import EvidenceLevelDiagram from "./EvidenceLevelDiagram"
import BioregulatorClassDiagram from "./BioregulatorClassDiagram"

export const DIAGRAM_COMPONENTS: Record<string, ComponentType> = {
  "peptide-chain": PeptideChainDiagram,
  "chromatogram": ChromatogramDiagram,
  "mass-spec": MassSpecDiagram,
  "coa-anatomy": CoaAnatomyDiagram,
  "dilution": DilutionDiagram,
  "evidence-level": EvidenceLevelDiagram,
  "bioregulator-class": BioregulatorClassDiagram,
}
```

- [ ] **Step 4: Add the `diagram` field to the `Article` type and assign it on the 4 core articles**

In `lib/library.ts`, update the type (was lines 1-8):

```ts
export type Article = {
  slug: string
  title: string
  category: string
  minutes: number
  summary: string
  body: string[] // paragraphs
  diagram?: string // key into components/diagrams/index.ts's DIAGRAM_COMPONENTS
}
```

Add `diagram: "peptide-chain",` to the `what-are-research-peptides` entry, `diagram: "coa-anatomy",` to `how-to-read-a-coa`, `diagram: "chromatogram",` to `understanding-hplc`, and `diagram: "mass-spec",` to `understanding-mass-spectrometry` (each as a new field inside its existing object literal, anywhere after `summary`).

- [ ] **Step 5: Run the test to confirm it passes**

Run: `npm test -- lib/library`
Expected: PASS (2 tests).

- [ ] **Step 6: Render the diagram on the article page**

In `app/library/[slug]/page.tsx`, add the import:

```tsx
import { DIAGRAM_COMPONENTS } from "@/components/diagrams"
```

Insert the diagram render right after the paragraph body block and before the "not medical advice" notice (was around line 34):

```tsx
          <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 16, color: "var(--ink-2)", lineHeight: 1.75 }}>
            {a.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {a.diagram && DIAGRAM_COMPONENTS[a.diagram] && (() => {
            const Diagram = DIAGRAM_COMPONENTS[a.diagram]
            return <Diagram />
          })()}
          <div className="notice" style={{ marginTop: 34 }}>
```

- [ ] **Step 7: Verify the build**

Run: `npx tsc --noEmit && npm run build`
Expected: both exit 0.

- [ ] **Step 8: Commit**

```bash
git add components/diagrams/index.ts lib/library.ts lib/library.test.ts app/library/\[slug\]/page.tsx
git commit -m "feat: wire diagrams into library articles via a typed registry"
```

---

### Task 31: Add the 3 new library articles

**Files:**
- Modify: `lib/library.ts`
- Test: `lib/library.test.ts` (extend)

- [ ] **Step 1: Extend the test**

Add to `lib/library.test.ts`:

```ts
describe("new library articles", () => {
  const newSlugs = ["reconstitution-math-for-research-use", "understanding-evidence-levels", "peptide-bioregulators"]

  it("all 3 new articles exist with a diagram assigned", () => {
    for (const slug of newSlugs) {
      const article = articles.find((a) => a.slug === slug)
      expect(article).toBeDefined()
      expect(article?.diagram).toBeTruthy()
      expect(article?.body.length).toBeGreaterThan(2)
    }
  })

  it("the reconstitution article stays laboratory-math framing, never a dosing instruction", () => {
    const article = articles.find((a) => a.slug === "reconstitution-math-for-research-use")!
    const text = article.body.join(" ").toLowerCase()
    expect(text).not.toMatch(/\brecommended dose\b|\badminister\b|\binject\b/)
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- lib/library`
Expected: FAIL — the 3 new articles don't exist yet.

- [ ] **Step 3: Add the 3 articles**

In `lib/library.ts`, append these three entries to the `articles` array, right before its closing `]`:

```ts
  {
    slug: "reconstitution-math-for-research-use",
    title: "Reconstitution Math for Research Use",
    category: "Peptide Fundamentals", minutes: 5,
    diagram: "dilution",
    summary: "The arithmetic behind turning a lyophilized vial into a working solution — laboratory math, not a dosing guide.",
    body: [
      "Reconstitution is arithmetic, not judgment: a known mass of lyophilized peptide, dissolved in a known volume of diluent, produces a known concentration. Everything downstream in a research protocol depends on getting this one calculation right.",
      "The core relationship is concentration = mass ÷ volume. A 10 mg vial reconstituted with 2 mL of diluent produces a 5 mg/mL solution — 10 divided by 2. Add more diluent and the concentration drops; add less and it rises, in strict inverse proportion.",
      "The reverse calculation is just as common: given a vial's mass and a target concentration, the required diluent volume is mass ÷ target concentration. A 10 mg vial targeting 5 mg/mL needs 2 mL of diluent — the same relationship, solved for the other variable.",
      "This is laboratory arithmetic for research use only. It does not recommend, calculate, or imply any dose, protocol, or administration route for humans or animals — see our Reconstitution Calculator for a working version of this same math.",
    ],
  },
  {
    slug: "understanding-evidence-levels",
    title: "Understanding Evidence Levels in Peptide Research",
    category: "Research Terminology", minutes: 6,
    diagram: "evidence-level",
    summary: "How to read the evidence-strength badge shown against every research application on this site.",
    body: [
      "Not all published research carries the same weight, and a serious catalogue says so plainly rather than treating every citation as equally strong. This site uses one consistent five-level scale, applied to a specific compound-application pair — never to a compound in general.",
      "Established means the effect is well-replicated across independent studies for that specific application. Clinical means human trial data exists, even if limited in scale or not yet leading to approval. Investigational means early-phase human data exists but the picture is incomplete.",
      "Preclinical means the evidence comes from animal or cell-culture models — informative for research design, but not yet tested in humans for that application. Limited means the available evidence is thin, mixed, or drawn from a narrow set of sources, and is labeled that way rather than dressed up.",
      "A compound can sit at different levels for different applications simultaneously — strong evidence for one mechanism and thin evidence for another is normal, not a contradiction. Reading the level next to the specific application, not just the compound name, is the whole point of the system.",
    ],
  },
  {
    slug: "peptide-bioregulators",
    title: "Peptide Bioregulators: Origins and Evidence Context",
    category: "Compound Directory", minutes: 6,
    diagram: "bioregulator-class",
    summary: "A distinct research lineage — six catalogue compounds, and an honest account of where the literature comes from.",
    body: [
      "Peptide bioregulators are a class of short synthetic peptides originally developed through a specific line of Russian gerontology research, studied for tissue-specific regulatory effects in preclinical models. Epitalon, Pinealon, Cartalax, Chonluten, Cortagen and Pancregen all belong to this class.",
      "Each compound in the class is associated with a particular tissue or organ system in the originating research program — the naming generally reflects that focus rather than a mechanism confirmed by independent replication.",
      "The evidence base for this class is concentrated in a comparatively small number of research groups and publications, most originating from the same laboratories that developed the compounds. Independent, Western-language replication is limited relative to better-studied compound classes on this site.",
      "That concentration of sourcing doesn't mean the research doesn't exist — it means readers should weight it accordingly. Treat this class the way the evidence-level system treats anything labeled preclinical or limited: as a starting point for further reading, not as a settled result.",
    ],
  },
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npm test -- lib/library`
Expected: PASS (4 tests).

- [ ] **Step 5: Verify the build (this regenerates static params for 3 new article routes)**

Run: `npx tsc --noEmit && npm run build`
Expected: both exit 0, and the build output lists 3 additional `/library/[slug]` static routes.

- [ ] **Step 6: Commit**

```bash
git add lib/library.ts lib/library.test.ts
git commit -m "feat: add 3 new Research Library articles with diagrams — reconstitution math, evidence levels, bioregulators"
```

---

## Phase 4 — Final Validation

### Task 32: Full validation pass and merge to master

**Files:** none (verification only, plus the merge itself).

- [ ] **Step 1: Re-run the orphaned-link and category checks from Task 14, now that Phase 3 added new routes**

Run:
```bash
for route in /about /faq /calculator /quality /disclaimer /shop; do
  grep -rq "href=\"$route\"\|href={\`$route" app components && echo "$route: OK" || echo "$route: MISSING"
done
```
Expected: every route prints `OK`.

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: all test files pass — by this point that's `smoke`, `CartDrawer`, `Header`, `availability`, `Footer`, `WhatsAppOrderButton`, `SpecTable`, `CoaTable`, `RuoNotice`, `about`, `WhyTrustUs`, `TopResearchAreas`, `TrustedByBand`, `FulfillmentBadges`, `DiagramFrame`, and all 7 diagram components, plus `library` — 20+ files, 0 failures.

- [ ] **Step 3: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: both exit 0.

- [ ] **Step 4: Manual browser check**

Run: `npm run dev` (starts on port 3010), then in a browser (or via the claude-in-chrome tools):
- Visit `/about` — confirm the Oxford facility paragraph, the testing paragraph, `WhyTrustUs`, and `TrustedByBand` all render, and confirm none of the removed phrases ("world's leading", "50+ countries", "25+ years") appear anywhere on the page.
- Visit `/products/retatrutide` (or any real product slug) — confirm `TopResearchAreas`, `FulfillmentBadges`, the restored spec table, the restored COA table, and the restored `WhatsAppOrderButton` all render; confirm the RUO disclaimer uses the highlighted `.notice` styling.
- Visit `/library/how-to-read-a-coa` and `/library/reconstitution-math-for-research-use` — confirm each renders its assigned diagram with legible labels.
- Open the cart drawer, add an item, confirm the free-water/48h-dispatch/tracking badges appear in the footer, and confirm the logo in the header is visibly larger with a soft glow.
- Tab through the page with the cart drawer closed — confirm focus never lands inside it (the CR-01 fix).

Stop the dev server when done: find the process and terminate it, or use whatever mechanism started it.

- [ ] **Step 5: Merge to local master**

```bash
cd ~/Documents/GitHub/biotech-life-sciences
git status  # confirm the working tree is clean before merging
git merge review/redesign-diff --no-ff -m "merge: restore minimal editorial redesign with audit fixes, About Us rewrite, diagram system, trust components"
```

- [ ] **Step 6: Final confirmation**

Run: `git log --oneline -5 && npx tsc --noEmit && npm run build`
Expected: the merge commit is at HEAD, and both checks still pass on `master` itself, not just the branch.

**Do not push to `origin` — that requires separate, explicit confirmation.**
