import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove production source maps to protect code and shrink client download
  productionBrowserSourceMaps: false,

  // Remove X-Powered-By header for security and clean headers
  poweredByHeader: false,

  // Enable Gzip/Brotli compression
  compress: true,

  // Tree-shake and shrink JavaScript bundle sizes for heavy libraries
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@base-ui/react",
      "@radix-ui/react-tabs",
      "date-fns",
    ],
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  // Security Headers and CORS Policy
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_SITE_URL || "https://sloturself.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
