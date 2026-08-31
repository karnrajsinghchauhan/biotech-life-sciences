# BIOTECH LIFESCIENCES — Product Requirements & Build Record

## Original problem statement
Build a complete production-quality BIOTECH LIFESCIENCES website using https://supremepeptides.in/ as a visual and UX reference, with an original black, white and blue research-laboratory identity. The experience must include the full catalogue and shopping flow rather than only a landing page: age verification, responsive navigation, product cards and detail pages, variants, search, filters, sorting, wishlist, add-to-cart, buy-now, cart drawer, cart page, checkout, collections, blog, company information, quality, shipping, contact, account UI, legal pages, centralized configuration, original product imagery, accessibility and responsive behavior.

## User choices
- Verified company facts will be provided later.
- Use the exact same 25 products found in the reference catalogue.
- Generate original dark studio vial imagery for each product.
- Use local demo cart, wishlist, checkout form and account UI; payment/auth are not connected.
- Use the reference URL for visual research.

## Architecture decisions
- React single-page application with React Router routes for the complete experience.
- Centralized `products` data in `frontend/src/App.js` for the initial build, with one image, variant list and price record per product.
- LocalStorage persistence for cart, wishlist and age verification.
- Reusable inline components for navigation, product cards, search, cart drawer, informational pages, catalogue and checkout.
- No authentication or payment integration was added because the user requested a local demo until credentials/services are supplied.
- Black/white/blue visual system follows `/app/design_guidelines.json`; no purple, violet, pink, orange or gold accents.

## User personas
- Laboratory professionals reviewing research material specifications.
- Qualified researchers comparing variants, pricing and documentation availability.
- Operations or purchasing staff needing a fast, traceable catalogue and local order draft.

## Core requirements (static)
- Premium dark scientific catalogue aesthetic.
- Exact 25 reference products with dedicated generated vial imagery.
- Product variants, discounts, availability, wishlist, cart and checkout summary.
- Search overlay, category filters and sorting.
- Responsive navigation and layouts at desktop and mobile widths.
- Neutral placeholders for unverified claims and documents.
- Research-use-only language without medical-use claims.

## Implemented — 2026-08-31
- Built homepage hero, announcement bar, sticky navigation, mobile menu, age gate, scientific visualization, stats, ticker, feature band and featured catalogue.
- Added all 25 reference products with generated original imagery and centralized variant/price/image data.
- Added `/products`, product detail routes, filters, sort, search overlay and product cards.
- Added wishlist toggles and LocalStorage persistence.
- Added cart drawer, quantity controls, cart badge, add-to-cart and buy-now behavior with LocalStorage persistence.
- Added checkout demo UI, collections, collection routes, blog, about, quality, shipping, contact, account and legal pages.
- Added accessible focus states and descriptive `data-testid` coverage for key user-facing controls.
- Verified production build, desktop interaction flow, mobile menu/search/wishlist/cart flow, and focused 390px overflow retest.

## Prioritized backlog
### P0
- Replace all `[INSERT VERIFIED INFORMATION]` placeholders with verified BIOTECH LIFESCIENCES facts.
- Upload and link real batch documents / COAs only when available.

### P1
- Connect authentication and persisted customer accounts.
- Connect a real payment provider and order creation service.
- Move centralized catalogue/configuration into dedicated data modules or an admin-managed backend.

### P2
- Add verified article metadata, canonical SEO metadata, sitemap and structured data.
- Add order confirmation, tracking and document download analytics.

## Next tasks
1. Receive verified company details, legal text, dispatch wording, contact information and documentation.
2. Replace local demo checkout with a connected payment/order workflow.
3. Connect account authentication and order history.