import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['https://damp-haunting-q77wpjpwx5vph4747-3000.app.github.dev/', 'localhost:3000', '127.0.0.1', 'https://trading-app-lac-omega.vercel.app/'],
    },
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
