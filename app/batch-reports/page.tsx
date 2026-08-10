import type { Metadata } from "next"
import BatchReportsClient from "./BatchReportsClient"

export const metadata: Metadata = {
  title: "Batch Reports",
  description:
    "Search Biotech Life Sciences batch documentation by product, batch number, test date, laboratory or report number.",
}

export default function BatchReportsPage() {
  return <BatchReportsClient />
}
