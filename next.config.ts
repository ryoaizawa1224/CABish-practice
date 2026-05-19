import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",  // Electronのためにstatic HTMLとして出力
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
