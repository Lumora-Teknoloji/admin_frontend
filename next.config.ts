import type { NextConfig } from "next";

// @ts-ignore
const nextConfig = {
  output: 'standalone',
  basePath: '/admin',
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/api/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
