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
