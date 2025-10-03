import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.thelocalloopfl.com' }],
        destination: 'https://thelocalloopfl.com/:path*',
        permanent: true, // 308 on Vercel
      },
    ];
  },

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
        hostname: "media.beehiiv.com",
      },
      {
        protocol: "https",
        hostname: "beehiiv-images-production.s3.amazonaws.com",
      },
    ],

     // ✅ Add allowed qualities here
    qualities: [75, 80, 90, 100],
    // ✅ Use modern formats
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    // ✅ Useful in Next 15 for React optimizations
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "react-icons"], // example
  },
  
};

export default nextConfig;
