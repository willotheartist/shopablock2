import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Clerk proxy endpoints
      { source: "/_clerk/:path*", destination: "https://proxy.clerk.services/:path*" },
    ];
  },
};

export default nextConfig;
