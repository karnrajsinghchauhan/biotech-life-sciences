# Consumer shop-first homepage + WhatsApp ordering

Date: 2026-08-23

## Goal

Make the site feel like a consumer shopping app on iPhone: shop visible immediately
on load, products organized into goal-based categories, a lightweight "build your
bundle" assistant, and a WhatsApp ordering path available on every product. All of
this sits on top of the existing site — nothing in the current RUO / compliance
framing (disclaimers, COA verification, wholesale, terms) is removed or weakened.

## What stays unchanged

- `/shop` and `/shop/[handle]` — the live Shopify cart/checkout flow.
- `/products`, `/products/[slug]`, `/categories/[slug]` — the existing research
  catalogue browsing pages, built from `lib/data.ts`.
- The black/white/graphite design system in `app/globals.css`
  (`--bg`, `--ink`, `--blue`, `.btn`, `.pcard`, `.card`, etc.) — new components reuse
  these tokens rather than introducing a second visual language.
- `site.disclaimer` and its placement on every product-facing page.

## Data source

The new shop-first sections are built on `lib/data.ts` (the rich, already-categorized
catalogue: `cognitive`, `dermal`, `tissue-repair`, `metabolic`, `gh-performance`,
`sleep`, `longevity`, `immune`, etc.), not on live Shopify data. Shopify has no
category metadata and only a subset of products synced, so re-deriving categories
from it isn't practical. `/shop` remains the place for the live Shopify cart
experience; this work is additive, not a replacement.

Consumer-facing category labels (display only — `CategorySlug` values are unchanged):

| CategorySlug     | Consumer label        |
|-------------------|------------------------|
| cognitive          | Nootropic              |
| dermal             | Skin Health             |
| tissue-repair      | Tissue Repair           |
| cellular           | Cellular Health          |
| metabolic          | Metabolic               |
| gh-performance     | GH & Performance        |
| sleep              | Sleep                   |
| longevity          | Longevity                |
| immune             | Immune Support          |
| reproductive       | Vitality                |
| mitochondrial      | Cellular Energy          |
| connective         | Joint & Connective       |
| gastrointestinal   | Gut Health               |
| other              | Specialist               |

This mapping lives in one place: `lib/shopLabels.ts`.

## Homepage restructure (`app/page.tsx`)

New order, mobile-first:

1. **Compact hero** — headline/subhead trimmed from today's version (the 4-stat row
   moves below the fold), two large touch targets: "Shop Now" (anchors to the
   category rail) and "Build Your Bundle" (opens the assistant).
2. **`ShopCategoryRail`** — horizontally scrollable card strip, one per non-empty
   category, consumer-labeled per the table above. Tapping a card scrolls to that
   category's block in the grid below.
3. **`ShopProductGrid`** — products grouped by category (reusing `primaryCategories`
   ordering: tissue-repair, dermal, cognitive first, matching what the user asked
   for by name), each rendered with `ShopProductCard`.
4. Everything that exists today (category showcases, featured grid, all-categories
   grid, research applications, COA CTA, facility photography, batch transparency,
   testimonials, standards, library preview, wholesale, FAQ, final CTA) stays, just
   further down the page.

## New components

- **`lib/whatsapp.ts`** — `buildWhatsAppOrderLink(product, size?)` and
  `buildBundleWhatsAppLink(products[])`. Builds a `https://wa.me/<number>?text=...`
  URL. Message includes product name, SKU/size, and one disclaimer line ("...supplied
  for laboratory research use only; I am ordering for research purposes."),
  consistent with `site.disclaimer` wording used elsewhere.
- **`components/WhatsAppOrderButton.tsx`** — client component, brand-green button
  with WhatsApp glyph, `target="_blank"`. Takes either a single product+size or a
  product list (bundle mode).
- **`components/ShopCategoryRail.tsx`** — the horizontal category strip.
- **`components/ShopProductCard.tsx`** — image, name, "from ₹X", primary
  `WhatsAppOrderButton`, secondary "Details" link to `/products/[slug]`.
- **`components/BundleAssistant.tsx`** — client component, modal/sheet:
  - Step 1: "What's your goal?" — buttons for Recovery & Repair, Skin & Glow, Focus &
    Cognition, Metabolic, Sleep, Longevity, Performance — each mapped to 1–2
    `CategorySlug`s.
  - Step 2: shows the top 3 products for that goal (bestseller/featured first,
    `inCategory(slug)` filtered), each removable from the bundle.
  - One `WhatsAppOrderButton` in bundle mode sends a single message listing every
    selected item.
  - Entirely rule-based — no LLM call, no backend route.

## Wiring WhatsApp onto every product surface

`WhatsAppOrderButton` is added to:
- New homepage `ShopProductCard`s.
- `/products/[slug]` buy panel — alongside the existing Shopify-buy-or-wholesale-quote
  block, not replacing it.
- `/shop/[handle]` buy panel — alongside the existing `ShopifyBuy` component.
- `/categories/[slug]` product listing.

## Config changes

`lib/config.ts`: add `whatsapp: "447529563762"` (E.164 digits, no `+`, derived from
the existing `site.phone`).

## Mobile/iOS polish

- Safe-area-inset padding (`env(safe-area-inset-bottom)`) on any sticky element.
- Sticky bottom "Order on WhatsApp" bar on `/products/[slug]` on small screens only.
- Verify tap targets ≥44px on the category rail and bundle assistant buttons.

## Out of scope

- No changes to Shopify sync, checkout, or payment handling.
- No AI/LLM-backed assistant — explicitly deferred in favor of the rule-based quiz.
- No native iOS app / PWA manifest work — this is a responsive mobile-web pass.

## Testing plan

- `npm run build` to confirm no type/build errors.
- Local dev server, resize to iPhone viewport (390×844): confirm hero → category
  rail → product grid is reachable within ~1 scroll, WhatsApp links open with the
  correct prefilled message and number for a couple of sample products, bundle
  assistant flow end to end.
- Confirm `/shop` and `/shop/[handle]` Shopify checkout still renders and functions
  unchanged.
- Confirm existing pages (`/products`, `/categories/[slug]`, disclaimer/terms/COA)
  are unaffected.
