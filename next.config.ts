import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mtnppzhgdzjbzddobdap.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/th',
        destination: '/manserv/samarth/th',
        permanent: true,
      },
      {
        source: '/ja',
        destination: '/manserv/samarth/jp',
        permanent: true,
      },
      {
        source: '/zh',
        destination: '/manserv/samarth/ch',
        permanent: true,
      },
      {
        source: '/hi',
        destination: '/manserv/samarth/In',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
