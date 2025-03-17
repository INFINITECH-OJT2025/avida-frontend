/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["127.0.0.1"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
    eslint:{
      ignoreDuringBuilds: true,
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*", // ✅ Proxy Laravel API
      },
      {
        source: "/storage/:path*",
        destination: "http://127.0.0.1:8000/storage/:path*", // ✅ Proxy Laravel Storage
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
};
const withPWA = require("next-pwa")({
  dest: "public",  // Service worker will be stored in "public"
  register: true,  // Auto-register the service worker
  skipWaiting: true,  // Activate new service workers immediately
});

module.exports = withPWA({
  reactStrictMode: true,
});

module.exports = nextConfig;
