import type { Metadata } from "next"
import FaqClient from "./FaqClient"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions — research use, quality, COAs, payments, shipping and refunds.",
}

export default function FaqPage() {
  return <FaqClient />
}
