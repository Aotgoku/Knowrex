import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  serverExternalPackages: [
    '@xenova/transformers',
    'pdf-parse',
    'mammoth',
    '@pinecone-database/pinecone',
    'formidable'
  ],
  ...(process.env.DOCKER_BUILD === 'true' ? { output: 'standalone' } : {}),
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none';" },
          ...(process.env.NODE_ENV === 'production'
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
