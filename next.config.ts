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
};

export default nextConfig;
