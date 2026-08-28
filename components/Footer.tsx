import Link from "next/link"
import Image from "next/image"
import { site } from "@/lib/config"

const PRIMARY = [
  ["Shop", "/shop"],
  ["Verify a COA", "/coa"],
  ["Research library", "/library"],
  ["Wholesale", "/wholesale"],
]

const LEGAL = [
  ["Research use only", "/research-use-only"],
  ["Shipping", "/shipping"],
  ["Returns", "/returns"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
]

export default function Footer() {
  return (
    <footer className="footer minimal-footer">
      <div className="container">
        <div className="minimal-footer-top">
          <Link href="/" aria-label="Biotech Life Sciences — home" className="minimal-footer-brand">
            <Image src="/images/brand/logo-mark.png" alt="" width={360} height={321} />
            <span>Biotech<small>Life Sciences</small></span>
          </Link>
          <p>Documented research compounds for qualified laboratory use.</p>
          <a href={`mailto:${site.email}`} className="text-link">{site.email}</a>
        </div>

        <div className="minimal-footer-links">
          <nav aria-label="Footer primary">
            {PRIMARY.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <nav aria-label="Footer legal">
            {LEGAL.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
        </div>

        <div className="footer-disclaimer">{site.disclaimer}</div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>{site.location}</span>
        </div>
      </div>
    </footer>
  )
}
