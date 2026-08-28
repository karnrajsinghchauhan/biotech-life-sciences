import Image from "next/image"
import Link from "next/link"
import { Product, categoryBySlug } from "@/lib/data"
import { shopCategoryLabel, shopCategoryColor } from "@/lib/shopLabels"
import Vial from "./Vial"
import Pen from "./Pen"

export default function ShopProductCard({ p }: { p: Product }) {
  const fromPrice = p.sizes[0]?.price
  const accent = shopCategoryColor[p.category]
  const cat = categoryBySlug(p.category)
  const productHref = `/products/${p.slug}`

  return (
    <article className="card pcard" style={{ borderTopColor: accent, borderTopWidth: 2, borderTopStyle: "solid" }}>
      <Link href={productHref} className="pcard-media vial-stage" aria-label={`View ${p.name}`}>
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
        <Link href={productHref} className="pcard-name">{p.name}</Link>
        <div className="pcard-sub">{p.altName || p.compoundType}</div>
        <div className="pcard-price">
          <span>from </span>₹{fromPrice?.toLocaleString("en-IN")}
        </div>
        <div className="pcard-actions">
          <Link href={productHref} className="btn primary sm">View product & buy</Link>
        </div>
      </div>
    </article>
  )
}
