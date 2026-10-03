import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Next.js App Router streams its hydration payload via inline <script> tags
// (self.__next_f.push). A strict `script-src 'self'` blocks these and the page
// never hydrates. 'unsafe-inline' is the documented "Without Nonces" approach
// that keeps the site statically generated and CDN-cacheable. For stricter CSP,
// switch to a nonce-based policy via proxy.ts (forces dynamic rendering).
//
// NOTE: `experimental.sri` was intentionally removed. SRI adds integrity hashes
// to chunk <script> tags; if a CDN/proxy recompresses those chunks the hash no
// longer matches and the browser blocks them, breaking hydration in production
// only (works locally). The progressive-enhancement reveal in globals.css also
// guards against any hydration failure by keeping content visible by default.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self' data:;
  connect-src 'self' https://*.publicnode.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspHeader.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
