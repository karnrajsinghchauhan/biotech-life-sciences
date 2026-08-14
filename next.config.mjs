/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Shopify serves product media from its CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
  async redirects() {
    return [
      // The custom checkout was retired — Shopify Checkout (via /shop) is the
      // one canonical, real-payment purchase path. Redirect old links/bookmarks.
      { source: "/checkout", destination: "/shop", permanent: true },
    ]
  },
}
export default nextConfig
