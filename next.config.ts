import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath: '/wassuh', // Removed - serving from root for wassuh.com
  // output: 'export', // Disabled for API routes (Stripe)
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  turbopack: {
    rules: {
      '*.glb': {
        loaders: ['file-loader'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
