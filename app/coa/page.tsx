import type { Metadata } from "next"
import CoaClient from "./CoaClient"

export const metadata: Metadata = {
  title: "COA Verification",
  description: "Verify a Biotech Life Sciences batch — Certificate of Analysis lookup by batch number, SKU or product.",
}

export default function CoaPage() {
  return <CoaClient />
}
