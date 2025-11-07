import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true, // ✅ SSR
  },
};

export default nextConfig;
