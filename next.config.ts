import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      // Legacy uploadthing domain
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
      // latest uploadthing domain
      {
        protocol: 'https',
        hostname: '*.ufs.sh',
        port: '',
      },
    ],
  },
};

export default nextConfig;
