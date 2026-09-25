import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Static export, so there is no image server to resize anything: every file
  // in public/ is served exactly as it sits on disk and is sized for its slot
  // at build time instead.
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
