/** @type {import('next').NextConfig} */
const isGhPages = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "gh-pages";
const basePath = isGhPages ? process.env.NEXT_PUBLIC_BASE_PATH || "" : "";

const nextConfig = {
  reactStrictMode: true,
  output: isGhPages ? "export" : undefined,
  trailingSlash: isGhPages,
  basePath,
  assetPrefix: isGhPages && basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: isGhPages,
  },
};

module.exports = nextConfig;
