import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A self-contained server in .next/standalone, for the Docker image
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  // Lets a verification build use its own folder so it never clobbers a running `next dev`
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // The browser only talks to this app; /api is forwarded to the backend, so the session cookie is first-party
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${process.env.API_URL || "http://localhost:4000"}/api/:path*` }];
  },
};

export default nextConfig;
