import Link from "next/link"
import Image from "next/image"
import { Product, categoryBySlug } from "@/lib/data"
import { shopCategoryLabel, shopCategoryColor } from "@/lib/shopLabels"
import WhatsAppOrderButton from "./WhatsAppOrderButton"
import Vial from "./Vial"
import Pen from "./Pen"

export default function ShopProductCard({ p }: { p: Product }) {
  const fromPrice = p.sizes[0]?.price
  const accent = shopCategoryColor[p.category]
  const cat = categoryBySlug(p.category)

  return (
    <article className="card pcard" style={{ borderTopColor: accent, borderTopWidth: 2, borderTopStyle: "solid" }}>
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
        ) : p.deviceType === "pen" ? (
          <Pen code={p.code} name={p.name} size={104} />
        ) : (
          <Vial code={p.code} name={p.name} size={104} />
        )}
      </Link>
      <div className="pcard-body">
        {cat && (
          <span className="cat-chip" style={{ color: accent, borderColor: `${accent}55`, background: `${accent}14` }}>
            <span className="cat-chip-dot" style={{ background: accent }} />
            {shopCategoryLabel[p.category]}
          </span>
        )}
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
