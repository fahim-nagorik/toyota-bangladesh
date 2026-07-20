import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The model pages moved from /vehicles/* to /models/* when the nav was
  // renamed. Permanent redirects keep any already-shared link working.
  async redirects() {
    return [
      {
        source: "/vehicles/:slug",
        destination: "/models/:slug",
        permanent: true,
      },
      {
        source: "/vehicles",
        destination: "/#models",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
