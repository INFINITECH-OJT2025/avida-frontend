/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "8000",
                pathname: "/storage/**", // ✅ Allow Laravel storage images
            },
        ],
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
};

module.exports = nextConfig;
