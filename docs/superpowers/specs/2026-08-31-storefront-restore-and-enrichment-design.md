# Storefront Restore & Enrichment — Design Spec

Date: 2026-08-31
Branch: `review/redesign-diff` (worktree at `/tmp/btls-review`), merging to `master` once validated.

## Goals

1. Restore the reviewed "minimal editorial" redesign into `master` with the priority fixes from the earlier code audit applied.
2. Rewrite the About Us page and add a real peptide-education diagram system to the Research Library, both grounded in verified facts.
3. Adopt a distinct, glowing gradient / "Apple-style" visual identity for the trust-and-credibility surfaces (About page, product trust sections), inspired structurally by strong DTC research-peptide sites but never copying their written copy or claims.
4. Validate everything (build, typecheck, manual browser check) before merging.

## Ground rules (non-negotiable, carried from this conversation)

- **No copied copy.** Product descriptions, blog-style benefit write-ups, and marketing prose are written fresh in BTLS's own voice. No verbatim or near-verbatim text from any reference site.
- **No copied pricing.** BTLS's own catalogue pricing (`lib/data.ts`) is the only pricing used anywhere.
- **Only user-confirmed facts get stated as fact.** Specifically, per this session:
  - BTLS operates real facility/lab space in Oxford — used for **QC, repackaging, and storage**, not synthesis. The existing framing ("sourced from vetted, audited manufacturing partners rather than operating our own synthesis facility") stays intact and is *combined* with the new fact, not replaced by it.
  - Testing genuinely goes beyond HPLC purity + MS identity — batches are also screened for **heavy metals** and **endotoxins/residual solvents**.
  - Every order includes a **free bacteriostatic water vial**, ships within a **48-hour dispatch guarantee**, and has **order tracking** available (implemented as a link to the Shopify order-status page reached via the confirmation email — not a bespoke tracking dashboard, since Shopify already provides this once a fulfillment service is attached).
  - "Trusted By" uses institution **categories** (research laboratories, universities, biotechnology companies, CROs — already listed honestly on the current About page), not named clients or logos, unless real client names are supplied later.

## A. Restore & Audit

Applied on `review/redesign-diff` before merge:

| Fix | Ref | Summary |
|---|---|---|
| Imperative `inert` toggle | CR-01 | Ref-based `setAttribute`/`removeAttribute` on `CartDrawer` aside and the mobile menu; drop the React `inert` prop. |
| Cart race condition | CR-03 | Single in-flight `pending` counter + request-sequence guard in `CartDrawer`; disable all line controls while any mutation is in flight. |
| Nav/footer restoration | CR-04 | Re-add `/faq`, `/about`, `/calculator`, `/quality`, `/disclaimer` to `Footer.tsx`; add `/shop`, `/calculator` to `app/sitemap.ts`. |
| WhatsApp ordering restored | CR-05 | Re-add `WhatsAppOrderButton` to `ShopProductCard`, PDP buy panel, PDP sticky bar. |
| COA + spec table restored | CR-06 | Re-add the batch/purity/identity/PDF table and the spec table to `app/products/[slug]/page.tsx`. |
| Cart error banner | CR-07 | Render mutation errors as a banner above the line list, not a full replacement. |
| "Live stock" claim | CR-02 | Derive from `variants.some(v => v.availableForSale)` instead of hardcoding. |
| RUO disclaimer prominence | CR-08 | Restore `.notice` styling (was demoted to 10.5px muted grey) on both product page variants. |
| Cookie banner comment | CR-09 | Restore the PECR/GDPR rationale comment in `CookieConsent.tsx`; keep the tightened copy. |
| Contrast fixes | CR-10 | Raise the 5 flagged micro-label opacities to pass WCAG AA. |
| `priority` image fix | CR-11 | Drop `priority` from the below-the-fold spotlight image. |
| CSS token de-dup | CR-12 | Fold the "minimal editorial" `:root` tokens into the single root token set; remove `!important` fights; delete `.annbar{display:none}` in favor of removing `<AnnouncementBar />` from `layout.tsx` if it's meant to be gone. |
| Content-structure audit | — | Grep sweep for orphaned links/dead imports across `app/` and `lib/` after the above changes. |

## B. About Us Narrative

Rewritten `app/about/page.tsx`, verifiable-only tone (per prior approval), now including the two new confirmed facts:

- Hero: founding year (`site.founded`), Oxford location, the documentation-first positioning — no superlatives ("world's leading"), no invented stats ("50+ countries").
- **How we source** section keeps the vetted-partner framing, now paired with: *"Every batch that reaches a partner's release is received, quality-checked, repackaged and stored at our own Oxford facility before dispatch — we don't operate the synthesis line, but we don't outsource the final check either."* (exact phrasing to be finalized in copy, not this spec).
- **Testing** section states the real panel: HPLC purity, MS identity, heavy-metal screening, endotoxin/residual-solvent screening — worded as what it is, not as a slogan.
- Stat cards use only real, derivable numbers: founding year, `products.length`, Oxford location. No fabricated country/customer counts.
- Values section: replace the 5 generic cards with 3 that map to something concrete already true of the business (documentation-first / vetted-partner model / batch-level accountability) rather than "Customer Focus"-style boilerplate.

## C. Visual Direction

A distinct gradient/glow identity — not a copy of any reference site's specific hues, but the same *category* of treatment (glass depth, glow, restrained gradient accents), built from tokens already partially present in `app/globals.css` (`--teal`, `--blue`):

- New gradient tokens: a teal→indigo glow pair (`--glow-a`, `--glow-b`) used sparingly — logo, hero accents, trust-section borders, badge fills — not applied globally.
- Logo: increase rendered size in the header and add a soft layered glow (`filter: drop-shadow` stack, respecting `prefers-reduced-motion` for any pulse).
- "Why Trust Us" section (About page + a compact version on PDPs): 3-up card layout — Oxford facility & QC, extended testing panel, batch-level COA — each with a glow-bordered icon tile.
- "Top 3 Research Areas" per product: pulled from the existing `product.research` array in `lib/data.ts` (already real, already written) — just the top 3, presented as a labeled list on the PDP, not new content.
- "Trusted By" band: category chips (Research laboratories · Universities & academic institutions · Biotechnology companies · CROs), glow-outlined, matching the existing About page list content.
- Fulfillment badges: free water vial included / 48h dispatch / order tracking — small badge row on PDP and cart, linking "track your order" to the Shopify order-status flow.

## D. Peptide Education Diagram System

Unchanged from the prior approved design:

- `components/diagrams/DiagramFrame.tsx` — shared chrome.
- `PeptideChainDiagram.tsx`, `ChromatogramDiagram.tsx`, `MassSpecDiagram.tsx`, `CoaAnatomyDiagram.tsx`, `DilutionDiagram.tsx`, `EvidenceLevelDiagram.tsx`, `BioregulatorClassDiagram.tsx` — static, server-renderable SVG, real `<title>`/`<desc>`, visible text labels.
- `lib/library.ts` `Article` type gains an optional `diagram?: string` field; `app/library/[slug]/page.tsx` renders the matching diagram inline.
- Three new articles added (content + citations already gathered in the earlier research pass): *Reconstitution Math for Research Use*, *Understanding Evidence Levels in Peptide Research*, *Peptide Bioregulators: Origins and Evidence Context*.

## E. Implementation approach

Work is split across parallel implementation agents (Opus-model workers) once this spec is approved, coordinated by this session:

1. **Worker 1 — Restore/audit fixes** (section A) on the existing worktree branch.
2. **Worker 2 — About Us + Trust/visual system** (sections B, C).
3. **Worker 3 — Diagram components + 3 new library articles** (section D).

Each worker's output is reviewed and validated together (not merged blind). Final validation: `tsc --noEmit`, `next build`, then a `next dev` + browser pass over the About page, one PDP, and two Library article pages to confirm diagrams and trust sections render and read correctly. Merge to local `master` only after that passes; no push to `origin` without separate confirmation.

## Explicitly out of scope this round

- Copying any text, imagery, or product photography from any reference site.
- Any pricing not already in `lib/data.ts`.
- Named "Trusted By" clients/logos (category-only, per ground rules above).
- Building a bespoke order-tracking dashboard (using Shopify's native order-status flow instead).
