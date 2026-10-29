import type { NextConfig } from "next";

/** Routes from before multi-course support; they now live under the AWS course. */
const LEGACY_COURSE = "aws-aif-c01";
const LEGACY_ROUTES = ["start", "lesson", "quest", "exam", "guide", "boss", "lightning", "match", "flashcards", "review", "cheatsheet"];

const nextConfig: NextConfig = {
  cacheComponents: true,
  async redirects() {
    return LEGACY_ROUTES.map((r) => ({
      source: `/${r}/:path*`,
      destination: `/c/${LEGACY_COURSE}/${r}/:path*`,
      permanent: false,
    }));
  },
  partialPrefetching: true,
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
