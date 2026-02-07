import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ceo-manserv',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
