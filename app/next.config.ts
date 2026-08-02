import type { NextConfig } from "next";

const staticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  basePath,
  output: staticExport ? "export" : undefined,
  images: {
    unoptimized: staticExport,
  },
  reactStrictMode: true,
};

export default nextConfig;
