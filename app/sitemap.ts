import type { MetadataRoute } from "next"
import { products, categories } from "@/lib/data"
import { articles } from "@/lib/library"
import { site } from "@/lib/config"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url
  const now = new Date()

  const stat = [
    "", "/shop", "/products", "/categories", "/coa", "/batch-reports", "/library",
    "/about", "/quality", "/wholesale", "/contact", "/faq", "/calculator", "/shipping",
    "/returns", "/privacy", "/terms", "/disclaimer", "/research-use-only",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : p === "/shop" || p === "/products" ? 0.9 : 0.6,
  }))

  return [
    ...stat,
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...categories.map((c) => ({
      url: `${base}/categories/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${base}/library/${a.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ]
}
