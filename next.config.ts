import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io'],
  },
  compiler: {
    removeConsole: true,
  },
};

export default nextConfig;
