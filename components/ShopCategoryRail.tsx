import { categories, inCategory } from "@/lib/data"
import { shopCategoryLabel, shopCategoryColor, shopCategoryEmoji } from "@/lib/shopLabels"

export default function ShopCategoryRail() {
  const populated = categories.filter((c) => inCategory(c.slug).length > 0)
  return (
    <div className="shop-rail" role="list" aria-label="Shop by category">
      {populated.map((c) => (
        <a
          key={c.slug}
          href={`#shop-${c.slug}`}
          className="shop-rail-card"
          role="listitem"
          style={{ borderLeftColor: shopCategoryColor[c.slug] }}
        >
          <span className="shop-rail-emoji" aria-hidden="true">{shopCategoryEmoji[c.slug]}</span>
          <b>{shopCategoryLabel[c.slug]}</b>
          <span>{inCategory(c.slug).length} products</span>
        </a>
      ))}
    </div>
  )
}
