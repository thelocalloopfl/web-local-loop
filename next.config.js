/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
