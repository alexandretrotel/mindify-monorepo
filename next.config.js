const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  scope: "/app",
  disable: process.env.NODE_ENV !== "production"
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withPWA({});
