/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';

// Added Vercel Analytics allowed sources
// va.vercel-scripts.com is where the script is loaded from
// vitals.vercel-insights.com is where the data is sent to
const VERCEL_SRC = [
  'https://va.vercel-scripts.com',
  'https://vitals.vercel-insights.com',
];

const GOOGLE_SCRIPT_SRC = [
  'https://pagead2.googlesyndication.com',
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  ...VERCEL_SRC,
];
const GOOGLE_FRAME_SRC = [
  'https://googleads.g.doubleclick.net',
  'https://tpc.googlesyndication.com',
  'https://www.google.com',
];
const GOOGLE_CONNECT_SRC = [
  'https://www.google-analytics.com',
  'https://region1.google-analytics.com',
  'https://pagead2.googlesyndication.com',
  'https://googleads.g.doubleclick.net',
  ...VERCEL_SRC,
];

const scriptSrc = ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : []), ...GOOGLE_SCRIPT_SRC];

const connectSrc = [
  "'self'",
  ...GOOGLE_CONNECT_SRC,
  ...(isDev ? ['ws://localhost:*', 'http://localhost:*'] : []),
].join(' ');

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src ${scriptSrc.join(' ')}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      `connect-src ${connectSrc}`,
      `frame-src ${GOOGLE_FRAME_SRC.join(' ')}`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: false },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

module.exports = nextConfig;
