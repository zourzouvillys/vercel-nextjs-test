import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Pin the hotloaded clerk-js bundle to test the Protect assertion canary
    // (clerk/javascript 44edcc9 + 52ec5cd), loaded via
    // https://<frontend-api>/npm/@clerk/clerk-js@<version>/dist/clerk.browser.js
    NEXT_PUBLIC_CLERK_JS_VERSION: "6.29.0-canary.v20260812005540",
  },
};

export default nextConfig;
