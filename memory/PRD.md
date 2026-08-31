# BIOTECH LIFESCIENCES — PRD

## Original problem statement
Build a complete, production-quality e-commerce website for BIOTECH LIFESCIENCES with black/white/blue aesthetic, later pivoted to strict monochrome (black/white/grey).

## User personas
- Independent researchers and laboratory buyers in India seeking HPLC-verified compounds
- Institutional / bulk procurement (universities, research organisations)

## Static core requirements
- Multi-page e-commerce mockup (Home, Products, PDP, Collections, Blog, About, Quality, Shipping, Contact, Cart, Checkout, Wishlist, Account, Legal)
- Centralized product data, working cart drawer, filters, search, wishlist, variant selection
- Trust-forward UX: 99%+ purity, HPLC + Mass Spec, COA per batch prominently visible

## What's been implemented
- 2026-02-28 · Full site scaffold with 25 original grayscale product images, cart/wishlist persistence, filters, search, age gate
- 2026-02-28 · Monochrome pivot (removed all blue, switched to Geist font, grayscale product images via CSS filter)
- 2026-02-28 · Trust-forward copy pass on Home + PDP + Announcement + Ticker + Features
- 2026-02-28 · Rich editorial copy for About / Quality / Shipping / Contact / Blog (replaced [INSERT VERIFIED] placeholders)
- 2026-02-28 · Request COA feature with mailto: + wa.me deep links on product detail

## Backlog / next tasks (P0 → P2)
- P0 · Integrate user's GitHub code (URL not yet provided)
- P0 · Replace wordmark with user's PDF logo (file not yet provided)
- P1 · Real COA PDF uploads (currently the Request COA flow triggers email/WhatsApp — no static PDFs yet)
- P1 · Extract App.js monolith into /pages and /components folders
- P2 · Backend for account, orders, checkout, contact form submissions
- P2 · Real payment integration (Stripe / Razorpay)

## Mocked / not connected
- Checkout (demo only — no payment provider connected)
- Account authentication
- Backend APIs, database (product data is a frontend constant)
