import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.redd.it' },
      { protocol: 'https', hostname: 'i.redd.it' },
    ],
  },
};

export default nextConfig;
