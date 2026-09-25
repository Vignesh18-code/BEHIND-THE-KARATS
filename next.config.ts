import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Serve prebuilt responsive images without requiring an image server.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [320, 480, 640, 960, 1280, 1920],
    imageSizes: [160, 240],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
