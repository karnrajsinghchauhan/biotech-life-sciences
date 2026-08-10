import type { Metadata } from "next"
import Link from "next/link"
import { articles } from "@/lib/library"
import Reveal from "@/components/Reveal"

export const metadata: Metadata = {
  title: "Research Library",
  description: "Peptide fundamentals, COA guides, laboratory testing and research terminology — the Biotech Life Sciences knowledge centre.",
}

export default function LibraryPage() {
  return (
    <>
      <section className="section tight alt">
        <div className="container">
          <span className="eyebrow">Knowledge centre</span>
          <h1 className="h-section">Research Library</h1>
          <p className="lede">
            How research materials are made, tested, documented and handled — written for researchers,
            not marketing. None of this is medical advice.
          </p>
        </div>
      </section>
      <section className="section tight">
        <div className="container">
          <div className="grid-3">
            {articles.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) as 0 | 1 | 2}>
                <Link href={`/library/${a.slug}`}>
                  <div className="card" style={{ padding: 26, height: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                    <span className="chip type" style={{ alignSelf: "flex-start" }}>{a.category}</span>
                    <h3 style={{ fontSize: 19 }}>{a.title}</h3>
                    <p className="small" style={{ flex: 1 }}>{a.summary}</p>
                    <span className="small" style={{ color: "var(--blue)", fontWeight: 600 }}>{a.minutes} min read →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
