import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors
  },
};

export default nextConfig;
