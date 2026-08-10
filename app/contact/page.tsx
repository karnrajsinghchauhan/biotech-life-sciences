import type { Metadata } from "next"
import ContactClient from "./ContactClient"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Biotech Life Sciences — research support, order questions, documentation and wholesale.",
}

export default function ContactPage() {
  return <ContactClient />
}
