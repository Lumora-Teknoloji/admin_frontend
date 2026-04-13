import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/bot-admin",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/:path*`, // Proxy to Backend
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: process.env.NEXT_PUBLIC_BASE_PATH || '/bot-admin',
        permanent: false,
        basePath: false, // Critical: Match / without the base path prefix
      },
      {
        source: '/bot-admin',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
