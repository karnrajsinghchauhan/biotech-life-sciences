import type { Metadata } from "next"
import { site } from "@/lib/config"

export const metadata: Metadata = { title: "Disclaimer" }

export default function Page() {
  return (
    <section className="section tight">
      <div className="container" style={{ maxWidth: 760 }}>
        <span className="eyebrow">Legal</span>
        <h1 className="h-section">Disclaimer</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 15, color: "var(--ink-2)", marginTop: 8 }}>
          <p><b style={{ color: "var(--ink)" }}>{site.disclaimer}</b></p>
          <p>
            Product descriptions on this website summarize areas of published research interest for each compound
            class. They are provided for scientific context only. They are not claims of efficacy, safety, or
            suitability for any purpose, and they are not medical advice.
          </p>
          <p>
            No statement on this website has been evaluated by any medicines regulator. Products are not medicines,
            are not approved for therapeutic use, and are not supplied for administration to humans or animals under
            any circumstances.
          </p>
          <p>
            Materials in the Research Library are educational descriptions of laboratory practice and analytical
            science. Researchers remain responsible for their own protocols, institutional approvals, and compliance
            with the laws of their jurisdiction.
          </p>
          <p>Questions: {site.email}</p>
        </div>
      </div>
    </section>
  )
}
