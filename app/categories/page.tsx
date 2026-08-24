import type { Metadata } from "next"
import Link from "next/link"
import { categories, inCategory } from "@/lib/data"
import { shopCategoryLabel, shopCategoryColor, shopCategoryEmoji } from "@/lib/shopLabels"
import Reveal from "@/components/Reveal"

export const metadata: Metadata = {
  title: "Research Areas",
  description: "Explore the Biotech Life Sciences catalogue by research area — tissue repair, dermal, cellular, metabolic, cognitive and more.",
}

export default function CategoriesPage() {
  return (
    <>
      <section className="section tight alt">
        <div className="container">
          <span className="eyebrow">Research areas</span>
          <h1 className="h-section">Explore by research category</h1>
          <p className="lede">Compounds can appear in multiple research areas where the published literature supports it.</p>
        </div>
      </section>
      <section className="section tight">
        <div className="container">
          <div className="grid-3">
            {categories.map((c, i) => {
              const n = inCategory(c.slug).length
              if (n === 0) return null
              const accent = shopCategoryColor[c.slug]
              return (
                <Reveal key={c.slug} delay={(i % 3) as 0 | 1 | 2}>
                  <Link href={`/categories/${c.slug}`}>
                    <div
                      className="card catcard"
                      style={{ borderTopColor: accent, borderTopWidth: 2, borderTopStyle: "solid" }}
                    >
                      <span className="catcard-emoji" style={{ background: `${accent}1c`, color: accent }} aria-hidden="true">
                        {shopCategoryEmoji[c.slug]}
                      </span>
                      <h3>{shopCategoryLabel[c.slug]}</h3>
                      <p>{c.text}</p>
                      <span className="count" style={{ color: accent }}>{n} compounds →</span>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
