const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = withPWA({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["localhost", "infinitech-api3.site"],
    remotePatterns: [
      {
        // protocol: "https",
        protocol: "http",
        // hostname: "infinitech-api3.site",
        hostname: "localhost:8000",
        pathname: "/storage/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // destination: "https://infinitech-api3.site/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
      {
        source: "/storage/:path*",
        // destination: "https://infinitech-api3.site/storage/:path*",
        destination: "http://localhost:8000/storage/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
});

module.exports = nextConfig;
