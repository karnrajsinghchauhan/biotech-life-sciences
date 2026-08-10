import type { Metadata } from "next"
import CatalogClient from "./CatalogClient"

export const metadata: Metadata = {
  title: "Research Catalogue",
  description: "The complete Biotech Life Sciences research compound catalogue — peptides, blends, proteins and research compounds, batch documented.",
}

export default function ProductsPage() {
  return <CatalogClient />
}
