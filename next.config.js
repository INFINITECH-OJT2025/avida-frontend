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
    domains: ["infinitech-api3.site"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "infinitech-api3.site",
        pathname: "/storage/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://infinitech-api3.site/api/:path*",
      },
      {
        source: "/storage/:path*",
        destination: "https://infinitech-api3.site/storage/:path*",
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
