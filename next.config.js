/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  compress: true,
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  },

  images: {
    domains: ['tokenbr.xyz'],
    formats: ['image/webp', 'image/avif'],
  },

  env: {
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    FORM_WEBHOOK_URL: process.env.FORM_WEBHOOK_URL,
  },

  trailingSlash: true,
  
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  }
}

module.exports = nextConfig