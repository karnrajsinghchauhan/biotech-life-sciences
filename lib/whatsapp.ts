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
