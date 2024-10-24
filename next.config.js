const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  scope: "/",
  disable: process.env.NODE_ENV !== "production"
});

const withMDX = require("@next/mdx")({});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"]
};

module.exports = withMDX(
  withPWA({
    ...nextConfig
  })
);
