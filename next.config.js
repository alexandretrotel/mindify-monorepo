const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV !== "production"
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withPWA({
  nextConfig
});
