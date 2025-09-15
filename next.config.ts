import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // ✅ Allow only your image domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "media.beehiiv.com", // ✅ added Beehiiv domain
      },
    ],
    // ✅ Use modern formats
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    // ✅ Useful in Next 15 for React optimizations
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "react-icons"], // example
  },

async headers() {
  return [
    {
      // ✅ Long-term caching for static assets
      source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|js|css|woff2)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      // ❌ Disable caching for NextAuth session & auth routes
      source: "/api/auth/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      ],
    },
    {
      // ✅ Your other API routes can still use caching
      source: "/api/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "s-maxage=60, stale-while-revalidate=120",
        },
      ],
    },
  ];
}

};

export default nextConfig;
