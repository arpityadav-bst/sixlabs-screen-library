import type { NextConfig } from "next";

// How long a browser keeps the site's own pictures, clips and textures (public/) before it asks again. Without
// this every visit asked for each of them again (a quick "unchanged" answer each, but well over a hundred of
// them before the hero's floor could start). For a day now nothing is asked, and after that the cached copy is
// used at once while it is checked in the background. The baked textures' names change with their content
// (tools/tiles/bake-textures.mjs), so they are kept a year. floor-params.json is asked every time: the floor's
// settings must match the page that reads them.
const DAY = "public, max-age=86400, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
  async headers() {
    return [
      ...["/tiles/:path*", "/tiles-holo/:path*", "/players/:path*", "/players-holo/:path*", "/footer/:path*", "/brand/:path*"].map(
        (source) => ({ source, headers: [{ key: "Cache-Control", value: DAY }] }),
      ),
      { source: "/tiles/baked/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/tiles/floor-params.json", headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }] },
    ];
  },
  // the hologram pages were the "digital AI" variants (and before that "hologram"): their old addresses lead
  // to the pages that are now the hologram ones (not permanent, so a browser does not hold on to it)
  async redirects() {
    return [
      { source: "/website-digital-ai", destination: "/website", permanent: false },
      { source: "/6labs-fullview-digital-ai", destination: "/6labs-fullview", permanent: false },
      { source: "/website-hologram", destination: "/website", permanent: false },
      { source: "/6labs-fullview-hologram", destination: "/6labs-fullview", permanent: false },
    ];
  },
};

export default nextConfig;
