import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" output packages a self-contained server.js + node_modules,
  // which the Dockerfile copies into the production image. Vercel has its
  // own serverless build/packaging pipeline and does not want this mode —
  // Vercel sets the VERCEL env var during every build, so we only apply
  // "standalone" when building outside Vercel (i.e. for Docker/self-host).
  output: process.env.VERCEL ? undefined : "standalone",
  /* config options here */
  reactStrictMode: false,
};

export default nextConfig;
