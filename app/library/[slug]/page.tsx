import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { articles, articleBySlug } from "@/lib/library"

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = articleBySlug(params.slug)
  return a ? { title: a.title, description: a.summary } : {}
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const a = articleBySlug(params.slug)
  if (!a) notFound()
  const others = articles.filter((x) => x.slug !== a.slug).slice(0, 3)

  return (
    <>
      <div className="container breadcrumb">
        <Link href="/">Home</Link> / <Link href="/library">Research Library</Link> / <span style={{ color: "var(--ink)" }}>{a.title}</span>
      </div>
      <article className="section tight">
        <div className="container" style={{ maxWidth: 760 }}>
          <span className="chip type">{a.category}</span>
          <h1 className="h-section" style={{ marginTop: 14 }}>{a.title}</h1>
          <p className="small" style={{ marginBottom: 30 }}>{a.minutes} min read · Biotech Life Sciences Research Library</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 16, color: "var(--ink-2)", lineHeight: 1.75 }}>
            {a.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="notice" style={{ marginTop: 34 }}>
            This article is educational material about laboratory research practice. It is not medical advice,
            and no compound described here is supplied for human or veterinary use.
          </div>
        </div>
      </article>
      <section className="section tight alt">
        <div className="container">
          <span className="eyebrow">Keep reading</span>
          <div className="grid-3" style={{ marginTop: 18 }}>
            {others.map((o) => (
              <Link key={o.slug} href={`/library/${o.slug}`}>
                <div className="card" style={{ padding: 24 }}>
                  <span className="chip type">{o.category}</span>
                  <h3 style={{ fontSize: 17, margin: "12px 0 6px" }}>{o.title}</h3>
                  <span className="small" style={{ color: "var(--blue)", fontWeight: 600 }}>{o.minutes} min →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
