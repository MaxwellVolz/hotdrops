import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  experimental: {
    turbo: {
      rules: {
        '*.glb': {
          loaders: ['file-loader'],
          as: '*.js',
        },
      },
    },
  },
};

export default nextConfig;
