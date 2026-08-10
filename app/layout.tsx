import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart"
import AnnouncementBar from "@/components/AnnouncementBar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CartDrawer from "@/components/CartDrawer"
import SupportWidget from "@/components/SupportWidget"
import { site } from "@/lib/config"

// Self-hosted by next/font — no external request, no layout shift.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <a href="#main" className="skip-link">Skip to content</a>
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <SupportWidget />
        </CartProvider>
      </body>
    </html>
  )
}
