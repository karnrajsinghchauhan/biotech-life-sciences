"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

type SpotlightProduct = {
  slug: string
  name: string
  image: string
  category: string
  descriptor: string
  size: string
  price: string
  purity: string
}

export default function HomeProductSpotlight({ products }: { products: SpotlightProduct[] }) {
  const [active, setActive] = useState(0)
  const product = products[active]

  return (
    <div className="spotlight-shell">
      <div className="spotlight-tabs" role="tablist" aria-label="Featured research compounds">
        {products.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls="spotlight-panel"
            id={`spotlight-tab-${item.slug}`}
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.name}
          </button>
        ))}
      </div>

      <div
        className="spotlight-panel"
        id="spotlight-panel"
        role="tabpanel"
        aria-labelledby={`spotlight-tab-${product.slug}`}
        key={product.slug}
      >
        <div className="spotlight-copy">
          <span className="minimal-kicker">{product.category}</span>
          <h3>{product.name}</h3>
          <p>{product.descriptor}</p>
          <div className="spotlight-specs" aria-label={`${product.name} product summary`}>
            <span><small>From</small>{product.price}</span>
            <span><small>Format</small>{product.size}</span>
            <span><small>Specification</small>{product.purity}</span>
          </div>
          <Link href={`/products/${product.slug}`} className="btn primary">
            View product <span aria-hidden="true">↗</span>
          </Link>
          <span className="spotlight-ruo">For laboratory research use only.</span>
        </div>

        <Link className="spotlight-media" href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
          <span className="spotlight-orbit" aria-hidden="true" />
          <Image
            src={product.image}
            alt={`${product.name} research vial`}
            width={620}
            height={1343}
            sizes="(max-width: 760px) 64vw, 420px"
          />
          <span className="spotlight-code" aria-hidden="true">{String(active + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span>
        </Link>
      </div>
    </div>
  )
}
