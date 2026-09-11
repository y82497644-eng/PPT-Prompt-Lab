import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  serverExternalPackages: ["pdfjs-dist"],
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
