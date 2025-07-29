/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable React Server Components
  reactStrictMode: true,
  // Improve performance with optimized font loading
  optimizeFonts: true,
  // Enable experimental features
  experimental: {
    // Improve server-side rendering performance
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
