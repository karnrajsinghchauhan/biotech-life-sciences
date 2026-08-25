import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import AnnouncementBar from "@/components/AnnouncementBar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import SupportWidget from "@/components/SupportWidget"
import CookieConsent from "@/components/CookieConsent"
import AgeGate from "@/components/AgeGate"
import { site } from "@/lib/config"

// Geist — self-hosted, zero layout shift, the closest well-supported free
// web typeface to Apple's SF Pro. Replaces Inter/Space Grotesk everywhere.

const DESCRIPTION =
  "Premium research peptides manufactured to exacting standards — HPLC & MS verified, batch documented, supplied for laboratory research use only. Biotech Life Sciences, United Kingdom."

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Premium Research Peptides`,
    template: `%s · ${site.name}`,
  },
  description: DESCRIPTION,
  applicationName: site.name,
  keywords: [
    "research peptides", "laboratory research", "peptide catalogue",
    "certificate of analysis", "batch verification", "HPLC", "mass spectrometry",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Premium Research Peptides`,
    description: DESCRIPTION,
    url: site.url,
    images: [{ url: "/images/brand/logo-full.png", width: 720, height: 541, alt: `${site.name} logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Premium Research Peptides`,
    description: DESCRIPTION,
    images: ["/images/brand/logo-full.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
}

// Organization schema — only facts supplied by the company's own catalogue.
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/images/brand/logo-full.png`,
  foundingDate: String(site.founded),
  email: site.email,
  telephone: site.phone,
  address: { "@type": "PostalAddress", addressLocality: "Oxford", addressCountry: "GB" },
  description: DESCRIPTION,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <a href="#main" className="skip-link">Skip to content</a>
        <AnnouncementBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <SupportWidget />
        <CookieConsent />
        <AgeGate />
      </body>
    </html>
  )
}
