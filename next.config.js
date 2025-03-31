import { withFaust } from '@faustwp/core';
import { createSecureHeaders } from 'next-secure-headers';

/** @type {import('next').NextConfig} */
export default withFaust({
  async headers() {
    return [
      {
        source: '/:path*',
        headers: createSecureHeaders({
          xssProtection: false,
        }),
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.considbrs.se',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.ngrok-free.app',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
});
