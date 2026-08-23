import Link from "next/link"
import Image from "next/image"
import { Product, categoryBySlug } from "@/lib/data"
import Vial from "./Vial"
import Pen from "./Pen"

function MolPattern() {
  return (
    <svg className="pcard-mol" viewBox="0 0 300 215" fill="none" aria-hidden="true">
      <g stroke="#1156d6" strokeWidth="1" opacity="0.5">
        <path d="M30 40l40 20 40-20 40 20 40-20 40 20 40-20" />
        <path d="M30 170l40-20 40 20 40-20 40 20 40-20 40 20" />
        <circle cx="70" cy="60" r="4" fill="#1156d6" /><circle cx="150" cy="60" r="4" fill="#0e9a8d" />
        <circle cx="230" cy="60" r="4" fill="#1156d6" /><circle cx="70" cy="150" r="4" fill="#0e9a8d" />
        <circle cx="150" cy="150" r="4" fill="#1156d6" /><circle cx="230" cy="150" r="4" fill="#0e9a8d" />
      </g>
    </svg>
  )
}

export default function ProductCard({ p }: { p: Product }) {
  const cat = categoryBySlug(p.category)

  return (
    <article className="card pcard">
      <Link href={`/products/${p.slug}`} className="pcard-media vial-stage" aria-label={p.name}>
        <span className="pcard-tag">{cat?.name}</span>
        <span className="pcard-flags">
          {p.isNew && <span className="flag new">New</span>}
          {p.bestSeller && <span className="flag best">Best Seller</span>}
        </span>
        {p.image ? (
          // Real product photography from the company catalogue.
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
          <>
            <MolPattern />
            {p.deviceType === "pen" ? (
              <Pen code={p.code} name={p.name} size={104} />
            ) : (
              <Vial code={p.code} name={p.name} size={104} />
            )}
          </>
        )}
      </Link>
      <div className="pcard-body">
        <div>
          <Link href={`/products/${p.slug}`} className="pcard-name">{p.name}</Link>
          <div className="pcard-sub">{p.altName || p.compoundType}{p.code ? ` · ${p.code}` : ""}</div>
        </div>
        <p className="pcard-desc">{p.overview}</p>
        <div className="pcard-meta">
          <span className="chip type">{p.compoundType}</span>
          {p.coa ? <span className="chip doc">✓ COA Available</span> : <span className="chip type">Batch documented</span>}
        </div>
        <div className="pcard-foot">
          <Link href={`/products/${p.slug}`} className="btn primary sm wide">View Research &amp; Pricing →</Link>
        </div>
      </div>
    </article>
  )
}
