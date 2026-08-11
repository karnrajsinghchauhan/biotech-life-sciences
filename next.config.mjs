/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Shopify serves product media from its CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
}
export default nextConfig
