import type { NextConfig } from "next";

// CI passes the Pages base path; must match the GitHub repo name (served at /<repo>/).
const basePath = process.env.PAGES_BASE_PATH ?? "/sarcoma.webtool";

const nextConfig: NextConfig = {
  // cacheComponents/partialPrefetching are omitted: PPR is incompatible with static export.
  output: "export",
  basePath,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
