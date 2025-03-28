/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public", // Service worker will be stored in "public"
  register: true, // Auto-register the service worker
  skipWaiting: true, // Activate new service workers immediately
});

const nextConfig = withPWA({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["infinitech-api3.site"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "infinitech-api3.site",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://infinitech-api3.site/api/:path*", // ✅ Proxy Laravel API
      },
      {
        source: "/storage/:path*",
        destination: "https://infinitech-api3.site/storage/:path*", // ✅ Proxy Laravel Storage
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true, // Use "true" if this is a permanent redirect (301)
      },
    ];
  },
});

module.exports = nextConfig;
