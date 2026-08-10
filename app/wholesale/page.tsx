import type { Metadata } from "next"
import WholesaleClient from "./WholesaleClient"

export const metadata: Metadata = {
  title: "Research Supply & Wholesale",
  description: "Bulk research orders, institutional procurement, recurring supply and custom compound requests.",
}

export default function WholesalePage() {
  return <WholesaleClient />
}
