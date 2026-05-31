import type { NextConfig } from "next";

const workerUrl = process.env.WORKER_URL || "http://127.0.0.1:8080";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@typstbox/shared-types"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${workerUrl}/:path*`,
      },
    ];
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
};

export default nextConfig;
