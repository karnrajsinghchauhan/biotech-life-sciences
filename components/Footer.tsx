import Link from "next/link"
import Image from "next/image"
import { site } from "@/lib/config"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Image
              src="/images/brand/logo-full.png"
              alt="Biotech Life Sciences"
              width={720}
              height={541}
              style={{ width: "auto", height: 78, marginBottom: 18 }}
            />
            <p style={{ fontSize: 13.5, maxWidth: 300, color: "rgba(255,255,255,0.6)" }}>
              Premium research peptides, manufactured to exacting standards and documented batch by batch. {site.location}.
            </p>
            <p className="mono" style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
              {site.email}<br />{site.phone}<br />{site.hours}
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/categories/tissue-repair">Tissue Repair</Link></li>
              <li><Link href="/categories/dermal">Dermal Research</Link></li>
              <li><Link href="/categories/cellular">Cellular Research</Link></li>
              <li><Link href="/categories/metabolic">Metabolic Research</Link></li>
              <li><Link href="/categories/cognitive">Neuro Research</Link></li>
              <li><Link href="/categories/longevity">Longevity</Link></li>
            </ul>
          </div>
          <div>
            <h4>Research</h4>
            <ul>
              <li><Link href="/library">Research Library</Link></li>
              <li><Link href="/products">Compound Directory</Link></li>
              <li><Link href="/coa">COA Verification</Link></li>
              <li><Link href="/batch-reports">Batch Reports</Link></li>
              <li><Link href="/categories">Research Categories</Link></li>
              <li><Link href="/quality">Our Standards</Link></li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/shipping">Shipping</Link></li>
              <li><Link href="/returns">Returns &amp; Refunds</Link></li>
              <li><Link href="/wholesale">Wholesale</Link></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
              <li><Link href="/research-use-only">Research Use Only</Link></li>
              <li><Link href="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-disclaimer">{site.disclaimer}</div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span className="mono">{site.domain}</span>
        </div>
      </div>
    </footer>
  )
}
