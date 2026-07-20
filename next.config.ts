import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The model pages moved from /vehicles/* to /models/* when the nav was
  // renamed. Permanent redirects keep any already-shared link working.
  async redirects() {
    return [
      {
        // Extensionless segments only. The vehicle photography is served from
        // public/vehicles/*.webp, and an unrestricted :slug would redirect
        // those image requests to /models/*.webp and break every car image.
        source: "/vehicles/:slug([^.]+)",
        destination: "/models/:slug",
        permanent: true,
      },
      {
        source: "/vehicles",
        destination: "/models",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
