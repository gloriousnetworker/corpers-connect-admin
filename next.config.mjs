import withPWAInit from '@ducanh2912/next-pwa';

// Single source of truth for the backend URL.
// Set NEXT_PUBLIC_API_URL in .env.local (dev) and Vercel env vars (prod).
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://corpers-connect-server-production.up.railway.app';

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: false,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
  fallbacks: {
    document: '/offline',
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
  // Dev-only proxy: routes /api/proxy/* → Railway backend to avoid CORS in local dev.
  // In production NEXT_PUBLIC_API_URL points directly to Railway so this path is never used.
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') return [];
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${API_URL}/api/v1/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
