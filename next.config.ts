import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  // Lets a verification build use its own folder so it never clobbers a running `next dev`
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
