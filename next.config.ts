import type { NextConfig } from "next";

// Static export: the site is pre-rendered to /out, so it can be served by any
// static host (or from your computer for now) and the service worker can
// precache every page and asset.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
