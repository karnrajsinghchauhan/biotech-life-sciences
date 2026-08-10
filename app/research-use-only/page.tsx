import type { Metadata } from "next"
import Link from "next/link"
import { site } from "@/lib/config"

export const metadata: Metadata = { title: "Research Use Only Policy" }

export default function Page() {
  return (
    <section className="section tight">
      <div className="container" style={{ maxWidth: 760 }}>
        <span className="eyebrow">Legal</span>
        <h1 className="h-section">Research Use Only Policy</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 15, color: "var(--ink-2)", marginTop: 8 }}>
          <p><b style={{ color: "var(--ink)" }}>{site.disclaimer}</b></p>
          <p>
            Every product in this catalogue is supplied under a Research Use Only (RUO) framework. By purchasing,
            the buyer confirms that:
          </p>
          <ul style={{ paddingLeft: 22, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Materials will be used exclusively for laboratory research purposes;</li>
            <li>Handling will be performed by suitably qualified individuals in appropriate facilities;</li>
            <li>Materials will not be administered to humans or animals in any form;</li>
            <li>Materials will not be resold or relabelled for consumer use;</li>
            <li>The buyer is responsible for compliance with all laws applicable in their jurisdiction, including import rules.</li>
          </ul>
          <p>
            Orders indicating intended non-research use are refused. A Research Use Only acknowledgement is a
            required step at checkout, and the same statement appears on packaging and documentation.
          </p>
          <p>
            For the distinction between research materials and medicines, see{" "}
            <Link href="/library/research-vs-therapeutic-use" style={{ color: "var(--blue)", fontWeight: 600 }}>
              Research vs Therapeutic Use
            </Link>{" "}
            in the Research Library.
          </p>
        </div>
      </div>
    </section>
  )
}
