import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the digital AI variants were the hologram ones: their old addresses still lead there (not permanent,
  // so a browser does not hold on to it if the names change again)
  async redirects() {
    return [
      { source: "/website-hologram", destination: "/website-digital-ai", permanent: false },
      { source: "/6labs-fullview-hologram", destination: "/6labs-fullview-digital-ai", permanent: false },
    ];
  },
};

export default nextConfig;
