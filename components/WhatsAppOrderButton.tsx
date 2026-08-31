"use client"

import { Product, Size } from "@/lib/data"
import {
  buildWhatsAppOrderLink,
  buildBundleWhatsAppLink,
  buildShopifyProductWhatsAppLink,
} from "@/lib/whatsapp"

type SingleProps = { product: Product; size?: Size; products?: undefined; title?: undefined }
type BundleProps = { products: Product[]; product?: undefined; size?: undefined; title?: undefined }
type ShopifyProps = { title: string; product?: undefined; products?: undefined; size?: undefined }
type Props = (SingleProps | BundleProps | ShopifyProps) & { label?: string; className?: string }

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
    : props.title
    ? buildShopifyProductWhatsAppLink(props.title)
    : buildWhatsAppOrderLink(props.product as Product, props.size)

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} whatsapp-btn`}>
      <WhatsAppGlyph />
      {label || "Order on WhatsApp"}
    </a>
  )
}
